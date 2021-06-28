console.log('start deployment')

import { Contract, Event } from '@ethersproject/contracts';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { ethers } from "hardhat";

let token: Contract;
let owner: SignerWithAddress;
let cap = ethers.BigNumber.from("400002098041478280026");

let rate = 95327;
let min = ethers.utils.parseEther("0.1");
let max = ethers.utils.parseEther("1");
let crowdsale: Contract;

async function deploy() {
    //49456986
    //38130800
    [owner] = await ethers.getSigners();
    let backedTokenFactory = await ethers.getContractFactory("BackedToken");
    token = await backedTokenFactory.deploy();
    console.log(rate,//rate
        owner.address,//owner
        '0x5e930d9025B57BA34f4cEA7De73BD54261E9ec2A',
        cap,//cap
        token.address,//erc20
        min,//min
        max);//max);
    [owner] = await ethers.getSigners();
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

    [owner] = await ethers.getSigners();
    
    await token.connect(owner).approve(crowdsale.address, cap.mul(rate));
    console.log('token address:' + token.address);
    console.log('presale address:' + crowdsale.address);

}

deploy()
    //  debug()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });