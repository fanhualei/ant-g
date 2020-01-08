const rds = require('ali-rds');
async function   testDbConnect(dbConfig) {
    const db =rds({
        host: dbConfig.host,
        port: dbConfig.port,
        user: dbConfig.user,
        password: dbConfig.password,
        database: dbConfig.database,
    })
    try {
        let count = await db.count('information_schema.COLUMNS')
        return true;
    }catch(err){
        return false;
    }
}

module.exports ={
    testDbConnect
}
