#기존 docker-compoes 설정 삭제
docker rm -f $(docker ps -a -q)
docker-compose -f docker-compose-kafka.yml kill && docker-compose -f docker-compose-kafka.yml down
docker-compose -f docker-compose.yml kill && docker-compose -f docker-compose.yml down

sleep 2

##docker-cmopose up
docker-compose -f docker-compose-kafka.yml up -d
sleep 2
docker-compose -f docker-compose.yml up -d

sleep 5
# AllChannel 생성
docker exec -e "CORE_PEER_LOCALMSPID=h3cMSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/h3c.paypro.com/users/Admin@h3c.paypro.com/msp" -e "CORE_PEER_ADDRESS=peer0.h3c.paypro.com:7051" cli peer channel create -o orderer0.paypro.com:7050 -c allchannel -f /etc/hyperledger/config/allchannel.tx --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/paypro.com/orderers/orderer0.paypro.com/msp/tlscacerts/tlsca.paypro.com-cert.pem

# AllChannel에 피어 조인
docker exec -e "CORE_PEER_LOCALMSPID=h3cMSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/h3c.paypro.com/users/Admin@h3c.paypro.com/msp" -e "CORE_PEER_ADDRESS=peer0.h3c.paypro.com:7051" -e "CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/h3c.paypro.com/peers/peer0.h3c.paypro.com/tls/ca.crt" cli peer channel join -b allchannel.block

docker exec -e "CORE_PEER_LOCALMSPID=mijaMSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/mija.paypro.com/users/Admin@mija.paypro.com/msp" -e "CORE_PEER_ADDRESS=peer0.mija.paypro.com:8051" -e "CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/mija.paypro.com/peers/peer0.mija.paypro.com/tls/ca.crt" cli peer channel join -b allchannel.block

docker exec -e "CORE_PEER_LOCALMSPID=yapyapMSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/yapyap.paypro.com/users/Admin@yapyap.paypro.com/msp" -e "CORE_PEER_ADDRESS=peer0.yapyap.paypro.com:9051" -e "CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/yapyap.paypro.com/peers/peer0.yapyap.paypro.com/tls/ca.crt"  cli peer channel join -b allchannel.block

