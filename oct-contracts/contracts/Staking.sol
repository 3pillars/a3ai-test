// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title Staking
 * @notice Staking contract for OCT token with rewards and cooldown
 * @dev Allows users to stake OCT and earn rewards, with cooldown period for unstaking
 *
 * Features:
 * - Stake OCT tokens for service access
 * - Earn rewards based on staking duration
 * - 7-day cooldown period for unstaking
 * - Slashing mechanism for misbehavior
 * - Reward distribution from treasury
 *
 * Reward Calculation:
 * - Base APY: 10%
 * - Bonus for longer staking: up to 5% extra
 * - Slashing for early withdrawal: varies
 */
contract Staking is Ownable, Pausable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    /// @notice OCT token interface
    IERC20 public immutable octToken;

    /// @notice Stake struct
    struct Stake {
        uint256 amount;          // Staked amount
        uint256 startTime;       // When stake started
        uint256 rewards;         // Accumulated rewards
        uint256 lastUpdateTime;  // Last reward update
        uint256 cooldownStart;   // When cooldown started (0 if not cooling down)
    }

    /// @notice Staker info
    mapping(address => Stake) public stakers;

    /// @notice Total staked amount
    uint256 public totalStaked;

    /// @notice Reward rate (APY in basis points, 10000 = 100%)
    uint256 public rewardRate = 1000; // 10% APY

    /// @notice Bonus rate for long-term stakers (basis points)
    uint256 public bonusRate = 500; // 5% bonus

    /// @notice Minimum stake amount
    uint256 public constant MIN_STAKE = 100 * 1e18; // 100 OCT

    /// @notice Cooldown period (7 days)
    uint256 public constant COOLDOWN_PERIOD = 7 days;

    /// @notice Early withdrawal penalty (basis points)
    uint256 public earlyWithdrawalPenalty = 500; // 5%

    /// @notice Total rewards distributed
    uint256 public totalRewardsDistributed;

    /// @notice Emitted when tokens are staked
    event Staked(address indexed user, uint256 amount);

    /// @notice Emitted when tokens are unstaked
    event Unstaked(address indexed user, uint256 amount, uint256 penalty);

    /// @notice Emitted when rewards are claimed
    event RewardsClaimed(address indexed user, uint256 amount);

    /// @notice Emitted when cooldown is started
    event CooldownStarted(address indexed user, uint256 cooldownEnd);

    /// @notice Emitted when stake is slashed
    event Slashed(address indexed user, uint256 amount, string reason);

    /// @notice Emitted when reward rate is updated
    event RewardRateUpdated(uint256 oldRate, uint256 newRate);

    /**
     * @notice Constructor initializes staking contract
     * @param _octToken OCT token address
     */
    constructor(address _octToken) Ownable(msg.sender) {
        require(_octToken != address(0), "Staking: zero token address");
        octToken = IERC20(_octToken);
    }

    /**
     * @notice Stake OCT tokens
     * @param amount Amount to stake
     */
    function stake(uint256 amount) external nonReentrant whenNotPaused {
        require(amount >= MIN_STAKE, "Staking: below minimum stake");
        
        // Transfer tokens from user
        octToken.safeTransferFrom(msg.sender, address(this), amount);

        // Update stake
        Stake storage userStake = stakers[msg.sender];
        uint256 previousAmount = userStake.amount;
        uint256 newAmount = previousAmount + amount;

        if (previousAmount == 0) {
            // New staker
            userStake.startTime = block.timestamp;
            userStake.lastUpdateTime = block.timestamp;
        } else {
            // Existing staker - claim pending rewards first
            uint256 pending = _calculateRewards(msg.sender);
            userStake.rewards += pending;
            userStake.lastUpdateTime = block.timestamp;
        }

        userStake.amount = newAmount;
        totalStaked += amount;

        emit Staked(msg.sender, amount);
    }

    /**
     * @notice Start cooldown period for unstaking
     */
    function startCooldown() external whenNotPaused {
        Stake storage userStake = stakers[msg.sender];
        require(userStake.amount > 0, "Staking: no stake");
        require(userStake.cooldownStart == 0, "Staking: already in cooldown");

        // Claim pending rewards before cooldown
        uint256 pending = _calculateRewards(msg.sender);
        if (pending > 0) {
            userStake.rewards += pending;
            userStake.lastUpdateTime = block.timestamp;
        }

        userStake.cooldownStart = block.timestamp;
        emit CooldownStarted(msg.sender, block.timestamp + COOLDOWN_PERIOD);
    }

    /**
     * @notice Unstake tokens after cooldown
     * @param amount Amount to unstake
     */
    function unstake(uint256 amount) external nonReentrant whenNotPaused {
        Stake storage userStake = stakers[msg.sender];
        require(userStake.amount >= amount, "Staking: insufficient stake");
        require(userStake.cooldownStart > 0, "Staking: cooldown not started");
        require(
            block.timestamp >= userStake.cooldownStart + COOLDOWN_PERIOD,
            "Staking: cooldown not complete"
        );

        // Calculate penalty if unstaking early (within 14 days)
        uint256 stakeDuration = block.timestamp - userStake.startTime;
        uint256 penalty = 0;
        if (stakeDuration < 14 days) {
            penalty = (amount * earlyWithdrawalPenalty) / 10000;
        }

        // Update state
        userStake.amount -= amount;
        userStake.cooldownStart = 0;
        userStake.lastUpdateTime = block.timestamp;

        if (userStake.amount == 0) {
            // Claim remaining rewards
            uint256 pending = _calculateRewards(msg.sender);
            userStake.rewards += pending;
        }

        totalStaked -= amount;

        // Transfer tokens back
        uint256 unstakeAmount = amount - penalty;
        octToken.safeTransfer(msg.sender, unstakeAmount);

        if (penalty > 0) {
            // Penalty stays in contract
            emit Unstaked(msg.sender, unstakeAmount, penalty);
        } else {
            emit Unstaked(msg.sender, unstakeAmount, 0);
        }
    }

    /**
     * @notice Claim accumulated rewards
     * @return Amount of rewards claimed
     */
    function claimRewards() external nonReentrant whenNotPaused returns (uint256) {
        Stake storage userStake = stakers[msg.sender];
        
        // Calculate pending rewards
        uint256 pending = _calculateRewards(msg.sender);
        uint256 totalRewards = userStake.rewards + pending;

        require(totalRewards > 0, "Staking: no rewards");

        // Update state
        userStake.rewards = 0;
        userStake.lastUpdateTime = block.timestamp;

        // Transfer rewards
        octToken.safeTransfer(msg.sender, totalRewards);
        totalRewardsDistributed += totalRewards;

        emit RewardsClaimed(msg.sender, totalRewards);
        return totalRewards;
    }

    /**
     * @notice Get pending rewards for user
     * @param user User address
     * @return Pending rewards
     */
    function pendingRewards(address user) external view returns (uint256) {
        Stake storage userStake = stakers[user];
        if (userStake.amount == 0) {
            return userStake.rewards;
        }
        return userStake.rewards + _calculateRewards(user);
    }

    /**
     * @notice Get stake info for user
     * @param user User address
     * @return amount Staked amount
     * @return startTime When stake started
     * @return rewards Accumulated rewards
     * @return cooldownEnd Cooldown end timestamp
     */
    function getStakeInfo(address user) external view returns (
        uint256 amount,
        uint256 startTime,
        uint256 rewards,
        uint256 cooldownEnd
    ) {
        Stake storage userStake = stakers[user];
        return (
            userStake.amount,
            userStake.startTime,
            userStake.rewards + _calculateRewards(user),
            userStake.cooldownStart > 0 
                ? userStake.cooldownStart + COOLDOWN_PERIOD 
                : 0
        );
    }

    /**
     * @notice Slash staker for misbehavior
     * @param user User to slash
     * @param slashAmount Amount to slash
     * @param reason Reason for slashing
     */
    function slash(
        address user,
        uint256 slashAmount,
        string calldata reason
    ) external onlyOwner {
        Stake storage userStake = stakers[user];
        require(userStake.amount >= slashAmount, "Staking: insufficient stake");

        userStake.amount -= slashAmount;
        totalStaked -= slashAmount;

        // Slashed tokens stay in contract as extra rewards
        emit Slashed(user, slashAmount, reason);
    }

    /**
     * @notice Set reward rate
     * @param newRate New reward rate (in basis points)
     */
    function setRewardRate(uint256 newRate) external onlyOwner {
        require(newRate <= 5000, "Staking: rate too high"); // Max 50% APY
        uint256 oldRate = rewardRate;
        rewardRate = newRate;
        emit RewardRateUpdated(oldRate, newRate);
    }

    /**
     * @notice Set bonus rate for long-term stakers
     * @param newRate New bonus rate (in basis points)
     */
    function setBonusRate(uint256 newRate) external onlyOwner {
        require(newRate <= 1000, "Staking: bonus too high"); // Max 10%
        bonusRate = newRate;
    }

    /**
     * @notice Set early withdrawal penalty
     * @param newPenalty New penalty (in basis points)
     */
    function setEarlyWithdrawalPenalty(uint256 newPenalty) external onlyOwner {
        require(newPenalty <= 5000, "Staking: penalty too high"); // Max 50%
        earlyWithdrawalPenalty = newPenalty;
    }

    /**
     * @notice Pause staking
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @notice Unpause staking
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @notice Calculate pending rewards for user
     * @param user User address
     * @return Pending rewards
     */
    function _calculateRewards(address user) internal view returns (uint256) {
        Stake storage userStake = stakers[user];
        if (userStake.amount == 0) {
            return 0;
        }

        uint256 timePassed = block.timestamp - userStake.lastUpdateTime;
        if (timePassed == 0) {
            return 0;
        }

        // Calculate base reward
        uint256 baseReward = (userStake.amount * rewardRate * timePassed) / (365 days * 10000);

        // Calculate bonus for long-term stakers (>30 days get bonus)
        uint256 stakeDuration = block.timestamp - userStake.startTime;
        uint256 bonus = 0;
        if (stakeDuration > 30 days) {
            bonus = (baseReward * bonusRate) / 10000;
        }

        return baseReward + bonus;
    }

    /**
     * @notice Get effective reward rate for user
     * @param user User address
     * @return Effective APY in basis points
     */
    function effectiveRewardRate(address user) external view returns (uint256) {
        Stake storage userStake = stakers[user];
        if (userStake.amount == 0) {
            return 0;
        }

        uint256 stakeDuration = block.timestamp - userStake.startTime;
        if (stakeDuration > 30 days) {
            return rewardRate + bonusRate;
        }
        return rewardRate;
    }
}
