require("@nomiclabs/hardhat-waffle");
require("dotenv").config();
const fs = require("fs");
const PRIVATE_KEY = fs.readFileSync(".secret").toString().trim();
const { POLYGON_TESTNET_URL } = process.env;

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  defaultNetwork: "polygon",
  networks: {
    hardhat: {},
    polygon: {
      url: POLYGON_TESTNET_URL,
      accounts: [`0x${PRIVATE_KEY}`],
      timeout: 20000,
      network_id: 80001,
    },
  },
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  paths: {
    artifacts: "./artifacts",
  },
};
