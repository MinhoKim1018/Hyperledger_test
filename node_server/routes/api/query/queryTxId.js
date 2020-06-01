

var Fabric_Client = require('fabric-client');
var path = require('path');
var fabric_client = new Fabric_Client();
var fs = require('fs');
// setup the fabric network
var channel = fabric_client.newChannel('allchannel');
var store_path = path.join(__dirname, '../../../hfc-key-store');

var data = fs.readFileSync(path.join(__dirname, '../../../../crypto-config/peerOrganizations/h3c.paypro.com/tlsca/tlsca.h3c.paypro.com-cert.pem'));
// var cryptoMiddleWare = require('../../../middleware/setCryptoStore')
var peer = fabric_client.newPeer('grpcs://localhost:7051', {
    'ssl-target-name-override': 'peer0.h3c.paypro.com',
    pem: Buffer.from(data).toString()
});
channel.addPeer(peer);


exports.queryTxId = (req,res) =>{
    // create the key value store as defined in the fabric-client/config/default.json 'key-value-store' setting
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
        } else {
            throw new Error('Failed to get admin.... run registerUser.js');
        }
        return channel.queryInfo();
    }).then((result) => {
        console.log("Query has completed, checking results");
        const height = result.height.low
        const currentBlockHash = result.currentBlockHash;
        const previousBlockHash = result.previousBlockHash;
        // res.status(200).json(result);
        res.status(200).json({
            status : "OK", 
            data : { 
                        height, 
                        currentBlockHash : currentBlockHash, 
                        previousBlockHash : previousBlockHash
                    }
        });
    }).catch(function(err) {
        res.status(500).json({
            error: err.toString()
        })
      })
}


exports.queryBlockByHash = (req,res) =>{
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
    }).then(async (user_from_store) => {
        if (user_from_store && user_from_store.isEnrolled()) {
            console.log('Successfully loaded admin from persistence');
            //member_user = user_from_store;
        } else {
            throw new Error('Failed to get admin.... run registerUser.js');
        }
        const request = {
            chaincodeId: 'test111',
            fcn: 'queryAllUser',
            args: []
        };

        const testQueryResult = await channel.queryInfo();
        const testBuffer = testQueryResult.currentBlockHash.buffer;
        const testUtf8 = testBuffer.toString('utf8')

        return channel.queryBlockByHash(testUtf8);
    }).then((query_responses) => {
        console.log("Query has completed, checking results");
        console.log(query_responses);
        // if (query_responses && query_responses.length == 1) {
        //     if (query_responses[0] instanceof Error) {
        //         console.error("error from query = ", query_responses);
        //     } else {
        //         console.log("Response is ", query_responses.toString());
        //     }
        // } else {
        //     console.log("No payloads were returned from query");
        // }
        res.status(200).json({response: query_responses});
    }).catch(function(err) {
        res.status(500).json({error: err.toString()})
      })
}

exports.queryBlock = (req,res) =>{
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
    }).then(async (user_from_store) => {
        if (user_from_store && user_from_store.isEnrolled()) {
            console.log('Successfully loaded admin from persistence');
            //member_user = user_from_store;
        } else {
            throw new Error('Failed to get admin.... run registerUser.js');
        }
        const request = {
            chaincodeId: 'h3c',
            fcn: 'queryAllUser',
            args: []
        };

        return channel.queryBlock(parseInt(req.body.num));
    }).then((result) => {
        console.log("Query has completed, checking results");
        let data =
        {
            block_num : result.header.number,
            previous_hash : result.header.previous_hash,
            data_hash : result.header.data_hash,
            tx_id : result.data.data[0].payload.header.channel_header.tx_id,
            timestamp : result.data.data[0].payload.header.channel_header.timestamp,
            channel_id : result.data.data[0].payload.header.channel_header.channel_id,
            transaction_type : result.data.data[0].payload.header.channel_header.typeString,
            creator : result.data.data[0].payload.header.signature_header.creator.Mspid,
            action : result.data.data[0].payload.data.actions[0].payload.action.proposal_response_payload.extension.results.ns_rwset[0].rwset.writes,
            response : result.data.data[0].payload.data.actions[0].payload.action.proposal_response_payload.extension.response.status
        }
        console.log(result)
        res.status(200).json(data);
    }).catch(function(err) {
        res.status(500).json({error: err.toString()})
      })
}

exports.queryTransaction = (req,res) =>{
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
    }).then(async (user_from_store) => {
        if (user_from_store && user_from_store.isEnrolled()) {
            console.log('Successfully loaded admin from persistence');
            //member_user = user_from_store;
        } else {
            throw new Error('Failed to get admin.... run registerUser.js');
        }
        const request = {
            chaincodeId: 'test111',
            fcn: 'queryAllUser',
            args: []
        };

        return channel.queryTransaction("2f42a7813e7dd3ae0b3956f5967bc40e2f4cb7a76ead1d14e243c8d3a033def8");
    }).then((result) => {
        console.log("Query has completed, checking results");
        // console.log(result);
        let data = {
            validationCode : result.validationCode,
            timestamp : result.transactionEnvelope.payload.header.channel_header.timestamp,
            channel_id : result.transactionEnvelope.payload.header.channel_header.channel_id,
            creator : result.transactionEnvelope.payload.header.signature_header.creator.Mspid,
            action : result.transactionEnvelope.payload.data.actions[0].payload.action.proposal_response_payload.extension.results.ns_rwset[1].rwset.writes,
            response_status : result.transactionEnvelope.payload.data.actions[0].payload.action.proposal_response_payload.extension.response.status

            
        }
        res.status(200).json(data);
    }).catch(function(err) {
        res.status(500).json({error: err.toString()})
      })
}



// exports.queryBlockByTransaction = async (req,res,next) =>{
//     // create the key value store as defined in the fabric-client/config/default.json 'key-value-store' setting
//     try {
//         const channel = await cryptoMiddleWare.setCryptoStore();
//         channel.queryBlockByTxID("2f42a7813e7dd3ae0b3956f5967bc40e2f4cb7a76ead1d14e243c8d3a033def8")
//         // channel.queryBlockByTxID(req.body.txId);
//         .then(
//             (result)=>{
//                 console.log("Query has completed, checking results");
//                 let data =
//                 {
//                     block_num : result.header.number,
//                     previous_hash : result.header.previous_hash,
//                     data_hash : result.header.data_hash,
//                     tx_id : result.data.data[0].payload.header.channel_header.tx_id,
//                     timestamp : result.data.data[0].payload.header.channel_header.timestamp,
//                     channel_id : result.data.data[0].payload.header.channel_header.channel_id,
//                     transaction_type : result.data.data[0].payload.header.channel_header.typeString,
//                     creator : result.data.data[0].payload.header.signature_header.creator.Mspid,
//                     action : result.data.data[0].payload.data.actions[0].payload.action.proposal_response_payload.extension.results.ns_rwset[1].rwset.writes,
//                     response : result.data.data[0].payload.data.actions[0].payload.action.proposal_response_payload.extension.response.status
//                 }
//                 res.status(200).json(data);
//             }
//         )
//         .catch(err=>new Error(err))
//     }
//     catch{(err) =>{
//         res.status(500).json({error: err.toString()})
//     }}
// }