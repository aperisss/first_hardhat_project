// test passing 0ms = erreur syntaxique dans le code
// test pendig = erreur aacolade dans les it
// utiliser ethers.parseEther("") plutot que ethers.utils.parseEther("")
// message derreur dans les expect qui appelent des fonctions de smart contract doivent etre EXACTEMENT les meme
// utiliser fundMeContract = await deployments.get("FundMe");
//fundMe = await ethers.getContractAt("FundMe", fundMeContract.address)
// plutot que fundMe = await ethers.getContractAt("FundMe", deployer)
// ---> mauvaise adresse du contrat qui inclu une incapacite a utiliser les fonctions du contrat

// comprendre le dernier cas derreur et pq dans dernier it fundMe.addressToAmountFunded(deployer)
// marche correctemet alors quon a pas deployer le contrat avec le deployer

const { deployments, ethers, getNamedAccounts } = require("hardhat")
const { assert, expect } = require("chai")

describe("FundMe", async function () {
    let fundMe
    let deployer
    let MockV3Aggregator
    let sendValue = ethers.parseEther("1")
    beforeEach(async function () {
        deployer = (await getNamedAccounts()).deployer
        await deployments.fixture(["all"])
        const fundMeContract = await deployments.get("FundMe")
        fundMe = await ethers.getContractAt("FundMe", fundMeContract.address)
        const MockV3AggregatorContract =
            await deployments.get("MockV3Aggregator")
        MockV3Aggregator = await ethers.getContractAt(
            "MockV3Aggregator",
            MockV3AggregatorContract.address,
        )
        const response = await fundMe.s_priceFeed()
        console.log("fundmeContract = " + fundMeContract.address)
        console.log("fundme = " + fundMe.target)
        console.log("mock = " + MockV3Aggregator.target)
        console.log("pricefeed = " + response)
        console.log("mockContract = " + MockV3AggregatorContract.address)
    })
    describe("constructor", async function () {
        it("sets the aggregator addresses correctly", async function () {
            const response = await fundMe.s_priceFeed()
            assert.equal(response, MockV3Aggregator.target)
        })
    })
    describe("fund", async function () {
        it("Fails if you don't send enough ETH", async function () {
            await expect(fundMe.fund()).to.be.revertedWith(
                "You need to spend more ETH!",
            )
        })

        it("updated the amount funded data structures", async function () {
            await fundMe.fund({ value: sendValue })
            const response = await fundMe.s_addressToAmountFunded(deployer)
            assert.equal(response.toString(), sendValue.toString())
        })
        it ("Adds funder to array of funders", async function () {
            await fundMe.fund({value: sendValue})
            const funder = await fundMe.s_funders(0)
            assert.equal(funder, deployer)
        })
    })
    describe("withdraw", async function() {
        beforeEach(async function () {
            await fundMe.fund({value: sendValue})
        })
        it("Withdraw ETH from a single founder", async function () {
            const startingFundMeBalance = await ethers.provider.getBalance(fundMe.target)
            const startingDeployerBalance = await ethers.provider.getBalance(deployer)
            //test ethers.provider ou fundme.provider pour getbalance
            const transactionResponse = await fundMe.withdraw()
            const transactionReceipt = await transactionResponse.wait(1)

            const { gasUsed, gasPrice } = transactionReceipt
            const gasCost = gasUsed * gasPrice
            

            const endingFundMeBalance = await ethers.provider.getBalance(fundMe.target)
            const endingDeployerBalance = await ethers.provider.getBalance(deployer)


            assert.equal(endingFundMeBalance, 0)
            assert.equal((startingFundMeBalance + startingDeployerBalance).toString(),
             (endingDeployerBalance + gasCost).toString())
        })
        it ("allow us to withdraw with multiple funders", async function(){
            const accounts = await ethers.getSigners()
            for (let i = 1; i < 6; i++) {
                const fundMeConnectedContract = await fundMe.connect(accounts[i])
                await fundMeConnectedContract.fund({value: sendValue})
            }
            const startingFundMeBalance = await ethers.provider.getBalance(fundMe.target)
            const startingDeployerBalance = await ethers.provider.getBalance(deployer)

            const transactionResponse = await fundMe.withdraw()
            const transactionReceipt = await transactionResponse.wait(1)
            const { gasUsed, gasPrice } = transactionReceipt
            const gasCost = gasUsed * gasPrice
            
            const endingFundMeBalance = await ethers.provider.getBalance(fundMe.target)
            const endingDeployerBalance = await ethers.provider.getBalance(deployer)


            assert.equal(endingFundMeBalance, 0)
            assert.equal((startingFundMeBalance + startingDeployerBalance).toString(),
             (endingDeployerBalance + gasCost).toString())

             await expect(fundMe.s_funders(0)).to.be.reverted

             for (let i = 1; i < 6; i++) {
                assert.equal(await fundMe.s_addressToAmountFunded(accounts[i].address), 0)
             }

        })
        it("Only allows the owner to withdraw", async function () {
            const accounts = await ethers.getSigners()
            const attacker = accounts[1]
            const attackerConnectContract = await fundMe.connect(attacker)
            await expect(attackerConnectContract.withdraw()).to.be.revertedWithCustomError(fundMe, "FundMe__NotOwner")
        })
    })
})
