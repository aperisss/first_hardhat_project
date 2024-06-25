module.exports = async ({getNameAccounts, deployments}) => {
    const {deploy, log } = deployments
    const { deployer } = await getNameAccounts()
    const chainId = network.config.chainId

    

    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: [],
        log: true,
    })
}