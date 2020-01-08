const chalk = require('chalk');
const rds = require('ali-rds');
const co = require('co');

const DbTypeToJc={
    int: "number",
    bigint: "number",
    datetime: "datetime",
    varchar: "string",
    text: "string",
    mediumint: "number",
    enum: "number",
    tinyint: "number",
    smallint: "number",
    char: "number",
    decimal: "number",
    mediumtext: "string",
    longtext: "string",
    float:"number",
    date:"date"
}

const DbTypeDefault={
    int: 0,
    bigint: 0,
    datetime: "new Date()",
    varchar: "''",
    text: "''",
    mediumint: 0,
    enum: 0,
    tinyint: 0,
    smallint: 0,
    char: "''",
    decimal: 0,
    mediumtext: "''",
    longtext: "''",
    float: 0,
    date: "new Date()"
}

class Database  {

    constructor(dbConfig) {
        this.dbConfig = dbConfig;
    }

    /**
     * Initialize before querying the database
     * @private
     */
    _initDb(){
        if(!this.db){
            this.db = rds({
                host: this.dbConfig.host,
                port: this.dbConfig.port,
                user: this.dbConfig.user,
                password: this.dbConfig.password,
                database: this.dbConfig.database,
            })
        }
    }

    /**
     * convert camel type string to kebab type
     * @param strt  camel string
     * @returns {string} kebab string
     * @private
     */
    _toKebabCase(str) {
        const hyphenateRE = /([^_])([A-Z])/g;
        return str
            .replace(hyphenateRE, '$1_$2')
            .replace(hyphenateRE, '$1_$2')
            .toLowerCase();
    }

    /**
     * get a camel case string
     * @param str
     * @returns {string} camel string
     * @private
     */
    _toCamelCase(str){
        let s =
            str &&
            str
                .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
                .map(x => x.slice(0, 1).toUpperCase() + x.slice(1).toLowerCase())
                .join('');
        return s.slice(0, 1).toLowerCase() + s.slice(1);
    };

    /**
     * get a camel table name
     * @param tableName original table name
     * @returns {string}
     * @private
     */
    _getCamelTableName(tableName){
        const tablePrefix=this.dbConfig.tablePrefix
        let temp=tableName;
        if(tableName.substr(0,tablePrefix.length)===tablePrefix){
            temp = tableName.substr(tablePrefix.length,tableName.length)
        }
        return this._toCamelCase(temp.toLowerCase())
    }


    /**
     * get all tables map for generate codes
     * @returns {Promise<{}>}
     */
    async getTablesMap (){
        this._initDb();
        const sql = `SELECT A.TABLE_NAME,A.COLUMN_NAME,A.DATA_TYPE,
                        A.IS_NULLABLE,A.COLUMN_COMMENT,A.COLUMN_KEY,
                        A.ORDINAL_POSITION,A.COLUMN_DEFAULT,B.TABLE_COMMENT
                        FROM information_schema.COLUMNS A
                        INNER JOIN information_schema.TABLES B ON A.TABLE_NAME=B.TABLE_NAME
                        WHERE  A.TABLE_SCHEMA = '${this.dbConfig.database}'`;
        let rows = await  this.db.query(sql);
        let renList={};

        let preTableName='';
        for (let i = 0; i < rows.length; i++) {
            const tableName=rows[i].TABLE_NAME;
            const camelTableName = this._getCamelTableName(tableName);
            const camelTableNameUF = camelTableName.replace(camelTableName[0],camelTableName[0].toUpperCase());
            const columnName=rows[i].COLUMN_NAME;
            const camelColumnName =this._toCamelCase(columnName.toLowerCase())
            const dataType=rows[i].DATA_TYPE;
            const defaultValue= this._getDefaultValue(rows[i].DATA_TYPE,rows[i].COLUMN_DEFAULT)
            const columnComment=rows[i].COLUMN_COMMENT;
            const tableComment=rows[i].TABLE_COMMENT;
            const isNullable=rows[i].IS_NULLABLE === 'YES';
            const isPrimaryKey=rows[i].COLUMN_KEY === "PRI";
            const order=Number(rows[i].ORDINAL_POSITION - 1);
            const jsType = DbTypeToJc[dataType];
            if(preTableName !== tableName){
                renList[camelTableName]={}
                renList[camelTableName]['tableName']=tableName;
                renList[camelTableName]['camelTableNameUF']=camelTableNameUF;
                renList[camelTableName]['camelTableName']=camelTableName;
                renList[camelTableName]['tableComment']=tableComment;
                renList[camelTableName]['fields']=[];
                preTableName = tableName;
            }
            if(isPrimaryKey){
                renList[camelTableName]['primaryKey']=camelColumnName;
            }
            renList[camelTableName]['fields'][order]={
                columnName,
                camelColumnName,
                dataType,
                jsType,
                isNullable,
                columnComment,
                isPrimaryKey,
                order,
                defaultValue
            }
        }
        //return renList;
        return this.filterNoPrimaryKey(renList);
    }

    filterNoPrimaryKey(tablesFromDb){
        const tableNames = Object.keys(tablesFromDb);
        let errorArr = new Array();
        let ren=tablesFromDb;
        for(let j = 0; j < tableNames.length; j++) {
            if(!tablesFromDb[tableNames[j]].primaryKey){
                const str = `   ${tableNames[j].padEnd(35)} - ${chalk.grey(tablesFromDb[tableNames[j]]['tableComment'])}`;
                errorArr.push(str);
                delete ren[tableNames[j]];
            }else{
                // ren.push(tablesFromDb[tableNames[j]])
            }
        }
        if(errorArr.length>0){
            console.error(chalk.red('✘ you master check the next tables, these tables no primaryKey.'));
        }
        for(let i = 0; i < errorArr.length; i++) {
            console.log(errorArr[i])
        }
        return ren;
    }


    _getDefaultValue(dataType,columnDefault){
        if(columnDefault === undefined || columnDefault === null || columnDefault.length===0 ){
            return DbTypeDefault[dataType]
        }else{
            return columnDefault;
        }
    }

    /**
     * get the mock data from the database
     * @param camelTableName
     * @returns {Generator<*, *, ?>}
     */
    async getMockData(camelTableName){
        const tablePrefix=this.dbConfig.tablePrefix
        this._initDb();
        let tableName=tablePrefix + this._toKebabCase(camelTableName)
        const sql = `select * from ${tableName} LIMIT 30`;
        console.log(sql)
        let rows = await this.db.query(sql);
        let renList=[];
        for (let i = 0; i < rows.length; i++) {
            const keys = Object.keys(rows[i]);
            renList[i]={}
            for(let j=0; j<keys.length; j++){
                const key = keys[j];
                const camelKey = this._toCamelCase(key)
                renList[i][camelKey] = rows[i][key]
            }
        }
        return renList
    }
}


module.exports = Database;





