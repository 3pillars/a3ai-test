import { expect } from "chai";
import { ethers } from "hardhat";

describe("ServiceRegistry", function () {
  const SERVICE_NAME = "AI Assistant";
  const SERVICE_DESCRIPTION = "Basic AI assistant service";
  const SERVICE_URI = "https://example.com/service/1";
  const SERVICE_PRICE = ethers.parseEther("1"); // 1 OCT

  // Helper to get service ID from registration event
  async function getServiceIdFromTx(tx: any): Promise<string> {
    const receipt = await tx.wait();
    const event = receipt.logs.find(
      (log: any) => log?.fragment?.name === "ServiceRegistered"
    );
    return event?.args?.[0];
  }

  async function deployRegistryFixture() {
    const [owner, provider, user, treasury] = await ethers.getSigners();
    
    const OCTToken = await ethers.getContractFactory("OCTToken");
    const octToken = await OCTToken.deploy(owner.address);
    
    const ServiceRegistry = await ethers.getContractFactory("ServiceRegistry");
    const registry = await ServiceRegistry.deploy(
      await octToken.getAddress(),
      treasury.address
    );
    
    // Give user some tokens
    await octToken.transfer(user.address, ethers.parseEther("1000"));
    await octToken.connect(user).approve(await registry.getAddress(), ethers.MaxUint256);
    
    return { registry, octToken, owner, provider, user, treasury };
  }

  describe("Deployment", function () {
    it("should set correct token", async function () {
      const { registry, octToken } = await deployRegistryFixture();
      expect(await registry.octToken()).to.equal(await octToken.getAddress());
    });

    it("should set correct treasury", async function () {
      const { registry, treasury } = await deployRegistryFixture();
      expect(await registry.treasury()).to.equal(treasury.address);
    });

    it("should have correct platform fee", async function () {
      const { registry } = await deployRegistryFixture();
      expect(await registry.platformFee()).to.equal(500); // 5%
    });
  });

  describe("Service Registration", function () {
    it("should allow registering a service", async function () {
      const { registry, provider } = await deployRegistryFixture();
      
      const tx = await registry.connect(provider).registerService(
        SERVICE_NAME,
        SERVICE_DESCRIPTION,
        SERVICE_URI,
        1, // Standard tier
        SERVICE_PRICE
      );
      
      const serviceId = await getServiceIdFromTx(tx);
      expect(serviceId).to.not.be.undefined;
    });

    it("should reject empty name", async function () {
      const { registry, provider } = await deployRegistryFixture();
      
      await expect(
        registry.connect(provider).registerService(
          "",
          SERVICE_DESCRIPTION,
          SERVICE_URI,
          0,
          SERVICE_PRICE
        )
      ).to.be.revertedWith("ServiceRegistry: empty name");
    });

    it("should reject price below minimum", async function () {
      const { registry, provider } = await deployRegistryFixture();
      
      await expect(
        registry.connect(provider).registerService(
          SERVICE_NAME,
          SERVICE_DESCRIPTION,
          SERVICE_URI,
          0,
          ethers.parseEther("0.001") // Below 0.01
        )
      ).to.be.revertedWith("ServiceRegistry: price too low");
    });

    it("should track provider services", async function () {
      const { registry, provider } = await deployRegistryFixture();
      
      await registry.connect(provider).registerService(
        SERVICE_NAME,
        SERVICE_DESCRIPTION,
        SERVICE_URI,
        0,
        SERVICE_PRICE
      );
      
      const services = await registry.getProviderServices(provider.address);
      expect(services.length).to.equal(1);
    });

    it("should track total service count", async function () {
      const { registry, provider, user } = await deployRegistryFixture();
      
      await registry.connect(provider).registerService(
        "Service 1",
        "Description",
        "URI",
        0,
        SERVICE_PRICE
      );
      
      await registry.connect(user).registerService(
        "Service 2",
        "Description",
        "URI",
        0,
        SERVICE_PRICE
      );
      
      expect(await registry.getServiceCount()).to.equal(2);
    });
  });

  describe("Service Updates", function () {
    it("should allow provider to update service", async function () {
      const { registry, provider } = await deployRegistryFixture();
      
      const tx = await registry.connect(provider).registerService(
        SERVICE_NAME,
        SERVICE_DESCRIPTION,
        SERVICE_URI,
        0,
        SERVICE_PRICE
      );
      const serviceId = await getServiceIdFromTx(tx);

      await registry.connect(provider).updateService(
        serviceId,
        "New description",
        "New URI",
        SERVICE_PRICE * 2n
      );
      
      const service = await registry.getService(serviceId);
      expect(service.description).to.equal("New description");
      expect(service.price).to.equal(SERVICE_PRICE * 2n);
    });

    it("should not allow non-provider to update", async function () {
      const { registry, provider, user } = await deployRegistryFixture();
      
      // Provider registers a service
      const tx = await registry.connect(provider).registerService(
        SERVICE_NAME,
        SERVICE_DESCRIPTION,
        SERVICE_URI,
        0,
        SERVICE_PRICE
      );
      const serviceId = await getServiceIdFromTx(tx);
      
      // User tries to update it (should fail)
      await expect(
        registry.connect(user).updateService(
          serviceId,
          "New description",
          "New URI",
          SERVICE_PRICE
        )
      ).to.be.revertedWith("ServiceRegistry: not provider");
    });

    it("should allow toggling service status", async function () {
      const { registry, provider } = await deployRegistryFixture();
      
      const tx = await registry.connect(provider).registerService(
        SERVICE_NAME,
        SERVICE_DESCRIPTION,
        SERVICE_URI,
        0,
        SERVICE_PRICE
      );
      const serviceId = await getServiceIdFromTx(tx);

      await registry.connect(provider).setServiceStatus(serviceId, false);
      expect((await registry.getService(serviceId)).isActive).to.be.false;
      
      await registry.connect(provider).setServiceStatus(serviceId, true);
      expect((await registry.getService(serviceId)).isActive).to.be.true;
    });
  });

  describe("Service Usage", function () {
    it("should allow using a service", async function () {
      const { registry, provider, user } = await deployRegistryFixture();
      
      const tx = await registry.connect(provider).registerService(
        SERVICE_NAME,
        SERVICE_DESCRIPTION,
        SERVICE_URI,
        0,
        SERVICE_PRICE
      );
      const serviceId = await getServiceIdFromTx(tx);
      
      await registry.connect(user).useService(serviceId, SERVICE_PRICE);
      
      const service = await registry.getService(serviceId);
      expect(service.usageCount).to.equal(1);
    });

    it("should track user spending", async function () {
      const { registry, provider, user } = await deployRegistryFixture();
      
      const tx = await registry.connect(provider).registerService(
        SERVICE_NAME,
        SERVICE_DESCRIPTION,
        SERVICE_URI,
        0,
        SERVICE_PRICE
      );
      const serviceId = await getServiceIdFromTx(tx);
      
      await registry.connect(user).useService(serviceId, SERVICE_PRICE);
      
      const usage = await registry.userUsage(user.address);
      expect(usage.totalSpent).to.equal(SERVICE_PRICE);
      expect(usage.requestCount).to.equal(1);
    });

    it("should reject inactive service", async function () {
      const { registry, provider, user } = await deployRegistryFixture();
      
      const tx = await registry.connect(provider).registerService(
        SERVICE_NAME,
        SERVICE_DESCRIPTION,
        SERVICE_URI,
        0,
        SERVICE_PRICE
      );
      const serviceId = await getServiceIdFromTx(tx);
      
      await registry.connect(provider).setServiceStatus(serviceId, false);
      
      await expect(
        registry.connect(user).useService(serviceId, SERVICE_PRICE)
      ).to.be.revertedWith("ServiceRegistry: service not active");
    });

    it("should reject insufficient payment", async function () {
      const { registry, provider, user } = await deployRegistryFixture();
      
      const tx = await registry.connect(provider).registerService(
        SERVICE_NAME,
        SERVICE_DESCRIPTION,
        SERVICE_URI,
        0,
        SERVICE_PRICE
      );
      const serviceId = await getServiceIdFromTx(tx);
      
      await expect(
        registry.connect(user).useService(serviceId, SERVICE_PRICE - 1n)
      ).to.be.revertedWith("ServiceRegistry: insufficient payment");
    });

    it("should distribute payment correctly", async function () {
      const { registry, octToken, provider, user, treasury } = await deployRegistryFixture();
      
      const tx = await registry.connect(provider).registerService(
        SERVICE_NAME,
        SERVICE_DESCRIPTION,
        SERVICE_URI,
        0,
        SERVICE_PRICE
      );
      const serviceId = await getServiceIdFromTx(tx);
      
      const providerBefore = await octToken.balanceOf(provider.address);
      const treasuryBefore = await octToken.balanceOf(treasury.address);
      
      await registry.connect(user).useService(serviceId, SERVICE_PRICE);
      
      const providerAfter = await octToken.balanceOf(provider.address);
      const treasuryAfter = await octToken.balanceOf(treasury.address);
      
      // Provider gets 95% (5% fee)
      const expectedProviderShare = (SERVICE_PRICE * 9500n) / 10000n;
      expect(providerAfter - providerBefore).to.equal(expectedProviderShare);
      
      // Treasury gets 5%
      const expectedFee = (SERVICE_PRICE * 500n) / 10000n;
      expect(treasuryAfter - treasuryBefore).to.equal(expectedFee);
    });

    it("should update provider earnings", async function () {
      const { registry, provider, user } = await deployRegistryFixture();
      
      const tx = await registry.connect(provider).registerService(
        SERVICE_NAME,
        SERVICE_DESCRIPTION,
        SERVICE_URI,
        0,
        SERVICE_PRICE
      );
      const serviceId = await getServiceIdFromTx(tx);
      
      await registry.connect(user).useService(serviceId, SERVICE_PRICE);
      
      const expectedEarnings = (SERVICE_PRICE * 9500n) / 10000n;
      expect(await registry.providerEarnings(provider.address)).to.equal(expectedEarnings);
    });
  });

  describe("Batch Services", function () {
    it("should use multiple services at once", async function () {
      const { registry, provider, user } = await deployRegistryFixture();
      
      // Register two services
      const tx1 = await registry.connect(provider).registerService(
        "Service 1",
        "Desc",
        "URI",
        0,
        SERVICE_PRICE
      );
      const s1 = await getServiceIdFromTx(tx1);

      const tx2 = await registry.connect(provider).registerService(
        "Service 2",
        "Desc",
        "URI",
        0,
        SERVICE_PRICE
      );
      const s2 = await getServiceIdFromTx(tx2);

      // Use both
      await registry.connect(user).batchUseServices(
        [s1, s2],
        [SERVICE_PRICE, SERVICE_PRICE]
      );

      const usage = await registry.userUsage(user.address);
      expect(usage.requestCount).to.equal(2);
    });

    it("should reject mismatched arrays", async function () {
      const { registry } = await deployRegistryFixture();
      
      await expect(
        registry.batchUseServices([ethers.id("service1")], [])
      ).to.be.revertedWith("ServiceRegistry: length mismatch");
    });
  });

  describe("Earnings Claiming", function () {
    it("should allow provider to claim earnings", async function () {
      const { registry, octToken, provider, user } = await deployRegistryFixture();
      
      // Register and use service
      const tx = await registry.connect(provider).registerService(
        SERVICE_NAME,
        SERVICE_DESCRIPTION,
        SERVICE_URI,
        0,
        SERVICE_PRICE
      );
      const serviceId = await getServiceIdFromTx(tx);

      await registry.connect(user).useService(serviceId, SERVICE_PRICE);
      
      // Claim earnings
      const balanceBefore = await octToken.balanceOf(provider.address);
      await registry.connect(provider).claimEarnings();
      const balanceAfter = await octToken.balanceOf(provider.address);
      
      expect(balanceAfter).to.be.greaterThan(balanceBefore);
    });

    it("should not allow claiming with no earnings", async function () {
      const { registry, provider } = await deployRegistryFixture();
      
      await expect(
        registry.connect(provider).claimEarnings()
      ).to.be.revertedWith("ServiceRegistry: no earnings");
    });
  });

  describe("Admin Functions", function () {
    it("should allow owner to update platform fee", async function () {
      const { registry } = await deployRegistryFixture();
      
      await registry.setPlatformFee(1000); // 10%
      expect(await registry.platformFee()).to.equal(1000);
    });

    it("should reject fee above maximum", async function () {
      const { registry } = await deployRegistryFixture();
      
      await expect(
        registry.setPlatformFee(3000) // Above 20%
      ).to.be.revertedWith("ServiceRegistry: fee too high");
    });

    it("should allow owner to update treasury", async function () {
      const { registry, user } = await deployRegistryFixture();
      
      await registry.setTreasury(user.address);
      expect(await registry.treasury()).to.equal(user.address);
    });

    it("should allow pausing", async function () {
      const { registry } = await deployRegistryFixture();
      
      await registry.pause();
      expect(await registry.paused()).to.be.true;
    });

    it("should prevent usage when paused", async function () {
      const { registry, provider, user } = await deployRegistryFixture();
      
      // Register service first
      const tx = await registry.connect(provider).registerService(
        SERVICE_NAME,
        SERVICE_DESCRIPTION,
        SERVICE_URI,
        0,
        SERVICE_PRICE
      );
      const serviceId = await getServiceIdFromTx(tx);

      await registry.pause();
      
      await expect(
        registry.connect(user).useService(serviceId, SERVICE_PRICE)
      ).to.be.reverted;
    });
  });

  describe("Price Tiers", function () {
    it("should return correct default prices", async function () {
      const { registry } = await deployRegistryFixture();
      
      expect(await registry.getDefaultPriceByTier(0)).to.equal(ethers.parseEther("0.1")); // Basic
      expect(await registry.getDefaultPriceByTier(1)).to.equal(ethers.parseEther("1")); // Standard
      expect(await registry.getDefaultPriceByTier(2)).to.equal(ethers.parseEther("5")); // Advanced
      expect(await registry.getDefaultPriceByTier(3)).to.equal(ethers.parseEther("10")); // Premium
    });
  });
});
