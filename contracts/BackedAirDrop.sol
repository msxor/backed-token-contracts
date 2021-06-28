//SPDX-License-Identifier: MIT
pragma solidity ^0.5.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/ownership/Ownable.sol";

contract BackedAirDrop is Ownable{
    address from;
    constructor(ERC20 _token) public {
        token = _token;
        from = msg.sender;
    }
    ERC20 public token;
    function airdropDynamic(address[] memory _recipients, uint256[] memory _amount) public onlyOwner {
        for (uint256 i = 0; i < _recipients.length; i++) {
            require(token.transferFrom(from,_recipients[i], _amount[i]));
        } 
    }
}