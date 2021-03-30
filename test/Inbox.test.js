const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const { abi, evm } = require('../compile');

const INITIAL_STRING = 'Hi there!';
const CHANGED_STRING = 'bye';
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
            arguments: [INITIAL_STRING] 
        })
        .send({ from: accounts[0], gas: '1000000' });

});

describe('Inbox', () => {
    it('deploys a contract', () => {
        assert.ok(inbox.options.address);
    });

    it('has default message', async () => {
        const message = await inbox.methods.message().call();
        assert.strictEqual(message, INITIAL_STRING);
    });

    it('can change the message', async () => {
        await inbox.methods.setMessage(CHANGED_STRING).send({ from: accounts[0] });
        const message = await inbox.methods.message().call();
        assert.strictEqual(message, CHANGED_STRING);
    });
});

