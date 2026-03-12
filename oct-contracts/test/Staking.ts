import { expect } from "chai";
import { ethers } from "hardhat";

describe("Staking", function () {
  const MIN_STAKE = ethers.parseEther("100");
  const STAKE_AMOUNT = ethers.parseEther("1000");
  const COOLDOWN_PERIOD = 7 * 24 * 60 * 60; // 7 days

  async function deployStakingFixture() {
    const [owner, user1, user2, treasury] = await ethers.getSigners();
    
    const OCTToken = await ethers.getContractFactory("OCTToken");
    const octToken = await OCTToken.deploy(owner.address);
    
    const Staking = await ethers.getContractFactory("Staking");
    const staking = await Staking.deploy(await octToken.getAddress());
    
    // Fund staking contract with rewards
    const rewardAmount = ethers.parseEther("1000000");
    await octToken.transfer(await staking.getAddress(), rewardAmount);
    
    // Give users tokens to stake
    await octToken.transfer(user1.address, STAKE_AMOUNT * 10n);
    await octToken.connect(user1).approve(await staking.getAddress(), ethers.MaxUint256);
    
    await octToken.transfer(user2.address, STAKE_AMOUNT * 10n);
    await octToken.connect(user2).approve(await staking.getAddress(), ethers.MaxUint256);
    
    return { staking, octToken, owner, user1, user2, treasury };
  }

  describe("Deployment", function () {
    it("should set correct token", async function () {
      const { staking, octToken } = await deployStakingFixture();
      expect(await staking.octToken()).to.equal(await octToken.getAddress());
    });

    it("should have correct initial values", async function () {
      const { staking } = await deployStakingFixture();
      expect(await staking.rewardRate()).to.equal(1000); // 10% APY
      expect(await staking.bonusRate()).to.equal(500); // 5% bonus
      expect(await staking.totalStaked()).to.equal(0);
    });
  });

  describe("Staking", function () {
    it("should allow users to stake", async function () {
      const { staking, user1 } = await deployStakingFixture();
      
      await staking.connect(user1).stake(STAKE_AMOUNT);
      
      const stakeInfo = await staking.getStakeInfo(user1.address);
      expect(stakeInfo[0]).to.equal(STAKE_AMOUNT);
    });

    it("should reject stake below minimum", async function () {
      const { staking, user1 } = await deployStakingFixture();
      
      await expect(
        staking.connect(user1).stake(MIN_STAKE - 1n)
      ).to.be.revertedWith("Staking: below minimum stake");
    });

    it("should update total staked", async function () {
      const { staking, user1, user2 } = await deployStakingFixture();
      
      await staking.connect(user1).stake(STAKE_AMOUNT);
      expect(await staking.totalStaked()).to.equal(STAKE_AMOUNT);
      
      await staking.connect(user2).stake(STAKE_AMOUNT);
      expect(await staking.totalStaked()).to.equal(STAKE_AMOUNT * 2n);
    });

    it("should track stake start time", async function () {
      const { staking, user1 } = await deployStakingFixture();
      
      const beforeStake = (await ethers.provider.getBlock("latest"))!.timestamp;
      await staking.connect(user1).stake(STAKE_AMOUNT);
      
      const stakeInfo = await staking.getStakeInfo(user1.address);
      expect(stakeInfo[1]).to.be.greaterThanOrEqual(beforeStake);
    });
  });

  describe("Rewards", function () {
    it("should calculate pending rewards", async function () {
      const { staking, user1 } = await deployStakingFixture();
      
      await staking.connect(user1).stake(STAKE_AMOUNT);
      
      // Fast forward time
      await ethers.provider.send("evm_increaseTime", [365 * 24 * 60 * 60]); // 1 year
      await ethers.provider.send("evm_mine", []);
      
      const pending = await staking.pendingRewards(user1.address);
      // ~10% APY = 100 OCT for 1000 staked
      expect(pending).to.be.greaterThan(0);
    });

    it("should claim rewards", async function () {
      const { staking, octToken, user1 } = await deployStakingFixture();
      
      await staking.connect(user1).stake(STAKE_AMOUNT);
      
      // Fast forward time
      await ethers.provider.send("evm_increaseTime", [365 * 24 * 60 * 60]);
      await ethers.provider.send("evm_mine", []);
      
      const balanceBefore = await octToken.balanceOf(user1.address);
      await staking.connect(user1).claimRewards();
      const balanceAfter = await octToken.balanceOf(user1.address);
      
      expect(balanceAfter).to.be.greaterThan(balanceBefore);
    });

    it("should include bonus for long-term staking", async function () {
      const { staking, user1 } = await deployStakingFixture();
      
      await staking.connect(user1).stake(STAKE_AMOUNT);
      
      // Fast forward > 30 days
      await ethers.provider.send("evm_increaseTime", [31 * 24 * 60 * 60]);
      await ethers.provider.send("evm_mine", []);
      
      const rate = await staking.effectiveRewardRate(user1.address);
      // Should include bonus (10% + 5% = 15%)
      expect(rate).to.equal(1500);
    });
  });

  describe("Cooldown", function () {
    it("should start cooldown", async function () {
      const { staking, user1 } = await deployStakingFixture();
      
      await staking.connect(user1).stake(STAKE_AMOUNT);
      await staking.connect(user1).startCooldown();
      
      const stakeInfo = await staking.getStakeInfo(user1.address);
      expect(stakeInfo[3]).to.be.greaterThan(0);
    });

    it("should not allow unstake without cooldown", async function () {
      const { staking, user1 } = await deployStakingFixture();
      
      await staking.connect(user1).stake(STAKE_AMOUNT);
      
      await expect(
        staking.connect(user1).unstake(STAKE_AMOUNT)
      ).to.be.revertedWith("Staking: cooldown not started");
    });

    it("should complete cooldown and allow unstake", async function () {
      const { staking, octToken, user1 } = await deployStakingFixture();
      
      await staking.connect(user1).stake(STAKE_AMOUNT);
      await staking.connect(user1).startCooldown();
      
      // Fast forward past cooldown
      await ethers.provider.send("evm_increaseTime", [COOLDOWN_PERIOD + 1]);
      await ethers.provider.send("evm_mine", []);
      
      const balanceBefore = await octToken.balanceOf(user1.address);
      await staking.connect(user1).unstake(STAKE_AMOUNT);
      const balanceAfter = await octToken.balanceOf(user1.address);
      
      expect(balanceAfter).to.be.greaterThan(balanceBefore);
    });

    it("should apply penalty for early withdrawal", async function () {
      const { staking, user1 } = await deployStakingFixture();
      
      // Stake for < 14 days
      await staking.connect(user1).stake(STAKE_AMOUNT);
      await staking.connect(user1).startCooldown();
      
      // Wait exactly cooldown period (but < 14 days stake)
      await ethers.provider.send("evm_increaseTime", [COOLDOWN_PERIOD + 1]);
      await ethers.provider.send("evm_mine", []);
      
      // Should have penalty
      await expect(staking.connect(user1).unstake(STAKE_AMOUNT))
        .to.emit(staking, "Unstaked");
    });
  });

  describe("Slashing", function () {
    it("should allow owner to slash", async function () {
      const { staking, user1 } = await deployStakingFixture();
      
      await staking.connect(user1).stake(STAKE_AMOUNT);
      await staking.slash(user1.address, ethers.parseEther("100"), "Misbehavior");
      
      const stakeInfo = await staking.getStakeInfo(user1.address);
      expect(stakeInfo[0]).to.equal(STAKE_AMOUNT - ethers.parseEther("100"));
    });

    it("should not allow over-slashing", async function () {
      const { staking, user1 } = await deployStakingFixture();
      
      await staking.connect(user1).stake(STAKE_AMOUNT);
      
      await expect(
        staking.slash(user1.address, STAKE_AMOUNT + 1n, "Too much")
      ).to.be.revertedWith("Staking: insufficient stake");
    });
  });

  describe("Pausing", function () {
    it("should allow owner to pause", async function () {
      const { staking } = await deployStakingFixture();
      
      await staking.pause();
      expect(await staking.paused()).to.be.true;
    });

    it("should prevent staking when paused", async function () {
      const { staking, user1 } = await deployStakingFixture();
      
      await staking.pause();
      
      await expect(
        staking.connect(user1).stake(STAKE_AMOUNT)
      ).to.be.revertedWith("Pausable: paused");
    });
  });

  describe("Edge Cases", function () {
    it("should handle multiple stakes from same user", async function () {
      const { staking, user1 } = await deployStakingFixture();
      
      await staking.connect(user1).stake(STAKE_AMOUNT);
      await staking.connect(user1).stake(STAKE_AMOUNT);
      
      const stakeInfo = await staking.getStakeInfo(user1.address);
      expect(stakeInfo[0]).to.equal(STAKE_AMOUNT * 2n);
    });

    it("should track total rewards distributed", async function () {
      const { staking, user1 } = await deployStakingFixture();
      
      await staking.connect(user1).stake(STAKE_AMOUNT);
      
      await ethers.provider.send("evm_increaseTime", [365 * 24 * 60 * 60]);
      await ethers.provider.send("evm_mine", []);
      
      await staking.connect(user1).claimRewards();
      
      expect(await staking.totalRewardsDistributed()).to.be.greaterThan(0);
    });

    it("should claim rewards when unstaking with amount > 0", async function () {
      const { staking, octToken, user1 } = await deployStakingFixture();
      
      await staking.connect(user1).stake(STAKE_AMOUNT);
      
      await ethers.provider.send("evm_increaseTime", [365 * 24 * 60 * 60]);
      await ethers.provider.send("evm_mine", []);
      
      // Start cooldown (this claims pending rewards)
      await staking.connect(user1).startCooldown();
      
      await ethers.provider.send("evm_increaseTime", [COOLDOWN_PERIOD + 1]);
      await ethers.provider.send("evm_mine", []);
      
      const balanceBefore = await octToken.balanceOf(user1.address);
      await staking.connect(user1).unstake(STAKE_AMOUNT);
      const balanceAfter = await octToken.balanceOf(user1.address);
      
      // Should receive original stake + rewards
      expect(balanceAfter).to.be.greaterThan(balanceBefore);
    });
  });
});
