const {BN, Long, bytes, units} = require('@zilliqa-js/util');
const {Zilliqa} = require('@zilliqa-js/zilliqa');
const {
    toBech32Address,
    getAddressFromPrivateKey,
} = require('@zilliqa-js/crypto');



const nfs = require('nft.storage')
const fs = require('fs');

class Minter {
    
    constructor() {
    }

    upload(apiKey, name, description, fileName) {	
	const client = new nfs.NFTStorage({ token: apiKey })
	const data = fs.readFileSync(fileName)
	console.log("store")
	console.log(data.length)
	return client.store({
	    name: name,
	    description: description,
	    image: new nfs.File([data], 'zilliqa-heartbeat-nft.jpg', { type: 'image/jpg' })
	})
    }


    async mint(privkey, contract, url) {
	const zilliqa = new Zilliqa('https://dev-api.zilliqa.com');
	const CHAIN_ID = 333;
	const MSG_VERSION = 1;
	const VERSION = bytes.pack(CHAIN_ID, MSG_VERSION);

	zilliqa.wallet.addByPrivateKey(privkey);

	const address = getAddressFromPrivateKey(privkey);
	console.log("Your account address is:");
	console.log(`${address}`);
	const myGasPrice = units.toQa('2000', units.Units.Li); // Gas Price that will be used by all transactions

	const nftAddr = toBech32Address(contract);
	try {
            const contract = zilliqa.contracts.at(nftAddr);
            const callTx = await contract.call(
		'Mint',
		[
                    {
			vname: 'to',
			type: 'ByStr20',
			value: `${address}`,
                    },
                    {
			vname: 'token_uri',
			type: 'String',
			value: url,
                    }
		],
		{
                    // amount, gasPrice and gasLimit must be explicitly provided
                    version: VERSION,
                    amount: new BN(0),
                    gasPrice: myGasPrice,
                    gasLimit: Long.fromNumber(10000),
		}
            );
	    
            // process confirm
            console.log(`The transaction status is:`);
            console.log(callTx);
	    return callTx.receipt

	} catch (err) {
            console.log(err);
	}
    }
}


module.exports = Minter


/*
console.log("Minter test")
var m = new Minter()

var img = m.upload(
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDM2NEIyM0YzYUYzZTcwMzdjMTUyNzcxREM2ZmNDM0YxNTlmMTI4QjMiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTYyMjkyNzY4NjM1MSwibmFtZSI6ImhlYXJ0YmVhdCJ9.BDGhZZ88k0_X9fDj0U9_cOaBL15SB-qzHY5SnJUZ1Oo',
    "Jane Doe",
    "Jane Doe heartbeat 2021-03-26 16:23:10",
    "result.jpg")
    
console.log(img)
*/

