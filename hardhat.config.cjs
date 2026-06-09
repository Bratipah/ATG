require("@nomicfoundation/hardhat-ethers");
require("@nomicfoundation/hardhat-verify");
require("dotenv").config({ path: ".env.local" });

const PRIVATE_KEY = process.env.NEXT_PRIVATE_KEY || process.env.PRIVATE_KEY || "0000000000000000000000000000000000000000000000000000000000000000";
// const SNOWTRACE_API_KEY = process.env.SNOWTRACE_API_KEY || "A1GDQ3AMDYKAK1WWE5AHQ32WYQNYSS41NH";

console.log("Private key length:", PRIVATE_KEY.length);

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  paths: {
    sources: "./contracts",
    tests: "./test/contracts",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  networks: {
    // fuji: {
    //   url: "https://api.avax-test.network/ext/bc/C/rpc",
    //   chainId: 43113,
    //   accounts: [PRIVATE_KEY.startsWith("0x") ? PRIVATE_KEY : `0x${PRIVATE_KEY}`]
    // },
    somnia: {
      url: "https://api.infra.testnet.somnia.network/ext/bc/C/rpc", 
      chainId: 50312,
      accounts: [PRIVATE_KEY.startsWith("0x") ? PRIVATE_KEY : `0x${PRIVATE_KEY}`]
    }
  },
  etherscan: {
    apiKey: {
      // somnia: SNOWTRACE_API_KEY || "snowtrace",
      somnia: "XWBKK21GNH6IAGCKIDECF5EVRNMUHG2MKH"
    },

    customChains: [
      {
        network: "somnia",
        chainId: 50312,
        urls: {
          apiURL: "https://api.somnia.exploreme.pro/api",
          browserURL: "https://somnia.exploreme.pro/"
        }
      }
    ]
  },
  
  sourcify: {
    enabled: false,
  }
};
