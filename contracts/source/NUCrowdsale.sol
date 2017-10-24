pragma solidity ^0.4.15;

import "./crowdsale/Crowdsale.sol";
import "../infrastructure/ITokenRetreiver.sol";
import "../integration/wings/IWingsAdapter.sol";

/**
 * @title NUCrowdsale
 *
 * Network Units (NU) is a decentralised worldwide collaboration of computing power
 *
 * By allowing gamers and service providers to participate in our unique mining 
 * process, we will create an ultra-fast, blockchain controlled multiplayer infrastructure 
 * rentable by developers
 *
 * Visit https://networkunits.io/
 *
 * #created 22/10/2017
 * #author Frank Bonnet
 */
contract NUCrowdsale is Crowdsale, ITokenRetreiver, IWingsAdapter {


    /**
     * Setup the crowdsale
     *
     * @param _start The timestamp of the start date
     * @param _token The token that is sold
     * @param _tokenDenominator The token amount of decimals that the token uses
     * @param _percentageDenominator The precision of percentages
     * @param _minAmount The min cap for the ICO
     * @param _maxAmount The max cap for the ICO
     * @param _minAcceptedAmount The lowest accepted amount during the ICO phase
     * @param _minAmountPresale The min cap for the presale
     * @param _maxAmountPresale The max cap for the presale
     * @param _minAcceptedAmountPresale The lowest accepted amount during the presale phase
     */
    function NUCrowdsale(uint _start, address _token, uint _tokenDenominator, uint _percentageDenominator, uint _minAmount, uint _maxAmount, uint _minAcceptedAmount, uint _minAmountPresale, uint _maxAmountPresale, uint _minAcceptedAmountPresale) 
        Crowdsale(_start, _token, _tokenDenominator, _percentageDenominator, _minAmount, _maxAmount, _minAcceptedAmount, _minAmountPresale, _maxAmountPresale, _minAcceptedAmountPresale) {
    }


    /**
     * Wings integration - Get the total raised amount of Ether
     *
     * Can only increased, means if you withdraw ETH from the wallet, should be not modified (you can use two fields 
     * to keep one with a total accumulated amount) amount of ETH in contract and totalCollected for total amount of ETH collected
     *
     * @return Total raised Ether amount
     */
    function totalCollected() public constant returns (uint) {
        return raised;
    }


    /**
     * Allows the implementing contract to validate a 
     * contributing account
     *
     * @param _contributor Address that is being validated
     * @return Wheter the contributor is accepted or not
     */
    function isAcceptedContributor(address _contributor) internal constant returns (bool) {
        return _contributor != address(0x0);
    }


    /**
     * Failsafe mechanism
     * 
     * Allows beneficary to retreive tokens from the contract
     *
     * @param _tokenContract The address of ERC20 compatible token
     */
    function retreiveTokens(address _tokenContract) public only_beneficiary {
        IToken tokenInstance = IToken(_tokenContract);

        // Retreive tokens from our token contract
        ITokenRetreiver(token).retreiveTokens(_tokenContract);

        // Retreive tokens from crowdsale contract
        uint tokenBalance = tokenInstance.balanceOf(this);
        if (tokenBalance > 0) {
            tokenInstance.transfer(beneficiary, tokenBalance);
        }
    }
}