const assert = require("chai").assert
const { it } = require("mocha")
const { sliceThroughFirstColon, cleanData, scrapeMetaTrade} = require("../utilities")

// Test sliceThroughFirstColon 
describe("Testing sliceThroughFirstColon", () => {
    const original = 'Extra: previous Data Cleared'
    const expected = "previousDataCleared"
    it("should return 'previousDataCleared' given 'Extra: previous Data Cleared'", done => {
        assert.strictEqual(sliceThroughFirstColon(original), expected)
        done()
    })

    const testData2 = 'No colon here'

    it(`should return '' given '${testData2}' `, done => {
        assert.strictEqual(sliceThroughFirstColon(testData2), '')
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

// Testing out 
describe("Testing scrapeMetaTrade", () => {
    it("Should return an interface like { marketTime: '23:56:59', balance: '5 050.73', equity: '5 053.56  ' } or null", function (done) {
        scrapeMetaTrade().then(data => {
            if(data){
                assert.isTrue(data.hasOwnProperty('balance'))
            } else{
                assert.isNull(data)
            }
        }).then(done)
         
    
    
    }, "response should either be an object having key balance or return null").timeout(60000)
})