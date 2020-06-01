'use strict';

var Fabric_Client = require('fabric-client');
var path = require('path');
var util = require('util');
var os = require('os');
var fs = require('fs')
var fabric_client = new Fabric_Client();
var channel = fabric_client.newChannel('allchannel');

var realPemKey = fs.readFileSync(path.join(__dirname,'../../../../crypto-config/peerOrganizations/h3c.paypro.com/peers/peer0.h3c.paypro.com/msp/tlscacerts/tlsca.h3c.paypro.com-cert.pem'))

var peer = fabric_client.newPeer('grpcs://localhost:7051',{'ssl-target-name-override': 'peer0.h3c.paypro.com',pem:Buffer.from(realPemKey).toString() });

channel.addPeer(peer);

var realPemorderKey = fs.readFileSync(path.join(__dirname,'../../../../crypto-config/ordererOrganizations/paypro.com/msp/tlscacerts/tlsca.paypro.com-cert.pem'))

var order = fabric_client.newOrderer('grpcs://localhost:7050',{'ssl-target-name-override': 'orderer0.paypro.com',pem:Buffer.from(realPemorderKey).toString() })
channel.addOrderer(order);
var store_path = path.join(__dirname, '../../../hfc-key-store');
var tx_id = null;

exports.insertUserTx = async (req, res) => {
	Fabric_Client.newDefaultKeyValueStore({ path: store_path
	}).then((state_store) => {
		fabric_client.setStateStore(state_store);
		var crypto_suite = Fabric_Client.newCryptoSuite();

		var crypto_store = Fabric_Client.newCryptoKeyStore({path: store_path});
		crypto_suite.setCryptoKeyStore(crypto_store);
		fabric_client.setCryptoSuite(crypto_suite);
		return fabric_client.getUserContext('admin', true);
	}).then((user_from_store) => {
		if (user_from_store && user_from_store.isEnrolled()) {
			console.log('Successfully loaded admin from persistence');
			//member_user = user_from_store;
		} else {
			throw new Error('Failed to get admin.... run registerUser.js');
		}
		tx_id = fabric_client.newTransactionID();
		console.log("Assigning transaction_id: ", tx_id._transaction_id);
		var merchant = (req.body.merchant).toString();
		var symbol = (req.body.symbol).toString();
		var quantity = (req.body.quantity).toString();
		var date = (req.body.date).toString();
		var request = {
			chaincodeId: (req.body.symbol).toString(),
			fcn: 'insertUserTx',
			args: [(req.body.id).toString(),(req.body.user_id).toString(),(tx_id._transaction_id).toString(),merchant,symbol,quantity,date],
			chainId: 'allchannel',
			txId: tx_id
		};

		return channel.sendTransactionProposal(request);
	}).then((results) => {
		
		var proposalResponses = results[0];
		var proposal = results[1];
		let isProposalGood = false;
		if (proposalResponses && proposalResponses[0].response &&
			proposalResponses[0].response.status === 200) {
				isProposalGood = true;
				console.log('Transaction proposal was good');
			} else {
				console.error('Transaction proposal was bad');
				console.log(proposalResponses)
			}
		if (isProposalGood) {
			console.log(util.format(
				'Successfully sent Proposal and received ProposalResponse: Status - %s, message - "%s"',
				proposalResponses[0].response.status, proposalResponses[0].response.message));
			var request = {
				proposalResponses: proposalResponses,
				proposal: proposal
			};
			var transaction_id_string = tx_id.getTransactionID();
			var promises = [];
			var sendPromise = channel.sendTransaction(request);
			promises.push(sendPromise); 
			let event_hub = channel.newChannelEventHub(peer);
			let txPromise = new Promise((resolve, reject) => {
				let handle = setTimeout(() => {
					event_hub.unregisterTxEvent(transaction_id_string);
					event_hub.disconnect();
					resolve({event_status : 'TIMEOUT'});
				}, 3000);
				event_hub.registerTxEvent(transaction_id_string, (tx, code) => {
					clearTimeout(handle);
					var return_status = {event_status : code, tx_id : transaction_id_string};
					if (code !== 'VALID') {
						console.error('The transaction was invalid, code = ' + code);
						resolve(return_status); 
					} else {
						console.log('The transaction has been committed on peer ' + event_hub.getPeerAddr());
						resolve(return_status);
					}
				}, (err) => {
					reject(new Error('There was a problem with the eventhub ::'+err));
				},
					{disconnect: true}
				);
				event_hub.connect();

			});
			promises.push(txPromise);

			return Promise.all(promises);
		} else {
			console.error('Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...');
			throw new Error('Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...');
		}
	}).then((results) => {
		
		console.log('Send transaction promise and event listener promise have completed');
		console.log("#####################################")
		console.log(results)
		console.log("#####################################")


		if (results && results[0] && results[0].status === 'SUCCESS') {
			console.log('Successfully sent transaction to the orderer.');
		} else {
			console.error('Failed to order the transaction. Error code: ' + results[0].status);
		}

		if(results && results[1] && results[1].event_status === 'VALID') {
			console.log('Successfully committed the change to the ledger by the peer');
			res.json({result:1,message:"successed"})
		} else {
			console.log('Transaction failed to be committed to the ledger due to ::'+results[1].event_status);
		}
	}).catch((err) => {
		//console.error('Failed to invoke successfully :: ' + err);
		res.json({result:2,message:"failed"})
	});
}