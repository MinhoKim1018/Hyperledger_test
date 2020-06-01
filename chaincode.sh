

#chaincode install
docker exec cli peer chaincode install -n h3c -v 1.0 -p "/opt/gopath/src/github.com/userTxH3C" -l "node" 



#chaincode instantiate
docker exec cli peer chaincode instantiate -o orderer0.paypro.com:7050 -C allchannel -n h3c -l "node" -v 1.0 -c '{"Args":[]}' -P "OR ('h3cMSP.member')" --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/paypro.com/orderers/orderer0.paypro.com/msp/tlscacerts/tlsca.paypro.com-cert.pem

#chaincode upgrade

docker exec cli peer chaincode upgrade -o orderer0.paypro.com:7050 -C allchannel -n h3c -l "node" -v 3.0 -p "/opt/gopath/src/github.com/userTxH3C" -c '{"Args":[]}' -P "OR ('h3cMSP.member')" --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/paypro.com/orderers/orderer0.paypro.com/msp/tlscacerts/tlsca.paypro.com-cert.pem


sleep 10
docker exec cli peer chaincode invoke -o orderer0.paypro.com:7050 -C allchannel -n h3c -c '{"function":"initLedger","Args":[]}' --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/paypro.com/orderers/orderer0.paypro.com/msp/tlscacerts/tlsca.paypro.com-cert.pem


sleep 10

docker exec cli peer chaincode query -o orderer0.paypro.com:7050 -C allchannel -n h3c -c '{"function":"queryUserAllTx","Args":["0"]}'

docker exec cli peer chaincode query -o orderer0.paypro.com:7050 -C allchannel -n h3c -c '{"function":"queryAllUser","Args":[""]}' --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/paypro.com/orderers/orderer0.paypro.com/msp/tlscacerts/tlsca.paypro.com-cert.pem

docker exec cli peer chaincode invoke -o orderer0.paypro.com:7050 -C allchannel -n h3c -c '{"function":"insertUserTx","Args":["13","test_merchant","h3c","100","123","kmh1018"]}' --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/paypro.com/orderers/orderer0.paypro.com/msp/tlscacerts/tlsca.paypro.com-cert.pem
