

var Fabric_Client = require('fabric-client');
var path = require('path');
var fs = require('fs')
var fabric_client = new Fabric_Client();
var channel = fabric_client.newChannel('allchannel');

// setup the fabric network
var realPemKey = fs.readFileSync(path.join(__dirname,'../../../../crypto-config/peerOrganizations/h3c.paypro.com/peers/peer0.h3c.paypro.com/msp/tlscacerts/tlsca.h3c.paypro.com-cert.pem'))

var peer = fabric_client.newPeer('grpcs://localhost:7051',{'ssl-target-name-override': 'peer0.h3c.paypro.com',pem:Buffer.from(realPemKey).toString() });

channel.addPeer(peer);
var store_path = path.join(__dirname, '../../../hfc-key-store');

exports.selectAllUser = (req,res) =>{
    // create the key value store as defined in the fabric-client/config/default.json 'key-value-store' setting
    Fabric_Client.newDefaultKeyValueStore({ path: store_path
    }).then((state_store) => {
        // assign the store to the fabric client
        fabric_client.setStateStore(state_store);
        var crypto_suite = Fabric_Client.newCryptoSuite();
        // use the same location for the state store (where the users' certificate are kept)
        // and the crypto store (where the users' keys are kept)
        var crypto_store = Fabric_Client.newCryptoKeyStore({path: store_path});
        crypto_suite.setCryptoKeyStore(crypto_store);
        fabric_client.setCryptoSuite(crypto_suite);

        // get the enrolled user from persistence, this user will sign all requests
        return fabric_client.getUserContext('admin', true);
    }).then((user_from_store) => {
        if (user_from_store && user_from_store.isEnrolled()) {
            console.log('Successfully loaded admin from persistence');
            //member_user = user_from_store;
        } else {
            throw new Error('Failed to get admin.... run registerUser.js');
        }
        const request = {
            chaincodeId: (req.body.symbol).toString(),
            fcn: 'queryAllUser',
            args: []
        };
        return channel.queryByChaincode(request);
    }).then((query_responses) => {
        console.log("Query has completed, checking results");
        console.log(query_responses);
        if (query_responses && query_responses.length == 1) {
            if (query_responses[0] instanceof Error) {
                console.error("error from query = ", query_responses[0]);
            } else {
                console.log("Response is ", query_responses[0].toString());
            }
        } else {
            console.log("No payloads were returned from query");
        }
        res.status(200).json({response: query_responses[0].toString()});
    }).catch(function(err) {
        res.status(500).json({error: err.toString()})
      })
}