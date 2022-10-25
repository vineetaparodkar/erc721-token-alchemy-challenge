const { NFTStorage, File } = require("nft.storage");
const fs = require("fs");
const mime = require("mime");
const path = require("path");

require("dotenv").config();
const { NFT_STORAGE_API_KEY } = process.env || "";

const client = new NFTStorage({ token: NFT_STORAGE_API_KEY });

const fileFromPath = async (filePath) => {
  const content = await fs.promises.readFile(filePath);
  const type = mime.getType(filePath);
  return new File([content], path.basename(filePath), { type });
};

const NFTStorageService = async (fileLocation) => {
  const image = await fileFromPath(fileLocation);
  const name = "Blockchain NFT";
  const description = "PEXELS DANIEL DAN IMAGE!";

  const metadata = await client.store({
    name,
    description,
    image,
  });

  console.log("NFT Storage service Metadata ipnft: " + metadata.ipnft);
  return metadata.ipnft;
};

module.exports = {
  NFTStorageService: NFTStorageService,
};
