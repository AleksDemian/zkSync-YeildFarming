// // import { expect } from 'chai';
// // import { Wallet, Provider, Contract } from 'zksync-web3';
// import * as hre from 'hardhat';
// import { Deployer } from '@matterlabs/hardhat-zksync-deploy';

// // import RewardERC20 from '../artifacts-zk/contracts/test/RewardERC20.sol/RewardERC20.json'
// // import StakeERC20 from '../artifacts-zk/contracts/test/StakeERC20.sol/StakeERC20.json'
// // import StakingRewards from '../artifacts-zk/contracts/StakingRewards.sol/StakingRewards.json'

// const RICH_WALLET_PK =
//   '0x7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110';
// // const RICH_WALLET_ADR = 
// //   '0x36615Cf349d7F6344891B1e7CA7C72883F5dc049';
// const RICH_WALLET_PK_STAKE1 = '0xac1e735be8536c6534bb4f17f06f6afc73b2b5ba84ac2cfb12f7461b20c0bbe3';
// // const RICH_WALLET_PK_STAKE2 = '0xd293c684d884d56f8d6abd64fc76757d3664904e309a0645baf8522ab6366d9e';


// // async function deployRewardContract(deployer: Deployer): Promise<Contract>{
// //   const artifactReward = await deployer.loadArtifact('RewardERC20');
// //   return await deployer.deploy(artifactReward);
// // }

// // // async function deployStakeContract(deployer: Deployer): Promise<Contract> {
// // //   const artifactStake = await deployer.loadArtifact('StakeERC20');
// // //   return await deployer.deploy(artifactStake)
// // // }

// // // async function deployStakingRewardsContract(deployer: Deployer, args: []): Promise<Contract> {
// // //   const artifactStakingRewards = await deployer.loadArtifact('StakingRewards');
// // //   return await deployer.deploy(artifactStakingRewards, []);
// // // }

// // describe("Staking Rewards", function() {
// //     const provider = Provider.getDefaultProvider();

// //     const wallet = new Wallet(RICH_WALLET_PK, provider);
// //     const deployer = new Deployer(hre, wallet);

// //     const staker = new Wallet(RICH_WALLET_PK_STAKE1, provider);
// //     const secondStaker = new Wallet(RICH_WALLET_PK_STAKE2, provider);

// //     // const artifactReward = await deployer.loadArtifact('RewardERC20');
// //     // const rewardContract = await deployer.deploy(artifactReward)

// //     // beforeEach(async () => {
// //     //     const stakingRewards = await deployContracts(deployer);
// //     //     console.log('stakingRewards', stakingRewards)
// //     // });

// //     it('deploy cost', async () => {
// //         const reward = await deployRewardContract(deployer);
// //         console.log('reward', reward)
// //         // const stake = await deployStakeContract(deployer);
// //         // console.log('stake', stake)
// //         // const stakingRewards = await deployStakingRewardsContract(deployer, [reward.address]);
// //         // const receipt1 = await provider.getTransactionReceipt(reward.deployTransaction.hash)
// //         // expect(receipt1.gasUsed).to.eq('368268')
// //         // const receipt2 = await provider.getTransactionReceipt(stake.deployTransaction.hash)
// //         // expect(receipt2.gasUsed).to.eq('368268')
// //     })
// // })

// // SPDX-License-Identifier: MIT
// import { ethers } from "hardhat";
// import { Provider, Wallet, Contract } from "zksync-web3";
// import { expect } from "chai";

// describe("StakingRewards", function () {
//   let rewardsContract: Contract;
//   let rewardsToken: Contract;
//   let stakingToken: Contract;
//   let admin: Wallet;
//   let user1: Wallet;

//   beforeEach(async function () {
//     const provider = Provider.getDefaultProvider();

//     admin = new Wallet(RICH_WALLET_PK, provider);
//     user1 = new Wallet(RICH_WALLET_PK_STAKE1, provider);

//     const deployer = new Deployer(hre, admin);

//     const artifactReward = await deployer.loadArtifact('RewardERC20');
//     rewardsToken = await deployer.deploy(artifactReward);
    
//     const artifactStake = await deployer.loadArtifact('StakeERC20');
//     stakingToken = await deployer.deploy(artifactStake);

//     const artifactStakingRewards = await deployer.loadArtifact('StakingRewards');
//     rewardsContract = await deployer.deploy(artifactStakingRewards, [rewardsToken.address, stakingToken.address, admin.address]);
//     await rewardsContract.deployed();

//     // Transfer initial supply of tokens for testing
//     await rewardsToken.transfer(rewardsContract.address, ethers.utils.parseEther("1000"));
//     await stakingToken.transfer(user1.address, ethers.utils.parseEther("100"));
//   });

//   it("should stake tokens", async function () {
//     const initialBalance = await stakingToken.balanceOf(rewardsContract.address);
//     const initialTotalSupply = await rewardsContract.totalSupply();
//     const initialUserBalance = await rewardsContract.balanceOf(user1.address);

//     await rewardsContract.connect(user1).stake(ethers.utils.parseEther("50"));

//     const finalBalance = await stakingToken.balanceOf(rewardsContract.address);
//     const finalTotalSupply = await rewardsContract.totalSupply();
//     const finalUserBalance = await rewardsContract.balanceOf(user1.address);

//     expect(finalBalance).to.equal(initialBalance.add(ethers.utils.parseEther("50")));
//     expect(finalTotalSupply).to.equal(initialTotalSupply.add(ethers.utils.parseEther("50")));
//     expect(finalUserBalance).to.equal(initialUserBalance.add(ethers.utils.parseEther("50")));
//   });

//   it("should withdraw tokens", async function () {
//     await rewardsContract.connect(user1).stake(ethers.utils.parseEther("50"));

//     const initialBalance = await stakingToken.balanceOf(await user1.getAddress());
//     const initialTotalSupply = await rewardsContract.totalSupply();
//     const initialUserBalance = await rewardsContract.balanceOf(await user1.getAddress());

//     await rewardsContract.connect(user1).withdraw(ethers.utils.parseEther("20"));

//     const finalBalance = await stakingToken.balanceOf(await user1.getAddress());
//     const finalTotalSupply = await rewardsContract.totalSupply();
//     const finalUserBalance = await rewardsContract.balanceOf(await user1.getAddress());

//     expect(finalBalance).to.equal(initialBalance.add(ethers.utils.parseEther("20")));
//     expect(finalTotalSupply).to.equal(initialTotalSupply.sub(ethers.utils.parseEther("20")));
//     expect(finalUserBalance).to.equal(initialUserBalance.sub(ethers.utils.parseEther("20")));
//   });

//   it("should get rewards", async function () {
//     await rewardsContract.connect(user1).stake(ethers.utils.parseEther("50"));
//     await rewardsContract.connect(user1).getReward();

//     const initialRewardBalance = await rewardsToken.balanceOf(await user1.getAddress());
//     await rewardsContract.connect(user1).getReward();
//     const finalRewardBalance = await rewardsToken.balanceOf(await user1.getAddress());

//     expect(finalRewardBalance).to.equal(initialRewardBalance);
//   });
// });
