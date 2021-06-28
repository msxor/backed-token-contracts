console.log('start deployment')

import { Contract, Event } from '@ethersproject/contracts';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { ethers } from "hardhat";

let owner: SignerWithAddress;
// ((27803853M / 139000M)*(decimal) Math.Pow(10,18))
let cap = ethers.BigNumber.from("200027719424460431654");
console.log(cap);

let rate = 139000 ;
let min = ethers.utils.parseEther("0.1");
console.log(min);
let max = ethers.utils.parseEther("0.5");
console.log(max);

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
        '0x5e930d9025B57BA34f4cEA7De73BD54261E9ec2A',
        cap,//cap
        token.address,//erc20
        min,//min
        max//max
    );

    await token.connect(owner).approve(crowdsale.address, cap.mul(rate));

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