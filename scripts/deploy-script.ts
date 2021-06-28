console.log('start deployment')

import { Contract, Event } from '@ethersproject/contracts';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { ethers } from "hardhat";

let owner: SignerWithAddress;
let token: Contract;

async function deploy() {
    [owner] = await ethers.getSigners();
    let backedTokenFactory = await ethers.getContractFactory("BackedToken");
    token = await backedTokenFactory.deploy();
    

    console.log('token address:' + token.address);
}

deploy()
    //  debug()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });