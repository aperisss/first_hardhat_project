// const { deployments, ethers, getNamedAccounts } = require("hardhat")
// const { assert, expect } = require("chai")


// describe("FundMe", async function() {
//     let fundMe
//     let deployer
//     let MockV3Aggregator
//     const sendValue = "1000000000000000000"
//     beforeEach(async function () {
//         deployer = (await getNamedAccounts()).deployer
//         await deployments.fixture(["all"])
//         fundMe = await ethers.getContractAt("FundMe", deployer )
//         MockV3Aggregator = await ethers.getContractAt("MockV3Aggregator", deployer)
//     })
//     describe("constructor", async function () {
//         it("sets the aggregator addresses correctly", async function (){
//             const response = await fundMe.target
//             assert.equal(response, MockV3Aggregator.target)
//             console.log("---" + response + MockV3Aggregator.target)
//         })
//     })
//     describe("fund", async function() {
//         it("Fails if you don't send enough ETH"), async function () {
//             await expect(fundMe.fund()).to.be.revertedWith("you need to spend more eth")
//     }
//     it ("updated the amount funded data structures", async function() {
//         console.log("--------------------")
//         await fundMe.fund({value: sendValue})
//         console.log("--------------------")
//         const response = await fundMe.addressToAmountFunded(deployer)
//         assert.equal(response.toString(), sendValue.toString())
//     })
// })
// })

const { deployments, ethers, getNamedAccounts } = require("hardhat")
const { assert, expect } = require("chai")

describe("FundMe", async function() {
    let fundMe
    let fundMe2
    let deployer
    let MockV3Aggregator
    let fundMeContract
    const sendValue = "1000000000000000000"
    beforeEach(async function () {
        deployer = (await getNamedAccounts()).deployer
        await deployments.fixture(["all"])
        fundMeContract = await deployments.get("FundMe");
    fundMe = await ethers.getContractAt("FundMe", fundMeContract.address);
    funMe2 = await ethers.getContractAt("FundMe", deployer )
    let response = await fundMe.priceFeed()
    console.log("1 = " + response)
     response = await fundMe2.priceFeed()
     console.log("1 = " + response)
        MockV3Aggregator = await ethers.getContractAt("MockV3Aggregator", deployer)
    })
    describe("constructor", async function () {
        it("sets the aggregator addresses correctly", async function (){
            const response = await fundMe.priceFeed()
            console.log("fundme = " + fundMe.target)
            console.log("pricefeed = " + response)
            console.log("mock = " + MockV3Aggregator.target)
            assert.equal(response, MockV3Aggregator.target)
        })
    })
    describe("fund", async function() {
        it("Fails if you don't send enough ETH"), async function () {
            await expect(fundMe.fund()).to.be.revertedWith("you need to spend more eth")
    }
    it ("updated the amount funded data structures", async function() {
        console.log("------hhhhhh--------------")
        await fundMe.fund({value: sendValue})
        const response = await fundMe.addressToAmountFunded(deployer)
        console.log("response" + response.toString())
        console.log("sendvalue" + sendValue.toString())
        assert.equal(response.toString(), sendValue.toString())
    })
})
})
