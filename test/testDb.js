const Database = require('../lib/utils/db');

const dbConfig = {
    "host": "192.168.1.179",
    "user": "root",
    "password": "rootmysql",
    "database": "phoenix",
    "port": 3306,
    "tablePrefix": "as_"
};



const dbTest = new Database(dbConfig)
let aa= dbTest.getTablesMap()
aa.then(rows=>{
    console.log('rows')
    //process.exit();
})
console.log('test()')

dbTest.getMockData('actionLog').then(rows=>{
    console.log(rows)
})

