# Ethereum Dapp for Tracking Items through Supply Chain
# Summary: 
The purpose of this project is to learn lower level components of establishing a sound web service architecture using Blockchain. In this project, I created a dApp coffee supply chain solution on Ethereum using smart contracts with role-based permissions to track and verify a product's authenticity. 

# Running the dApp
Screenshots etc

# UML Diagrams
The image is saved in the folder screenshot

# Libraries Write-up


- Program version numbers : 1.0.0
- Node version number : v12.13.0
- Truffle version number : v4.1.14
- npm version : 6.12.0
- web3 version number : 1.3.0

### Dependencies
For this project, you will need to have:
1. **Node and NPM** installed - NPM is distributed with [Node.js](https://www.npmjs.com/get-npm)
```bash
# Check Node version
node -v
# Check NPM version
npm -v
```


2. **Truffle v4.X.X** - A development framework for Ethereum. 
```bash
# Unsinstall any previous version
npm uninstall -g truffle
# Install
npm install -g truffle
# Verify the version
truffle version
```


2. **Metamask: 5.3.1** - If you need to update Metamask just delete your Metamask extension and install it again.


3. [Ganache](https://www.trufflesuite.com/ganache) - Make sure that your Ganache and Truffle configuration file have the same port.


### Run the application
1. Clean the frontend 
```bash
# Remove the node_modules  
# remove packages
rm -rf node_modules
# clean cache
npm cache clean
rm package-lock.json
# install all modules listed as dependencies in package.json
npm install
```


2. Start Truffle by running
```bash
# For starting the development console
truffle develop
# truffle console

# For compiling the contract, inside the development console, run:
compile

# For migrating the contract to the locally running Ethereum network, inside the development console
migrate --reset

# For running unit tests the contract, inside the development console, run:
test
```

3. Frontend - Once you are ready to start your frontend, run the following from the app folder:
```bash
npm run dev
```

---

### Important
When you will add a new Rinkeyby Test Network in your Metamask client, you will have to provide:

| Network Name | New RPC URL | Chain ID |
|---|---|---|
|Private Network 1|`http://127.0.0.1:9545/`|1337 |

