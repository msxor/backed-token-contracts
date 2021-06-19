console.log('start deployment')

import { Contract, Event } from '@ethersproject/contracts';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { ethers } from "hardhat";

let base = ethers.BigNumber.from(10).pow(18);
let owner: SignerWithAddress;
let cap = ethers.BigNumber.from(16076000).mul(base);
let rate = 80380;
let min = ethers.BigNumber.from(1).mul(base);
let max = ethers.BigNumber.from(5).mul(base);
let token: Contract;
let crowdsale: Contract;

async function deploy() {
    [owner] = await ethers.getSigners();
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

    console.log('token address:' + token.address);
    console.log('crowdsale address:' + crowdsale.address);
}

deploy()
    //  debug()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
