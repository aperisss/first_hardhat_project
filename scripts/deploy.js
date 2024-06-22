const { ethers, run, network } = require("hardhat")

async function main() {
    const SimpleStorageFactory =
        await ethers.getContractFactory("SimpleStorage")
    console.log("deploying contract...")
    const SimpleStorage = await SimpleStorageFactory.deploy()
    await SimpleStorage.getDeployedCode()
    console.log("Deployed contract to " + SimpleStorage.target)
    if (network.config.chainId == 11155111 && process.env.ETHERSCAN_API_KEY) {
        await SimpleStorage.deploymentTransaction().wait(6)
        await verify(SimpleStorage.target, [])
    }

    const currentValue = await SimpleStorage.retrieve()
    console.log("Current value is:" + currentValue)

    const transactionResponse = await SimpleStorage.store(7)
    await transactionResponse.wait(1)
    const updatedValue = await SimpleStorage.retrieve()
    console.log("Updated value is:" + updatedValue)


}

async function verify(contractAddress, args) {
    console.log("Verifying contract...")
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        })
    } catch (e) {
        if (e.message.toLowerCase().includes("already verified")) {
            console.log("Aleready Verified!")
        } else 
            console.log(e)
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
