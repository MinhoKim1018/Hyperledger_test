/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class UserTxH3E extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        console.info('############initing##############')
        console.info('============= END : Initialize Ledger ===========');
    }

    
    async insertUserTx(ctx,i,user_id,tx_id,merchant,symbol,quantity,date) {

        const startKey = "USER_"+i+"_0"
        const endKey = "USER_"+i+"_9999"

        const iterator = await ctx.stub.getStateByRange(startKey, endKey);

        const allResults = [];

        while (true) {
            
            const res = await iterator.next();
       
            if (res.value && res.value.value.toString()) {
                console.log(res.value.value.toString('utf8'));

                const Key = res.value.key;
                let Record;
                try {
                    Record = JSON.parse(res.value.value.toString('utf8'));
                } catch (err) {
                    console.log(err);
                    Record = res.value.value.toString('utf8');
                }
                await allResults.push({ Key, Record });
                console.log("Reuslt Length :::: ",allResults.length)   
                
            }
            if(allResults.length==0){
                console.log("@@@@@@@@@@@@@@@@@@@@@@@allResult putstate",allResults.length)
                
                await ctx.stub.putState('USER'+i,Buffer.from(JSON.stringify({init:user_id})))
                
                console.log("@@@@@@@@@@@@@@@@@@@@@@@allResult putstate ###########END#############")
            }
           
            if (res.done) {
                const allResultsLength=allResults.length
                console.log('res done !!! ##### put state tx info');
                await iterator.close();
                var infoJson={tx_id:tx_id,merchant:merchant,symbol:symbol,quantity:quantity,date:date}
                await ctx.stub.putState('USER_'+i+'_'+allResultsLength,Buffer.from(JSON.stringify(infoJson)) );
                console.info('============= END : Create Car ===========');
                return ;
                
            }
        }        
    }


    async queryUserAllTx(ctx,i) {
        
        const startKey = "USER_"+i+"_0"
        const endKey = "USER_"+i+"_9999"

        const iterator = await ctx.stub.getStateByRange(startKey, endKey);

        const allResults = [];
        while (true) {
            const res = await iterator.next();

            if (res.value && res.value.value.toString()) {
                console.log(res.value.value.toString('utf8'));

                const Key = res.value.key;
                let Record;
                try {
                    Record = res.value.value.toString('utf8')
                } catch (err) {
                    console.log(err);
                    Record = res.value.value.toString('utf8');
                }
                allResults.push({ Key, Record });
            }
            if (res.done) {
                console.log('end of data (query User All TX)');
                await iterator.close();
                console.info(allResults);
                
                return allResults;
            }
        }        
    }


    async queryAllUser(ctx) {
        
        const startKey = "USER0"
        const endKey = "USER9999"

        const iterator = await ctx.stub.getStateByRange(startKey, endKey);
        const allResults = [];
        while (true) {
            const res = await iterator.next();

            if (res.value && res.value.value.toString()) {
                console.log(res.value.value.toString('utf8'));

                const Key = res.value.key;
                let Record;
                try {
                    Record = res.value.value.toString('utf8')
                } catch (err) {
                    console.log(err);
                    Record = res.value.value.toString('utf8');
                }
                allResults.push({ Key, Record });
            }
            if (res.done) {
                console.log('end of data (query All User)');
                await iterator.close();
                console.info(allResults);
                
                return allResults;
            }
        }        
    }
}

module.exports = UserTxH3E;
