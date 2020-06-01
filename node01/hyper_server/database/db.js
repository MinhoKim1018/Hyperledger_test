const Sequelize = require('sequelize')

const db={}

const sequelize=new Sequelize('hyper_db','root','root',{
    host:'127.0.0.1',
    dialect:'mysql',
    define:{
        timestamps:false
    },
    logging:false
})

db.sequelize=sequelize;
db.Sequelize=sequelize;


module.exports=db