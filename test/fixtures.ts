import { Contract, Wallet, Provider } from 'zksync-web3'
import { Deployer } from '@matterlabs/hardhat-zksync-deploy';
import * as hre from 'hardhat';

// import RewardERC20 from '../artifacts-zk/contracts/test/RewardERC20.sol/RewardERC20.json'
// import StakeERC20 from '../artifacts-zk/contracts/test/StakeERC20.sol/StakeERC20.json'
// import StakingRewards from '../artifacts-zk/contracts/StakingRewards.sol/StakingRewards.json'

interface StakingRewardsFixture {
  stakingRewards: Contract
  rewardsToken: Contract
  stakingToken: Contract
  admin: String
}

const RICH_WALLET_PK =
  '0x7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110';

export async function stakingRewardsFixture(): Promise<StakingRewardsFixture> {
  const provider = Provider.getDefaultProvider();
  const wallet = new Wallet(RICH_WALLET_PK, provider);
  
  const deployer = new Deployer(hre, wallet);

  const artifactReward = await deployer.loadArtifact('RewardERC20');
  const rewardsToken = await deployer.deploy(artifactReward);

  const artifactStake = await deployer.loadArtifact('StakeERC20');
  const stakingToken = await deployer.deploy(artifactStake)
  // const rewardsToken = await deployContract(wallet, RewardERC20)
  // const stakingToken = await deployContract(wallet, StakeERC20)
  const admin = wallet.address

  const artifactStakingRewards = await deployer.loadArtifact('StakingRewards');
  const stakingRewards = await deployer.deploy(artifactStakingRewards, [
    rewardsToken.address,
    stakingToken.address,
    admin
  ]);
  // const stakingRewards = await deployContract(wallet, StakingRewards, [
  //   rewardsToken.address,
  //   stakingToken.address,
  //   admin
  // ])

  return { stakingRewards, rewardsToken, stakingToken, admin }
}
