//SPDX-License-Identifier: MIT
pragma solidity ^0.5.0;

import "@openzeppelin/contracts/crowdsale/Crowdsale.sol";
import "@openzeppelin/contracts/crowdsale/emission/AllowanceCrowdsale.sol";
import "@openzeppelin/contracts/crowdsale/validation/CappedCrowdsale.sol";

contract BackedCrowdsale is Crowdsale, CappedCrowdsale, AllowanceCrowdsale {
    uint256 _minAmount;
    uint256 _maxAmount;

    constructor(
        uint256 rate,
        address payable wallet,
        uint256 cap,
        IERC20 token,
        uint256 minAmount,
        uint256 maxAmount
    )
        public
        CappedCrowdsale(cap)
        AllowanceCrowdsale(wallet)
        Crowdsale(rate, wallet, token)
    {
        _minAmount = minAmount;
        _maxAmount = maxAmount;
    }

    /**
     * @dev Extend parent behavior requiring purchase to respect the funding cap.
     * @param beneficiary Token purchaser
     * @param weiAmount Amount of wei contributed
     */
    function _preValidatePurchase(address beneficiary, uint256 weiAmount)
        internal
        view
    {
        require(
            weiAmount <= _maxAmount,
            "BackedCrowdsale: weiAmount<=_maxAmount"
        );
        require(
            weiAmount >= _minAmount,
            "BackedCrowdsale: weiAmount >= _minAmount"
        );

        super._preValidatePurchase(beneficiary, weiAmount);
    }
}
