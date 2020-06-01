

var Fabric_Client = require('fabric-client');
var path = require('path');
var fs = require('fs')
var fabric_client = new Fabric_Client();
var channel = fabric_client.newChannel('allchannel');

// setup the fabric network
var realPemKey = fs.readFileSync(path.join(__dirname, '../../../crypto-config/peerOrganizations/h3c.paypro.com/peers/peer0.h3c.paypro.com/msp/tlscacerts/tlsca.h3c.paypro.com-cert.pem'))

var peer = fabric_client.newPeer('grpcs://localhost:7051', { 'ssl-target-name-override': 'peer0.h3c.paypro.com', pem: Buffer.from(realPemKey).toString() });

channel.addPeer(peer);
var store_path = path.join(__dirname, '../../hfc-key-store');
var { logger } = require('../../common/winston')

exports.selectAllUser = async (symbol) => {

    var allUser;

    try {

        // create the key value store as defined in the fabric-client/config/default.json 'key-value-store' setting
        await Fabric_Client.newDefaultKeyValueStore({
            path: store_path
        }).then((state_store) => {
            // assign the store to the fabric client
            fabric_client.setStateStore(state_store);
            var crypto_suite = Fabric_Client.newCryptoSuite();
            // use the same location for the state store (where the users' certificate are kept)
            // and the crypto store (where the users' keys are kept)
            var crypto_store = Fabric_Client.newCryptoKeyStore({ path: store_path });
            crypto_suite.setCryptoKeyStore(crypto_store);
            fabric_client.setCryptoSuite(crypto_suite);

            // get the enrolled user from persistence, this user will sign all requests
            return fabric_client.getUserContext('admin', true);
        }).then((user_from_store) => {
            if (user_from_store && user_from_store.isEnrolled()) {
                logger.info('Successfully loaded admin from persistence');
                //member_user = user_from_store;
            } else {
                throw new Error('Failed to get admin.... run registerUser.js');
            }
            const request = {
                chaincodeId: symbol.toString(),
                fcn: 'queryAllUser',
                args: []
            };
            return channel.queryByChaincode(request);
        }).then((query_responses) => {
            logger.info("Query has completed, checking results");
            logger.info(query_responses);
            if (query_responses && query_responses.length == 1) {
                if (query_responses[0] instanceof Error) {
                    logger.error("error from query = ", query_responses[0]);
                } else {
                    logger.info("Response is ", query_responses[0].toString());
                }
            } else {
                logger.info("No payloads were returned from query");
            }
            allUser = { response: query_responses[0].toString() }
        }).catch(function (err) {
            throw ({ error: err.toString() })
        })

        if (allUser)
            return allUser;
        else
            throw ({ result: 3, message: "no userData" })


    }
    catch (err) {
        logger.error(JSON.stringify(err))
        return err
    }

}