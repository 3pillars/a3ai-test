import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  // Deploy OCT Token
  console.log("\n--- Deploying OCTToken ---");
  const OCTToken = await ethers.getContractFactory("OCTToken");
  const octToken = await OCTToken.deploy(deployer.address);
  await octToken.waitForDeployment();
  const octTokenAddress = await octToken.getAddress();
  console.log("OCTToken deployed to:", octTokenAddress);

  // Deploy Staking
  console.log("\n--- Deploying Staking ---");
  const Staking = await ethers.getContractFactory("Staking");
  const staking = await Staking.deploy(octTokenAddress);
  await staking.waitForDeployment();
  const stakingAddress = await staking.getAddress();
  console.log("Staking deployed to:", stakingAddress);

  // Deploy ServiceRegistry
  console.log("\n--- Deploying ServiceRegistry ---");
  const ServiceRegistry = await ethers.getContractFactory("ServiceRegistry");
  const serviceRegistry = await ServiceRegistry.deploy(octTokenAddress, deployer.address);
  await serviceRegistry.waitForDeployment();
  const serviceRegistryAddress = await serviceRegistry.getAddress();
  console.log("ServiceRegistry deployed to:", serviceRegistryAddress);

  // Transfer some tokens to staking contract for rewards
  console.log("\n--- Setting up staking rewards ---");
  const rewardAmount = ethers.parseEther("10000000"); // 10M OCT for rewards
  await octToken.transfer(stakingAddress, rewardAmount);
  console.log("Transferred", rewardAmount.toString(), "OCT to Staking contract");

  // Verify token has correct settings
  console.log("\n--- Verification ---");
  const maxSupply = await octToken.MAX_SUPPLY();
  console.log("Max Supply:", ethers.formatEther(maxSupply), "OCT");
  
  const deployerBalance = await octToken.balanceOf(deployer.address);
  console.log("Deployer Balance:", ethers.formatEther(deployerBalance), "OCT");

  console.log("\n=== Deployment Complete ===");
  console.log("OCTToken:", octTokenAddress);
  console.log("Staking:", stakingAddress);
  console.log("ServiceRegistry:", serviceRegistryAddress);

  // Save deployment addresses
  const fs = require("fs");
  const deploymentInfo = {
    network: (await ethers.provider.getNetwork()).name,
    chainId: (await ethers.provider.getNetwork()).chainId.toString(),
    timestamp: new Date().toISOString(),
    deployer: deployer.address,
    contracts: {
      OCTToken: octTokenAddress,
      Staking: stakingAddress,
      ServiceRegistry: serviceRegistryAddress,
    },
  };
  
  fs.writeFileSync(
    "./deployments/deployment.json",
    JSON.stringify(deploymentInfo, null, 2)
  );
  console.log("\nDeployment info saved to deployments/deployment.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
