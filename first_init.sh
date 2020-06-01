
rm -rf crypto-config
rm -rf config
sleep 2

mkdir crypto-config
mkdir config
sleep 2
#cryptogen 사용해 msp생성
bin/cryptogen generate --config=./crypto-config.yaml



sleep 2


#genesis블록 생성 및 config 폴더에 채널 정의

#genesis 블록 생성
bin/configtxgen -profile PayproOrdererGenesis -outputBlock ./config/genesis.block -channelID genesis



#channel정의

#AllChannel
##채널생성
bin/configtxgen -profile AllChannel -outputCreateChannelTx ./config/allchannel.tx -channelID allchannel
##앵커피어 설정
bin/configtxgen -profile AllChannel -outputAnchorPeersUpdate ./config/h3canchor_all.tx -channelID allchannel -asOrg h3cMSP
bin/configtxgen -profile AllChannel -outputAnchorPeersUpdate ./config/mijaanchor_all.tx -channelID allchannel -asOrg mijaMSP
bin/configtxgen -profile AllChannel -outputAnchorPeersUpdate ./config/yapyapanchor_all.tx -channelID allchannel -asOrg yapyapMSP




        