//SPDX-License-Identifier: MIT
pragma solidity ^0.5.0;

import "@openzeppelin/contracts/crowdsale/Crowdsale.sol";
import "@openzeppelin/contracts/crowdsale/emission/AllowanceCrowdsale.sol";
import "@openzeppelin/contracts/crowdsale/validation/CappedCrowdsale.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

contract BackedCrowdsale is Crowdsale, CappedCrowdsale, AllowanceCrowdsale {
    using SafeMath for uint256;
    uint256 _minAmount;
    uint256 _maxAmount;
    mapping(address => uint256) _balances;

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
            weiAmount.add(_balances[beneficiary]) <= _maxAmount,
            "BackedCrowdsale: weiAmount <= _maxAmount"
        );

        require(
            weiAmount.add(_balances[beneficiary]) >= _minAmount,
            "BackedCrowdsale: weiAmount >= _minAmount"
        );

        super._preValidatePurchase(beneficiary, weiAmount);
    }

    /**
     * @dev Override for extensions that require an internal state to check for validity (current user contributions,
     * etc.)
     * @param beneficiary Address receiving the tokens
     * @param weiAmount Value in wei involved in the purchase
     */
    function _updatePurchasingState(address beneficiary, uint256 weiAmount)
        internal
    {
        // solhint-disable-previous-line no-empty-blocks
        super._updatePurchasingState(beneficiary, weiAmount);
        _balances[beneficiary] = weiAmount.add(
            _balances[beneficiary] + weiAmount
        );
    }
}
