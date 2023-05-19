import { Wallet, utils } from "zksync-web3";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";
const { privateKey, rewardsToken, stakingToken, admin } = require('../secrets.json');

export default async function (hre: HardhatRuntimeEnvironment) {
  console.log(`Running deploy script for the StakingRewards contract`);

  const wallet = new Wallet(privateKey);

  const deployer = new Deployer(hre, wallet);
  const artifact = await deployer.loadArtifact("StakingRewards");

  const deploymentFee = await deployer.estimateDeployFee(artifact, [rewardsToken, stakingToken, admin]);

  const parsedFee = ethers.utils.formatEther(deploymentFee.toString());
  console.log(`The deployment is estimated to cost ${parsedFee} ETH`);

  const stakingRewardsContract = await deployer.deploy(artifact, [rewardsToken, stakingToken, admin]);

  console.log("constructor args:" + stakingRewardsContract.interface.encodeDeploy([rewardsToken, stakingToken, admin]));

  const contractAddress = stakingRewardsContract.address;
  console.log(`${artifact.contractName} was deployed to ${contractAddress}`);
}
