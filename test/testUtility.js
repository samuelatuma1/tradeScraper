const assert = require("chai").assert
const { sliceThroughFirstColon, cleanData} = require("../utilities")

// Test sliceThroughFirstColon 
describe("Testing sliceThroughFirstColon", () => {
    const original = 'Extra: previous Data Cleared'
    const expected = "previousDataCleared"
    it("should return 'previousDataCleared' given 'Extra: previous Data Cleared'", done => {
        assert.strictEqual(sliceThroughFirstColon(original), expected)
        done()
    })
})

describe("Testing cleanData function ", () => {
    const testData = {
        marketWatchText: 'Market Watch: 23:56:59',
        equityBalanceText: 'Balance: 5 050.73 USD  Equity: 5 050.73  Free margin: 5 050.73'   
      }
    const expectedCleanedRes = { marketTime: '23:56:59', balance: '5050.73', equity: '5050.73' }
    it("should return { marketTime: '23:56:59', balance: '5050.73', equity: '5050.73' }", done => {
        assert.deepEqual(
            cleanData(testData), expectedCleanedRes, 
            `cleanData should return ${expectedCleanedRes} given ${testData}`)
        done()
    })
})