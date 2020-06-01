'use strict';

var Fabric_Client = require('fabric-client');
var Fabric_CA_Client = require('fabric-ca-client');
var path = require('path');
var util = require('util');
var os = require('os');
var fabric_client = new Fabric_Client();
var fabric_ca_client = null;
var admin_user = null;
var store_path = path.join(__dirname, '../../../hfc-key-store');

// 스토어를 만들고.. -> 크립토 집합을 설정하고 -> 그 집합을 스토어에 저장(crypto store) -> 그 스토어를 페브릭 클라이언트에 할당.


exports.admin= () => {
    Fabric_Client.newDefaultKeyValueStore({ path: store_path
    }).then((state_store) => {
        fabric_client.setStateStore(state_store);
        var crypto_suite = Fabric_Client.newCryptoSuite();
        var crypto_store = Fabric_Client.newCryptoKeyStore({path: store_path});
        crypto_suite.setCryptoKeyStore(crypto_store);
        fabric_client.setCryptoSuite(crypto_suite);
        var	tlsOptions = {
            trustedRoots: [],
            verify: false
        };
        // be sure to change the http to https when the CA is running TLS enabled
        fabric_ca_client = new Fabric_CA_Client('https://127.0.0.1:7054', tlsOptions , 'ca.h3c.paypro.com', crypto_suite);

        // first check to see if the admin is already enrolled
        return fabric_client.getUserContext('admin', true);
    }).then((user_from_store) => {
        if (user_from_store && user_from_store.isEnrolled()) {
            console.log('Successfully loaded admin from persistence');
            admin_user = user_from_store;
            return null;
        } else {
            // need to enroll it with CA server
            return fabric_ca_client.enroll({
            enrollmentID: 'admin',
            enrollmentSecret: 'adminpw'
            }).then((enrollment) => {
            console.log('Successfully enrolled admin user "admin"');
            return fabric_client.createUser(
                {
                    username: 'admin',
                    mspid: 'h3cMSP',
                    cryptoContent: { privateKeyPEM: enrollment.key.toBytes(), signedCertPEM: enrollment.certificate }
                });
            }).then((user) => {
            admin_user = user;
            return fabric_client.setUserContext(admin_user);
            }).catch((err) => {
            console.error('Failed to enroll and persist admin. Error: ' + err.stack ? err.stack : err);
            throw new Error('Failed to enroll admin');
            });
        }
    }).then(() => {
        console.log('Assigned the admin user to the fabric client ::' + admin_user.toString());
        //res.send()
    }).catch((err) => {
        console.error('Failed to enroll admin: ' + err);
        //res.send()
    });
}