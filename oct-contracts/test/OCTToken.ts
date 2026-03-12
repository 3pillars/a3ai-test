import { expect } from "chai";
import { ethers } from "hardhat";

describe("OCTToken", function () {
  // Fixture for deploying contract
  async function deployTokenFixture() {
    const [owner, user1, user2, blacklisted] = await ethers.getSigners();
    
    const OCTToken = await ethers.getContractFactory("OCTToken");
    const token = await OCTToken.deploy(owner.address);
    
    return { token, owner, user1, user2, blacklisted };
  }

  describe("Deployment", function () {
    it("should set correct name and symbol", async function () {
      const { token } = await deployTokenFixture();
      expect(await token.name()).to.equal("OpenClaw Token");
      expect(await token.symbol()).to.equal("OCT");
    });

    it("should mint initial supply to deployer", async function () {
      const { token, owner } = await deployTokenFixture();
      const initialSupply = ethers.parseEther("50000000"); // 5% = 50M
      expect(await token.balanceOf(owner.address)).to.equal(initialSupply);
    });

    it("should have correct max supply", async function () {
      const { token } = await deployTokenFixture();
      const maxSupply = ethers.parseEther("1000000000"); // 1B
      expect(await token.MAX_SUPPLY()).to.equal(maxSupply);
    });
  });

  describe("Minting", function () {
    it("should allow owner to mint tokens", async function () {
      const { token, user1 } = await deployTokenFixture();
      const mintAmount = ethers.parseEther("1000");
      
      await token.mint(user1.address, mintAmount);
      expect(await token.balanceOf(user1.address)).to.equal(mintAmount);
    });

    it("should not exceed max supply", async function () {
      const { token, user1 } = await deployTokenFixture();
      const excessAmount = ethers.parseEther("1000000001"); // More than 1B
      
      await expect(
        token.mint(user1.address, excessAmount)
      ).to.be.revertedWith("OCT: exceeds max supply");
    });

    it("should not allow non-owner to mint", async function () {
      const { token, user1 } = await deployTokenFixture();
      
      await expect(
        token.connect(user1).mint(user1.address, ethers.parseEther("1000"))
      ).to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount");
    });
  });

  describe("Burning", function () {
    it("should allow user to burn tokens", async function () {
      const { token } = await deployTokenFixture();
      const burnAmount = ethers.parseEther("1000");
      
      await token.burn(burnAmount);
      
      const initialSupply = ethers.parseEther("50000000");
      expect(await token.totalSupply()).to.equal(initialSupply - burnAmount);
    });

    it("should allow burning from another address with approval", async function () {
      const { token, owner, user1 } = await deployTokenFixture();
      
      const burnAmount = ethers.parseEther("1000");
      await token.mint(user1.address, burnAmount);
      
      await token.connect(user1).approve(owner.address, burnAmount);
      await token.burnFrom(user1.address, burnAmount);
      
      expect(await token.balanceOf(user1.address)).to.equal(0);
    });
  });

  describe("Snapshots", function () {
    it("should allow owner to create snapshot", async function () {
      const { token } = await deployTokenFixture();
      
      const tx = await token.snapshot();
      const receipt = await tx.wait();
      const event = receipt.logs.find((log: any) => log.fragment?.name === "SnapshotCreated");
      expect(event).to.not.be.undefined;
    });

    it("should return correct total supply at snapshot", async function () {
      const { token, owner, user1 } = await deployTokenFixture();
      
      // Get total supply before mint
      const initialSupply = await token.totalSupply();
      
      // Create snapshot
      const tx = await token.snapshot();
      const receipt = await tx.wait();
      const event = receipt.logs.find((log: any) => log.fragment?.name === "SnapshotCreated");
      const snapshotId = event.args[0];
      
      // Mint more tokens
      await token.mint(user1.address, ethers.parseEther("1000"));
      
      // Total supply at snapshot should be initial supply (before mint)
      expect(await token.totalSupplyAt(snapshotId)).to.equal(initialSupply);
    });
  });

  describe("Pausing", function () {
    it("should allow owner to pause", async function () {
      const { token } = await deployTokenFixture();
      
      await token.pause();
      expect(await token.paused()).to.be.true;
    });

    it("should prevent transfers when paused", async function () {
      const { token, owner, user1 } = await deployTokenFixture();
      
      await token.pause();
      
      await expect(
        token.transfer(user1.address, ethers.parseEther("1000"))
      ).to.be.revertedWith("Pausable: paused");
    });

    it("should allow owner to unpause", async function () {
      const { token } = await deployTokenFixture();
      
      await token.pause();
      await token.unpause();
      expect(await token.paused()).to.be.false;
    });
  });

  describe("Blacklist", function () {
    it("should allow owner to blacklist addresses", async function () {
      const { token, blacklisted } = await deployTokenFixture();
      
      await token.setBlacklist(blacklisted.address, true);
      expect(await token.isBlacklisted(blacklisted.address)).to.be.true;
    });

    it("should prevent blacklisted from sending", async function () {
      const { token, owner, blacklisted } = await deployTokenFixture();
      
      // Give blacklisted some tokens
      await token.mint(blacklisted.address, ethers.parseEther("1000"));
      await token.setBlacklist(blacklisted.address, true);
      
      await expect(
        token.connect(blacklisted).transfer(owner.address, ethers.parseEther("100"))
      ).to.be.revertedWith("OCT: sender blacklisted");
    });

    it("should prevent transfers to blacklisted", async function () {
      const { token, owner, blacklisted } = await deployTokenFixture();
      
      await token.setBlacklist(blacklisted.address, true);
      
      await expect(
        token.transfer(blacklisted.address, ethers.parseEther("100"))
      ).to.be.revertedWith("OCT: recipient blacklisted");
    });
  });

  describe("Rate Limiting", function () {
    it("should track transfer quota", async function () {
      const { token, owner } = await deployTokenFixture();
      
      const quota = await token.availableTransferQuota(owner.address);
      expect(quota).to.equal(await token.MAX_TRANSFER_RATE());
    });

    it("should limit large transfers in same window", async function () {
      const { token, owner, user1 } = await deployTokenFixture();
      
      // First transfer within the rate limit window should work
      const smallAmount = ethers.parseEther("100");
      await token.transfer(user1.address, smallAmount);
      
      // Try to transfer more than remaining rate limit
      const largeAmount = await token.availableTransferQuota(owner.address) + ethers.parseEther("1");
      
      await expect(
        token.transfer(user1.address, largeAmount)
      ).to.be.revertedWith("OCT: rate limit exceeded");
    });
  });

  describe("Transfers", function () {
    it("should transfer tokens between accounts", async function () {
      const { token, owner, user1 } = await deployTokenFixture();
      
      const amount = ethers.parseEther("100");
      await token.transfer(user1.address, amount);
      
      expect(await token.balanceOf(user1.address)).to.equal(amount);
    });

    it("should emit Transfer event", async function () {
      const { token, owner, user1 } = await deployTokenFixture();
      
      const amount = ethers.parseEther("100");
      await expect(token.transfer(user1.address, amount))
        .to.emit(token, "Transfer")
        .withArgs(owner.address, user1.address, amount);
    });
  });
});
