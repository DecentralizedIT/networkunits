
Date.prototype.getUnixTime = function() { 
  return this.getTime()/1000|0;
};

var web3 = require('web3')
var time = require('../test/lib/time.js')

// Contracts
var TokenContract = artifacts.require("NUToken")
var CrowdsaleContract = artifacts.require("NUCrowdsale")

module.exports = function(deployer, network, accounts) {

  var tokenInstance
  var crowdsaleInstance
  var stakeholders
  var start 

  var rates
  var baseRate = 500
  var percentageDenominator = 10000 // 4 decimals

  var minAmount = web3.utils.toWei(3333, 'ether')
  var maxAmount = web3.utils.toWei(16666, 'ether')
  var minAcceptedAmount = web3.utils.toWei(10, 'finney')
  var minAmountPresale = web3.utils.toWei(500, 'ether')
  var maxAmountPresale = web3.utils.toWei(10000, 'ether')
  var minAcceptedAmountPresale = web3.utils.toWei(10, 'finney')
  
  var phases = [{
    period: 'Presale',
    duration: 15 * time.days,
    rate: 500,
    lockupPeriod: 30 * time.days,
    usesVolumeMultiplier: true
  }, {
    period: 'First 24 hours',
    duration: 1 * time.days,
    rate: 650,
    lockupPeriod: 0,
    usesVolumeMultiplier: false
  }, {
    period: 'First week',
    duration: 7 * time.days,
    rate: 575,
    lockupPeriod: 0,
    usesVolumeMultiplier: false
  }, {
    period: 'Second week',
    duration: 7 * time.days,
    rate: 550,
    lockupPeriod: 0,
    usesVolumeMultiplier: false
  }, {
    period: 'Third week',
    duration: 7 * time.days,
    rate: 525,
    lockupPeriod: 0,
    usesVolumeMultiplier: false
  }, {
    period: 'Last week',
    duration: 7 * time.days,
    rate: 500,
    lockupPeriod: 0,
    usesVolumeMultiplier: false
  }]

  var volumeMultipliers = [{
    rate: 4000,
    lockupPeriod: 0,
    threshold: web3.utils.toWei(10, 'finney')
  }, {
    rate: 5000,
    lockupPeriod: 5000,
    threshold: web3.utils.toWei(50, 'ether')
  }, {
    rate: 6000,
    lockupPeriod: 10000,
    threshold: web3.utils.toWei(250, 'ether')
  }, {
    rate: 7000,
    lockupPeriod: 15000,
    threshold: web3.utils.toWei(1000, 'ether')
  }, {
    rate: 8000,
    lockupPeriod: 20000,
    threshold: web3.utils.toWei(2500, 'ether')
  }]

  var stakeholderTokenReleasePhases = [{
    percentage: 2500,
    vestingPeriod: 90 * time.days
  }, {
    percentage: 2500,
    vestingPeriod: 180 * time.days
  }, {
    percentage: 2500,
    vestingPeriod: 270 * time.days
  }, {
    percentage: 2500,
    vestingPeriod: 360 * time.days
  }]

  if (network == "test" || network == "develop" || network == "development") {
    start = new Date("November 8, 2017 13:00:00 GMT+0000").getUnixTime()
    stakeholders = [{
      account: accounts[0], // Beneficiary 
      tokens: 0,
      eth: 7500,
      overwriteReleaseDate: false,
      fixedReleaseDate: 0
    }, {
      account: accounts[3], // NU
      tokens: 1000,
      eth: 0,
      overwriteReleaseDate: true,
      fixedReleaseDate: new Date("November 8, 2018 13:00:00 GMT+0000").getUnixTime()
    }, {
      account: accounts[4], // Decentralized
      tokens: 1000,
      eth: 1500,
      overwriteReleaseDate: false,
      fixedReleaseDate: 0
    }, {
      account: accounts[5], // Inbound
      tokens: 1000,
      eth: 1000,
      overwriteReleaseDate: false,
      fixedReleaseDate: 0
    }, {
      account: accounts[6], // Bounty
      tokens: 500,
      eth: 0,
      overwriteReleaseDate: true,
      fixedReleaseDate: 0
    }, {
      account: accounts[1], // Coordination
      tokens: 500,
      eth: 0,
      overwriteReleaseDate: true,
      fixedReleaseDate: 0
    }, {
      account: accounts[2], // Marketing
      tokens: 500,
      eth: 0,
      overwriteReleaseDate: true,
      fixedReleaseDate: 0
    }]
  } else if(network == "main") {
    start = new Date("November 8, 2017 13:00:00 GMT+0000").getUnixTime()
    stakeholders = [{
      account: '0x3cAf983aCCccc2551195e0809B7824DA6FDe4EC8', // Beneficiary 
      tokens: 0,
      eth: 7500,
      overwriteReleaseDate: false,
      fixedReleaseDate: 0
    }, {
      account: '0xCBef13e3ae9A365304c093195D055f32C8cb2c5A', // NU
      tokens: 1000,
      eth: 0,
      overwriteReleaseDate: true,
      fixedReleaseDate: new Date("November 8, 2018 13:00:00 GMT+0000").getUnixTime()
    }, {
      account: '0xC2264F8cD959266CfcAa13124876E4654081e1Ea', // Decentralized
      tokens: 1000,
      eth: 1500,
      overwriteReleaseDate: false,
      fixedReleaseDate: 0
    }, {
      account: '0x201f2129BF943Ff4b0042ec05F123F6C8C52637C', // Inbound
      tokens: 1000,
      eth: 1000,
      overwriteReleaseDate: false,
      fixedReleaseDate: 0
    }, {
      account: '0x10e2092b56b2f41AF42F904B85a2DEF25a84d645', // Bounty
      tokens: 500,
      eth: 0,
      overwriteReleaseDate: true,
      fixedReleaseDate: 0
    }, {
      account: '0x6E9555822A46F95F65c079b2DE209B7248Eed0d0', // Coordination
      tokens: 500,
      eth: 0,
      overwriteReleaseDate: true,
      fixedReleaseDate: 0
    }, {
      account: '0x8d532e0Dbae9242BF9Ccddd9f141c3be45824E8f', // Marketing
      tokens: 500,
      eth: 0,
      overwriteReleaseDate: true,
      fixedReleaseDate: 0
    }]
  }

  return deployer.deploy(TokenContract).then(function() {
    tokenInstance = TokenContract.at(TokenContract.address)
    return tokenInstance.decimals.call()
  })
  .then(function(_decimals){
    var tokenDenominator = Math.pow(10, _decimals.toNumber())
    return deployer.deploy(CrowdsaleContract, 
      start,
      tokenInstance.address,
      tokenDenominator,
      percentageDenominator,
      minAmount,
      maxAmount,
      minAcceptedAmount,
      minAmountPresale,
      maxAmountPresale,
      minAcceptedAmountPresale)
  })
  .then(function () {
    return CrowdsaleContract.deployed()
  })
  .then(function(_instance){
    crowdsaleInstance = _instance
    return crowdsaleInstance.setupPhases(
      baseRate,
      Array.from(phases, val => val.rate), 
      Array.from(phases, val => val.duration), 
      Array.from(phases, val => val.lockupPeriod),
      Array.from(phases, val => val.usesVolumeMultiplier))
  })
  .then(function(){
    return crowdsaleInstance.setupStakeholders(
      Array.from(stakeholders, val => val.account), 
      Array.from(stakeholders, val => val.eth), 
      Array.from(stakeholders, val => val.tokens),
      Array.from(stakeholders, val => val.overwriteReleaseDate),
      Array.from(stakeholders, val => val.fixedReleaseDate),
      Array.from(stakeholderTokenReleasePhases, val => val.percentage),
      Array.from(stakeholderTokenReleasePhases, val => val.vestingPeriod))
  })
  .then(function(){
    return crowdsaleInstance.setupVolumeMultipliers(
      Array.from(volumeMultipliers, val => val.rate), 
      Array.from(volumeMultipliers, val => val.lockupPeriod), 
      Array.from(volumeMultipliers, val => val.threshold))
  })
  .then(function(){
    return crowdsaleInstance.deploy()
  })
  .then(function(){
    return tokenInstance.transferOwnership(crowdsaleInstance.address)
  })
}
