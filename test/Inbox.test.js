const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const { abi, evm } = require('../compile');

const web3 = new Web3(ganache.provider());
let accounts;
let inbox;
beforeEach( async () => {
    // Get a list of all accounts
    accounts = await web3.eth.getAccounts()

    // Use one account to deploy the contract
    const contract = await new web3.eth.Contract(abi);
    inbox = await contract.deploy({ 
            data: evm.bytecode.object,
            arguments: ['Hi there!'] 
        })
        .send({ from: accounts[0], gas: '1000000' });

});

describe('Inbox', () => {
    it('deploys a contract', () => {
        console.log(inbox);
    });
});

