import { task } from 'hardhat/config';
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-etherscan";

import { HardhatRuntimeEnvironment, HardhatUserConfig } from 'hardhat/types';

task("accounts", "Prints the list of accounts", async (args, hre: HardhatRuntimeEnvironment) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

const config: HardhatUserConfig = {
  solidity: {
    version: "0.5.15",
    settings: {
      optimizer: {
        enabled: true,
        runs: 5000
      }
    }
  },
  networks: {
    hardhat: {
      chainId: 1337,
    },
    rinkeby: {
      chainId: 4,
      url: `https://rinkeby.infura.io/v3/bc4d11088848481a972333f5161120fe`,
      accounts:   {
        mnemonic: `absurd anchor bullet lobster unable exclude weird lucky bar soda dumb first`
      },
      gasPrice: 2000000000,
    },
    mainnet: {
      chainId: 1,
      url: `https://mainnet.infura.io/v3/bc4d11088848481a972333f5161120fe`,
      accounts:   {
        mnemonic: ``
      },
      gasPrice: 50000000000,
    }
  },
  etherscan: {
    apiKey: "FRCI5HAB5CFXRX88IYAQKXM7CPBPH52YWM"
  }
}

export default config