const hre = require("hardhat");

async function main() {
    console.log("Deploying VoteChain contract...");

    const VoteChain = await hre.ethers.getContractFactory("VoteChain");
    const voteChain = await VoteChain.deploy();

    await voteChain.waitForDeployment();
    const address = await voteChain.getAddress();

    console.log("VoteChain deployed to:", address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });