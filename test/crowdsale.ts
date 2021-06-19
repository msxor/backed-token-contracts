import { Contract, Event } from '@ethersproject/contracts';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { ethers, network } from "hardhat";

describe('crowdsale', () => {
    let base = ethers.BigNumber.from(10).pow(18);
    let owner: SignerWithAddress;
    let user: SignerWithAddress;
    let user2: SignerWithAddress;
    let cap = ethers.BigNumber.from(16076000).mul(base);
    let rate = 80380;
    let min = ethers.BigNumber.from(1).mul(base);
    let max = ethers.BigNumber.from(5).mul(base);
    let token: Contract;
    let crowdsale: Contract;
    beforeEach(async function () {
        [owner, user, user2] = await ethers.getSigners();
        let backedTokenFactory = await ethers.getContractFactory("BackedToken");
        token = await backedTokenFactory.deploy();
        let crowdsaleFactory = await ethers.getContractFactory("BackedCrowdsale");
        crowdsale = await crowdsaleFactory.deploy(
            rate,//rate
            owner.address,//owner
            cap,//cap
            token.address,//erc20
            min,//min
            max//max
        );

        await token.connect(owner).approve(crowdsale.address, cap);
    });

    it("User buys min -> gets tokens at rate", async () => {
        await user.sendTransaction({
            to: crowdsale.address,
            value: ethers.utils.parseEther("1.0")
        });

        var balance = await token.balanceOf(user.address);
        expect(balance).to.be.equal(ethers.BigNumber.from(rate).mul(base));
    });

    it("User buys max -> gets tokens at rate", async () => {
        await user.sendTransaction({
            to: crowdsale.address,
            value: ethers.utils.parseEther("5.0")
        });

        var balance = await token.balanceOf(user.address);
        expect(balance).to.be.equal(ethers.BigNumber.from(rate).mul(base).mul(5));
    });

    it("User buys more then max -> fail", async () => {
        await expect(
            user.sendTransaction({
                to: crowdsale.address,
                value: ethers.utils.parseEther("5.1")
            })
        ).to.be.reverted;
    });

    it("User buys less then min -> fail", async () => {
        await expect(
            user.sendTransaction({
                to: crowdsale.address,
                value: ethers.utils.parseEther("0.9")
            })
        ).to.be.reverted;
    });

    //TODO:wait confirmation
    it("User buys max twice -> success???", async () => {
        await user.sendTransaction({
            to: crowdsale.address,
            value: ethers.utils.parseEther("5.0")
        });
        await user.sendTransaction({
            to: crowdsale.address,
            value: ethers.utils.parseEther("5.0")
        });
        var balance = await token.balanceOf(user.address);
        expect(balance).to.be.equal(ethers.BigNumber.from(rate).mul(base).mul(5).mul(2));
    });

    it("User transfers while token is locked -> fail", async () => {
        await user.sendTransaction({
            to: crowdsale.address,
            value: ethers.utils.parseEther("1.0")
        });

        await expect(
            token.connect(user).transfer(user2.address, 1)
        ).to.be.reverted;
    });

    it("User transfers after token is unlocked -> success", async () => {
        await user.sendTransaction({
            to: crowdsale.address,
            value: ethers.utils.parseEther("1.0")
        });
        await token.connect(owner).unlock();

        await token.connect(user).transfer(user2.address, 1);

        var balance = await token.balanceOf(user2.address);
        expect(balance).to.be.equal(1);
    });

    it("User(not owner) unlocks -> fail", async () => {
        await expect(
            token.connect(user).unlock()
        ).to.be.reverted;
    });
});