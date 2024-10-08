// This script is designed to test the solidity smart contract - SuppyChain.sol -- and the various functions within
// Declare a variable and assign the compiled smart contract artifact
var SupplyChain = artifacts.require('SupplyChain')

contract('SupplyChain', function(accounts) {
    // Declare few constants and assign a few sample accounts generated by ganache-cli
    var sku = 1
    var upc = 1
    const ownerID = accounts[0]
    const originFarmerID = accounts[1]
    const originFarmName = "John Doe"
    const originFarmInformation = "Yarray Valley"
    const originFarmLatitude = "-38.239770"
    const originFarmLongitude = "144.341490"
    var productID = sku + upc
    const productNotes = "Best beans for Espresso"
    const productPrice = web3.toWei(1, "ether")
    var itemState = 0
    const distributorID = accounts[2]
    const retailerID = accounts[3]
    const consumerID = accounts[4]
    const emptyAddress = '0x00000000000000000000000000000000000000'

    ///Available Accounts
    ///==================
    // (0) 0x627306090abab3a6e1400e9345bc60c78a8bef57
    // (1) 0xf17f52151ebef6c7334fad080c5704d77216b732
    // (2) 0xc5fdf4076b8f3a5357c5e395ab970b5b54098fef
    // (3) 0x821aea9a577a9b44299b9c15c88cf3087f3b5544
    // (4) 0x0d1d4e623d10f9fba5db95830f7d3839406c6af2
    // (5) 0x2932b7a2355d6fecc4b5c0b6bd44cc31df247a2e
    // (6) 0x2191ef87e392377ec08e7c08eb105ef5448eced5
    // (7) 0x0f4f2ac550a1b4e2280d04c21cea7ebd822934b5
    // (8) 0x6330a553fc93768f612722bb8c2ec78ac90b3bbc
    // (9) 0x5aeda56215b167893e80b4fe645ba6d5bab767de

    console.log("ganache-cli accounts used here...")
    console.log("Contract Owner: accounts[0] ", accounts[0])
    console.log("Farmer: accounts[1] ", accounts[1])
    console.log("Distributor: accounts[2] ", accounts[2])
    console.log("Retailer: accounts[3] ", accounts[3])
    console.log("Consumer: accounts[4] ", accounts[4])

    // Initial testing
    it("Test that roles are correctly added to contract", async () =>{
        const supplyChain = await SupplyChain.deployed()

        var contractOwner = await supplyChain.owner();
        assert.equal(contractOwner, ownerID);

        var farmerAdded = await supplyChain.addFarmer(originFarmerID);
        assert.equal(farmerAdded.logs[0].event, "FarmerAdded")

        var distributorAdded = await supplyChain.addDistributor(distributorID);
        assert.equal(distributorAdded.logs[0].event, "DistributorAdded")

        var retailerAdded = await supplyChain.addRetailer(retailerID);
        assert.equal(retailerAdded.logs[0].event, "RetailerAdded")

        var consumerAdded = await supplyChain.addConsumer(consumerID);    
        assert.equal(consumerAdded.logs[0].event, "ConsumerAdded")
    })

    // 1st Test
    it("Testing smart contract function harvestItem() that allows a farmer to harvest coffee", async() => {
        const supplyChain = await SupplyChain.deployed()
        
        // // Declare and Initialize a variable for event
        // var eventEmitted = false
        
        // // Watch the emitted event Harvested()
        // var event = supplyChain.Harvested()
        // await event.watch((err, res) => {
        //     eventEmitted = true
        // })

        // Mark an item as Harvested by calling function harvestItem()
        var event = await supplyChain.harvestItem(upc, originFarmerID, originFarmName, originFarmInformation, originFarmLatitude, originFarmLongitude, productNotes)

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc)
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(resultBufferOne[0].toNumber(), sku, 'Error: Invalid item SKU')
        assert.equal(resultBufferOne[1].toNumber(), upc, 'Error: Invalid item UPC')
        assert.equal(resultBufferOne[2], originFarmerID, 'Error: Missing or Invalid ownerID')
        assert.equal(resultBufferOne[3], originFarmerID, 'Error: Missing or Invalid originFarmerID')
        assert.equal(resultBufferOne[4], originFarmName, 'Error: Missing or Invalid originFarmName')
        assert.equal(resultBufferOne[5], originFarmInformation, 'Error: Missing or Invalid originFarmInformation')
        assert.equal(resultBufferOne[6], originFarmLatitude, 'Error: Missing or Invalid originFarmLatitude')
        assert.equal(resultBufferOne[7], originFarmLongitude, 'Error: Missing or Invalid originFarmLongitude')
        assert.equal(resultBufferTwo[5], 0, 'Error: Invalid item State')
        assert.equal(event.logs[0].event, "Harvested")        
    })    

    // 2nd Test
    it("Testing smart contract function processItem() that allows a farmer to process coffee", async() => {
        const supplyChain = await SupplyChain.deployed()
        
        // Declare and Initialize a variable for event
        var eventEmitted = false
        
        // Watch the emitted event Processed()
        var event = supplyChain.Processed()
        await event.watch((err, res) => {
            eventEmitted = true
        })

        // Mark an item as Processed by calling function processtItem()
        await supplyChain.processItem(upc, {from: originFarmerID})

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(resultBufferTwo[5], 1, 'Error: Invalid item State')
    })    

    // 3rd Test
    it("Testing smart contract function packItem() that allows a farmer to pack coffee", async() => {
        const supplyChain = await SupplyChain.deployed()
        
        // Declare and Initialize a variable for event
        var eventEmitted = false;
        
        // Watch the emitted event Packed()
        var event = supplyChain.Packed()
        await event.watch((err, res)=>{
            eventEmitted = true
        })

        // Mark an item as Packed by calling function packItem()
        await supplyChain.packItem(upc, {fron: originFarmerID});

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)       

        // Verify the result set
        assert.equal(resultBufferTwo[5], 2, 'Error: Invalid item State')
    })    

    // 4th Test
    it("Testing smart contract function sellItem() that allows a farmer to sell coffee", async() => {
        const supplyChain = await SupplyChain.deployed()
        
        // Declare and Initialize a variable for event
        var eventEmitted = false
        
        // Watch the emitted event ForSale()
        var event = supplyChain.ForSale()
        await event.watch((err, res)=>{
            eventEmitted = true
        })

        // Mark an item as ForSale by calling function sellItem()
        await supplyChain.sellItem(upc, productPrice, {from: originFarmerID})

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(resultBufferTwo[4], productPrice, 'Error: Invalid product price')
        assert.equal(resultBufferTwo[5], 3, 'Error: Invalid item State')
    })    

    // 5th Test
    it("Testing smart contract function buyItem() that allows a distributor to buy coffee", async() => {
        const supplyChain = await SupplyChain.deployed()
        
        // Declare and Initialize a variable for event
        var eventEmitted = false
        
        // Watch the emitted event Sold()
        var event = supplyChain.Sold()
        await event.watch((err, res)=>{
            eventEmitted = true
        })

        // Mark an item as Sold by calling function buyItem()
        await supplyChain.buyItem(upc, {from: distributorID, value: productPrice})

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(resultBufferTwo[5], 4, 'Error: Invalid item State')
        assert.equal(resultBufferTwo[6], distributorID, 'Error: Invalid distributor ID')
    })    

    // 6th Test
    it("Testing smart contract function shipItem() that allows a distributor to ship coffee", async() => {
        const supplyChain = await SupplyChain.deployed()
        
        // Declare and Initialize a variable for event
        var eventEmitted = false
        
        // Watch the emitted event Shipped()
        var event = supplyChain.Shipped()
        await event.watch((err, res)=>{
            eventEmitted = true
        })

        // Mark an item as Sold by calling function shipItem()
        await supplyChain.shipItem(upc, {from: distributorID})

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)        

        // Verify the result set
        assert.equal(resultBufferTwo[5], 5, 'Error: Invalid item State')      
    })    

    // 7th Test
    it("Testing smart contract function receiveItem() that allows a retailer to mark coffee received", async() => {
        const supplyChain = await SupplyChain.deployed()
        
        // Declare and Initialize a variable for event
        var eventEmitted = false
        
        // Watch the emitted event Received()
        var event = supplyChain.Received()
        await event.watch((err, res)=>{
            eventEmitted = true
        })

        // Mark an item as Sold by calling function receiveItem()
        await supplyChain.receiveItem(upc, {from: retailerID})

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(resultBufferTwo[5], 6, 'Error: Invalid item State')
    })    

    // 8th Test
    it("Testing smart contract function purchaseItem() that allows a consumer to purchase coffee", async() => {
        const supplyChain = await SupplyChain.deployed()
        
        // Declare and Initialize a variable for event
        var eventEmitted = false
        
        // Watch the emitted event Purchased()
        var event = supplyChain.Purchased()
        await event.watch((err, res)=>{
            eventEmitted = true
        })

        // Mark an item as Sold by calling function purchaseItem()
        await supplyChain.purchaseItem(upc, {from: consumerID})

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(resultBufferTwo[5], 7, 'Error: Invalid item State')
    })    

    // 9th Test
    it("Testing smart contract function fetchItemBufferOne() that allows anyone to fetch item details from blockchain", async() => {
        const supplyChain = await SupplyChain.deployed()

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc, {from: accounts[8]})
        
        // Verify the result set:
        assert.equal(resultBufferOne[0], sku, 'Error: Invalid item SKU')
        assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC')
        assert.equal(resultBufferOne[2], consumerID, 'Error: Missing or Invalid ownerID')
        assert.equal(resultBufferOne[3], originFarmerID, 'Error: Missing or Invalid originFarmerID')
        assert.equal(resultBufferOne[4], originFarmName, 'Error: Missing or Invalid originFarmName')
        assert.equal(resultBufferOne[5], originFarmInformation, 'Error: Missing or Invalid originFarmInformation')
        assert.equal(resultBufferOne[6], originFarmLatitude, 'Error: Missing or Invalid originFarmLatitude')
        assert.equal(resultBufferOne[7], originFarmLongitude, 'Error: Missing or Invalid originFarmLongitude')
    })

    // 10th Test
    it("Testing smart contract function fetchItemBufferTwo() that allows anyone to fetch item details from blockchain", async() => {
        const supplyChain = await SupplyChain.deployed()

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc, {from: accounts[7]})
        
        // Verify the result set:
        assert.equal(resultBufferTwo[0], sku, 'Error: Invalid item SKU')
        assert.equal(resultBufferTwo[1], upc, 'Error: Invalid item UPC')
        assert.equal(resultBufferTwo[2], productID, 'Error: Missing or Invalid productID')
        assert.equal(resultBufferTwo[3], productNotes, 'Error: Missing or Invalid originFarmerID')
        assert.equal(resultBufferTwo[4], productPrice, 'Error: Missing or Invalid originFarmName')
        assert.equal(resultBufferTwo[5], 7, 'Error: Missing or Invalid originFarmInformation') 
        assert.equal(resultBufferTwo[6], distributorID, 'Error: Missing or Invalid originFarmLatitude')
        assert.equal(resultBufferTwo[7], retailerID, 'Error: Missing or Invalid originFarmLongitude')
        assert.equal(resultBufferTwo[8], consumerID, 'Error: Invalid item State')
    })

});

