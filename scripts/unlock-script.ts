console.log('start unlock')

import { Contract, Event } from '@ethersproject/contracts';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { ethers } from "hardhat";

let owner: SignerWithAddress;

async function unlock() {
    [owner] = await ethers.getSigners();
    var token = await ethers.getContractAt("BackedToken", '0xf084A54B705a21eF342D2C30F55A4CE4ca4dCf2C');

    await token.connect(owner).unlock();
    console.log('done')
}

unlock()
    //  debug()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
