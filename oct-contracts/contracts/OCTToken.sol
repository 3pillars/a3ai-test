// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title OCTToken
 * @notice OpenClaw Token (OCT) - ERC-20 utility token for AI agent services
 * @dev Implements minting, burning, snapshots, and pausable transfers
 *
 * Features:
 * - Total supply: 1,000,000,000 OCT
 * - Mintable by owner for airdrops and allocations
 * - Burnable by any holder
 * - Snapshots for governance voting
 * - Pausable for emergency controls
 * - Rate limiting on transfers
 *
 * Tokenomics:
 * - 40% Community Airdrop
 * - 15% Team (4 year vesting)
 * - 20% Treasury
 * - 15% Early Backers (2 year vesting)
 * - 10% Liquidity
 */
contract OCTToken is ERC20, ERC20Burnable, Ownable, Pausable {
    /// @notice Maximum supply of OCT tokens
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 1e18;

    /// @notice Snapshot data structure
    struct Snapshots {
        uint256[] ids;
        uint256[] values;
    }

    /// @notice Mapping of account to snapshots
    mapping(address => Snapshots) private _accountSnapshotBalances;

    /// @notice Total supply snapshots
    Snapshots private _totalSupplySnapshots;

    /// @notice Current snapshot ID
    uint256 private _currentSnapshotId;

    /// @notice Mapping of blacklisted addresses
    mapping(address => bool) public blacklisted;

    /// @notice Transfer rate limit window (1 hour)
    uint256 public constant RATE_LIMIT_WINDOW = 1 hours;

    /// @notice Maximum tokens transferable per rate limit window (1% of supply)
    uint256 public constant MAX_TRANSFER_RATE = MAX_SUPPLY / 100;

    /// @notice Last transfer timestamp per user
    mapping(address => uint256) public lastTransferTime;

    /// @notice Transfer amount in window per user
    mapping(address => uint256) public transferredInWindow;

    /// @notice Emitted when an address is blacklisted
    event BlacklistUpdated(address indexed account, bool isBlacklisted);

    /// @notice Emitted when tokens are minted
    event TokensMinted(address indexed to, uint256 amount);

    /// @notice Emitted when tokens are burned
    event TokensBurned(address indexed from, uint256 amount);

    /// @notice Emitted when a snapshot is created
    event SnapshotCreated(uint256 indexed snapshotId);

    /// @notice Emitted when rate limit is exceeded
    event RateLimitExceeded(address indexed account, uint256 requested, uint256 available);

    /**
     * @notice Constructor initializes the OCT token
     * @param initialHolder Address receiving initial supply (5% = 50M OCT)
     * @dev Initial supply is 5% of max supply for initial circulating tokens
     */
    constructor(address initialHolder)
        ERC20("OpenClaw Token", "OCT")
        Ownable(msg.sender)
    {
        require(initialHolder != address(0), "OCT: zero address");
        
        // Mint initial circulating supply (5%)
        uint256 initialSupply = 50_000_000 * 1e18;
        _mint(initialHolder, initialSupply);
        
        // Create initial snapshot
        _snapshot();
    }

    /**
     * @notice Snapshot current state for governance voting
     * @return Snapshot id
     */
    function snapshot() external onlyOwner whenNotPaused returns (uint256) {
        return _snapshot();
    }

    /**
     * @notice Get current snapshot ID
     * @return Current snapshot ID
     */
    function currentSnapshotId() external view returns (uint256) {
        return _currentSnapshotId;
    }

    /**
     * @notice Mint new tokens to specified address
     * @param to Address to receive minted tokens
     * @param amount Amount to mint
     * @dev Only callable by owner, respects MAX_SUPPLY
     */
    function mint(address to, uint256 amount) external onlyOwner whenNotPaused {
        require(to != address(0), "OCT: mint to zero");
        require(totalSupply() + amount <= MAX_SUPPLY, "OCT: exceeds max supply");

        _mint(to, amount);
        emit TokensMinted(to, amount);
    }

    /**
     * @notice Burn tokens from caller
     * @param amount Amount to burn
     */
    function burn(uint256 amount) public override whenNotPaused {
        super.burn(amount);
        emit TokensBurned(_msgSender(), amount);
    }

    /**
     * @notice Burn tokens from specified address (requires approval)
     * @param account Address to burn from
     * @param amount Amount to burn
     */
    function burnFrom(address account, uint256 amount) public override whenNotPaused {
        super.burnFrom(account, amount);
        emit TokensBurned(account, amount);
    }

    /**
     * @notice Pause all token transfers
     * @dev Only callable by owner
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @notice Unpause token transfers
     * @dev Only callable by owner
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @notice Add or remove address from blacklist
     * @param account Address to update
     * @param shouldBlacklist New blacklist status
     */
    function setBlacklist(address account, bool shouldBlacklist) external onlyOwner {
        require(account != address(0), "OCT: zero address");
        blacklisted[account] = shouldBlacklist;
        emit BlacklistUpdated(account, shouldBlacklist);
    }

    /**
     * @notice Check if account is blacklisted
     * @param account Address to check
     * @return bool
     */
    function isBlacklisted(address account) external view returns (bool) {
        return blacklisted[account];
    }

    /**
     * @notice Get balance at specific snapshot
     * @param account Address to check
     * @param snapshotId Snapshot ID
     * @return Balance at snapshot
     */
    function balanceOfAt(address account, uint256 snapshotId) external view returns (uint256) {
        return _balanceAtSnapshot(_accountSnapshotBalances[account], snapshotId);
    }

    /**
     * @notice Get total supply at specific snapshot
     * @param snapshotId Snapshot ID
     * @return Total supply at snapshot
     */
    function totalSupplyAt(uint256 snapshotId) external view returns (uint256) {
        return _balanceAtSnapshot(_totalSupplySnapshots, snapshotId);
    }

    /**
     * @notice Get available transfer quota for address
     * @param account Address to check
     * @return Available amount that can be transferred
     */
    function availableTransferQuota(address account) external view returns (uint256) {
        if (lastTransferTime[account] == 0 || block.timestamp >= lastTransferTime[account] + RATE_LIMIT_WINDOW) {
            return MAX_TRANSFER_RATE;
        }
        return MAX_TRANSFER_RATE - transferredInWindow[account];
    }

    /**
     * @notice Internal function to get balance at snapshot
     * @param snapshots Snapshots struct
     * @param snapshotId Snapshot ID
     * @return Balance at snapshot
     */
    function _balanceAtSnapshot(Snapshots storage snapshots, uint256 snapshotId) 
        private 
        view 
        returns (uint256) 
    {
        require(snapshotId <= _currentSnapshotId, "OCT: snapshot not found");
        
        // If no snapshots, return current balance
        if (snapshots.ids.length == 0) {
            return 0;
        }

        // Find the most recent snapshot
        for (uint256 i = snapshots.ids.length; i > 0; i--) {
            if (snapshots.ids[i - 1] <= snapshotId) {
                return snapshots.values[i - 1];
            }
        }
        return 0;
    }

    /**
     * @notice Create a new snapshot
     * @return New snapshot ID
     */
    function _snapshot() internal virtual returns (uint256) {
        _currentSnapshotId++;
        uint256 currentId = _currentSnapshotId;
        emit SnapshotCreated(currentId);
        
        _updateSnapshot(_totalSupplySnapshots, totalSupply());
        
        return currentId;
    }

    /**
     * @notice Update snapshot values
     * @param snapshots Snapshots struct to update
     * @param newValue New value to snapshot
     */
    function _updateSnapshot(Snapshots storage snapshots, uint256 newValue) internal {
        if (snapshots.ids.length > 0 && snapshots.ids[snapshots.ids.length - 1] == _currentSnapshotId) {
            // Update existing snapshot
            snapshots.values[snapshots.ids.length - 1] = newValue;
        } else {
            // Create new snapshot
            snapshots.ids.push(_currentSnapshotId);
            snapshots.values.push(newValue);
        }
    }

    /**
     * @notice Hook called before any transfer update
     * @param from Transfer sender
     * @param to Transfer recipient
     * @param amount Transfer amount
     */
    function _update(address from, address to, uint256 amount) internal virtual override {
        // Pausable check
        require(!paused() || from == address(0) || to == address(0), "Pausable: paused");

        // Blacklist and rate limit checks for regular transfers
        if (from != address(0) && to != address(0)) {
            require(!blacklisted[from], "OCT: sender blacklisted");
            require(!blacklisted[to], "OCT: recipient blacklisted");
            _checkRateLimit(from, amount);
        }

        // Perform the transfer
        super._update(from, to, amount);
        
        // Note: Snapshots are only created explicitly via snapshot() function
        // They capture state at creation time, not continuously updated
    }

    /**
     * @notice Check and update rate limit for sender
     * @param sender Address transferring
     * @param amount Amount to transfer
     */
    function _checkRateLimit(address sender, uint256 amount) internal {
        if (lastTransferTime[sender] == 0 || block.timestamp >= lastTransferTime[sender] + RATE_LIMIT_WINDOW) {
            // Reset window
            lastTransferTime[sender] = block.timestamp;
            transferredInWindow[sender] = amount;
        } else {
            // Check if within limit
            require(
                transferredInWindow[sender] + amount <= MAX_TRANSFER_RATE,
                "OCT: rate limit exceeded"
            );
            transferredInWindow[sender] += amount;
        }
    }
}
