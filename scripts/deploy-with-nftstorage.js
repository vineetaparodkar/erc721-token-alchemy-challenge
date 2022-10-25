// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
require("dotenv").config();
const { NFTStorageService } = require("./NFTStorageService");

const { MINTER_ACCOUNT } = process.env;

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const Erc721Token = await hre.ethers.getContractFactory("ERC721Token");
  const erc721Token = await Erc721Token.deploy(
    "ERC721Token",
    "ERC721",
    MINTER_ACCOUNT
  );

  await erc721Token.deployed();
  console.log("ERC721Token deployed to: ", erc721Token.address);
  const ipfsuri = await NFTStorageService(
    "./assets/pexels-daniel-dan-7708818.jpg"
  );
  const uri = `https://ipfs.io/ipfs/${ipfsuri}/metadata.json`;
  console.log("URL:", uri);
  const mintTokenTx = await erc721Token.safeMint(MINTER_ACCOUNT, uri);
  mintTokenTx.wait();
  console.log("Token Minted successfully!!");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
