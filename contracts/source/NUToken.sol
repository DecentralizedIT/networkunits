pragma solidity ^0.4.15;

import "./token/IToken.sol";
import "./token/ManagedToken.sol";
import "../infrastructure/ITokenRetreiver.sol";

/**
 * @title NU (Network Units) token
 *
 * #created 22/10/2017
 * #author Frank Bonnet
 */
contract NUToken is ManagedToken, ITokenRetreiver {


    /**
     * Starts with a total supply of zero and the creator starts with 
     * zero tokens (just like everyone else)
     */
    function NUToken() ManagedToken("Network Units Token", "NU", true) {}


    /**
     * Failsafe mechanism
     * 
     * Allows owner to retreive tokens from the contract
     *
     * @param _tokenContract The address of ERC20 compatible token
     */
    function retreiveTokens(address _tokenContract) public only_owner {
        IToken tokenInstance = IToken(_tokenContract);
        uint tokenBalance = tokenInstance.balanceOf(this);
        if (tokenBalance > 0) {
            tokenInstance.transfer(owner, tokenBalance);
        }
    }


    /**
     * Prevents accidental sending of ether
     */
    function () payable {
        revert();
    }
}
