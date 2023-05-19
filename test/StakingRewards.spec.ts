import chai, { expect } from 'chai'
import { Contract, BigNumber, constants } from 'ethers'
import { solidity, MockProvider, createFixtureLoader, deployContract } from 'ethereum-waffle'
import { Deployer } from '@matterlabs/hardhat-zksync-deploy';

import { stakingRewardsFixture } from './fixtures'
import { expandTo18Decimals, mineBlock } from './utils'

import StakingRewards from '../artifacts-zk/contracts/StakingRewards.sol/StakingRewards.json'
import { Address } from 'zksync-web3/build/src/types'

chai.use(solidity)

describe('StakingRewards', () => {
  const provider = new MockProvider()
  const [wallet, ownerwallet, staker, secondStaker] = provider.getWallets()
  const loadFixture = createFixtureLoader([wallet], provider)

  let stakingRewards: Contract
  let rewardsToken: Contract
  let stakingToken: Contract
  let admin: String

  beforeEach(async () => {
    const fixture = await loadFixture(stakingRewardsFixture)
    stakingRewards = fixture.stakingRewards
    rewardsToken = fixture.rewardsToken
    stakingToken = fixture.stakingToken
    admin = fixture.admin
  })

  it('deploy cost', async () => {
    const stakingRewards = await deployContract(wallet, StakingRewards, [
      rewardsToken.address,
      stakingToken.address,
      admin
    ])
    console.log('stakingRewards', stakingRewards)
    const receipt = await provider.getTransactionReceipt(stakingRewards.deployTransaction.hash)
    expect(receipt.gasUsed).to.eq('368268')
  })

  const reward = expandTo18Decimals(100)

  // async function start(reward: BigNumber) {
  //   // send reward to the contract
  //   const rewardtransfer = await rewardsToken.transfer(stakingRewards.address, reward)
  //   // console.log('rewardtransfer', rewardtransfer)
  //   // await stakingRewards.notifyRewardAmount(reward)
  // }

  it('notifyRewardAmount: full', async () => {
      const rewardtransfer = await rewardsToken.transferFrom(wallet.address, stakingRewards.address, reward)
      console.log('rewardtransfer', rewardtransfer)
      const balance = await rewardsToken.balanceOf(stakingRewards.address)
      console.log('balance', balance)
  //   await start(reward)
  //   // stake with staker
  //   const stake = expandTo18Decimals(10)
  //   const staketransfer = await stakingToken.transfer(staker.address, stake)
  //   console.log('staketransfer', staketransfer)
  //   await stakingToken.connect(staker).approve(stakingRewards.address, stake)
  //   const stakerST = await stakingRewards.connect(staker).stake(stake)
  //   console.log('stakerST', stakerST)

  //   // const endTime = await time.latestBlock();
  //   // console.log('endTime', endTime)
  //   const blockNumBefore = await provider.getBlockNumber();
  //   console.log('blockNumBefore', blockNumBefore)
    
  //   const timeInterval = 60 * 60 * 24; //1 hour
  //   // await provider.send('evm_increaseTime', [timeInterval]);
  //   // await provider.send('evm_mine', [timeInterval]);
  //   await mineBlock(provider, timeInterval)
  //   const blockNumAfter = await provider.getBlockNumber();
  //   console.log('blockNumAfter', blockNumAfter)
  //   // fast-forward past the reward window
  //   // await time.increase(3600);

  //   // unstake
  //   const exitstake = await stakingRewards.connect(staker).exit()
  //   console.log('exitstake', exitstake)
  //   // expect(stakeEndTime).to.be.eq(endTime)

  //   const rewardAmount = await rewardsToken.balanceOf(staker.address)
  //   console.log('rewardAmount', rewardAmount)
  //   expect(reward.sub(rewardAmount).lte(reward.div(10000))).to.be.true // ensure result is within .01%
  //   // expect(rewardAmount).to.be.eq(reward.div(REWARDS_DURATION).mul(REWARDS_DURATION))
  })

  // it('notifyRewardAmount: ~half', async () => {
  //   // const { startTime, endTime } = await start(reward)

  //   // fast-forward ~halfway through the reward window
  //   // await mineBlock(provider, startTime.add(endTime.sub(startTime).div(2)).toNumber())

  //   // stake with staker
  //   const stake = expandTo18Decimals(2)
  //   await stakingToken.transfer(staker.address, stake)
  //   await stakingToken.connect(staker).approve(stakingRewards.address, stake)
  //   await stakingRewards.connect(staker).stake(stake)
  //   const stakeStartTime: BigNumber = await stakingRewards.lastUpdateTime()

  //   // fast-forward past the reward window
  //   // await mineBlock(provider, endTime.add(1).toNumber())

  //   // unstake
  //   await stakingRewards.connect(staker).exit()
  //   const stakeEndTime: BigNumber = await stakingRewards.lastUpdateTime()
  //   // expect(stakeEndTime).to.be.eq(endTime)

  //   const rewardAmount = await rewardsToken.balanceOf(staker.address)
  //   expect(reward.div(2).sub(rewardAmount).lte(reward.div(2).div(10000))).to.be.true // ensure result is within .01%
  //   // expect(rewardAmount).to.be.eq(reward.div(REWARDS_DURATION).mul(endTime.sub(stakeStartTime)))
  // }).retries(2) // TODO investigate flakiness

  // it('notifyRewardAmount: two stakers', async () => {
  //   // stake with first staker
  //   const stake = expandTo18Decimals(2)
  //   await stakingToken.transfer(staker.address, stake)
  //   await stakingToken.connect(staker).approve(stakingRewards.address, stake)
  //   await stakingRewards.connect(staker).stake(stake)

  //   // const { startTime, endTime } = await start(reward)

  //   // fast-forward ~halfway through the reward window
  //   // await mineBlock(provider, startTime.add(endTime.sub(startTime).div(2)).toNumber())

  //   // stake with second staker
  //   await stakingToken.transfer(secondStaker.address, stake)
  //   await stakingToken.connect(secondStaker).approve(stakingRewards.address, stake)
  //   await stakingRewards.connect(secondStaker).stake(stake)

  //   // fast-forward past the reward window
  //   // await mineBlock(provider, endTime.add(1).toNumber())

  //   // unstake
  //   await stakingRewards.connect(staker).exit()
  //   const stakeEndTime: BigNumber = await stakingRewards.lastUpdateTime()
  //   // expect(stakeEndTime).to.be.eq(endTime)
  //   await stakingRewards.connect(secondStaker).exit()

  //   const rewardAmount = await rewardsToken.balanceOf(staker.address)
  //   const secondRewardAmount = await rewardsToken.balanceOf(secondStaker.address)
  //   const totalReward = rewardAmount.add(secondRewardAmount)

  //   // ensure results are within .01%
  //   expect(reward.sub(totalReward).lte(reward.div(10000))).to.be.true
  //   expect(totalReward.mul(3).div(4).sub(rewardAmount).lte(totalReward.mul(3).div(4).div(10000)))
  //   expect(totalReward.div(4).sub(secondRewardAmount).lte(totalReward.div(4).div(10000)))
  // })
})
