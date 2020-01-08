const Generator = require('yeoman-generator');
const glob = require('glob');
const { existsSync } = require('fs');
const { basename, join } = require('path');
const chalk = require('chalk');
const Database = require('./utils/db');
const semver = require('semver');
const debug = require('debug')('ant-g:BasicGenerator');
const path = require('path');
const prettier = require('prettier');

function noop() {
    return true;
}

prettierOptions={
    "ts": {singleQuote:true,trailingComma:'all', parser: "typescript"},
    "tsx": {singleQuote:true,trailingComma:'all', parser: "typescript"}
}

class BasicGenerator extends Generator {

    constructor(opts) {
        super(opts);
        this.opts = opts;
        this.name = basename(opts.env.cwd);
    }

    prompt(questions) {
        process.send && process.send({ type: 'prompt' });
        process.emit('message', { type: 'prompt' });
        return super.prompt(questions);
    }

    /**
     * Decide whether the configuration file exists
     * @returns {boolean} true is exists
     */
    existConfigFile(){
        return existsSync(this.getConfigFilePath());
    }

    /**
     * Get the config file's path
     * @returns {string}
     */
    getConfigFilePath(){
        return join(this.destinationRoot(undefined), 'g-config.json');
    }

    /**
     * get the configuration from json file.
     * @returns {undefined|any}
     */
    getGConfig(){
        if(this.existConfigFile()){
            return require(this.getConfigFilePath())
        }
        return undefined;
    }

    getApiBasePath(){
        const gConfig = this.getGConfig();
        return gConfig['public']['apiBasePath']
    }

    /**
     * init the object db
     * @private
     */
    _initDb(){
        if(!this.db){
            if(!this.getConfigFilePath()){
                this.exitByError(`> the file g-config.json is not exists`)
            }
            const dbConfig = this.getGConfig().db;
            this.db = new Database(dbConfig)
        }
    }


    /**
     * get Tables detail
     * @param fromDb
     * @returns {{}|Promise<{}>}
     */
    getTablesMap(fromDb){
        if(fromDb){
            this._initDb();
            return this.db.getTablesMap()
        } else {
            return this.getDataStructure().tables
        }
    }

    /**
     * get tables array for select the table
     * @returns {any[]}
     */
    getTableNameArray(){
        const tables =this.getDataStructure().tables;
        const tableNames = Object.keys(tables);
        let arr = new Array();
        for(let j = 0; j < tableNames.length; j++) {
            const str = `${tableNames[j].padEnd(35)} - ${chalk.grey(tables[tableNames[j]]['tableComment'])}`;
            arr.push(str);
        }
        return arr;
    }



    getTableNameArrayByReg(tableReg){
        let regString = tableReg;
        if(regString.length===0){
            regString='\s';
        }
        const regExp = new RegExp(regString);
        const tables =this.getDataStructure().tables;
        const tableNames = Object.keys(tables);
        console.log(regString)
        let renArray = [];
        for(let i=0; i < tableNames.length; i++){
            const isTheTable =  regExp.test(tableNames[i]);

            if(isTheTable){
                console.log(`${isTheTable}   ${tableNames[i]}`)
                renArray.push(tableNames[i])
            }
        }
        return renArray;
    }



    /**
     * get data structure's json
     * @returns {any}
     */
    getDataStructure(){
        const projectPath = this.getProjectPath();
        const dataStructureJsonPath = path.resolve(projectPath, this.getDataStructureFileName());
        return require(dataStructureJsonPath)
    }

    /**
     * this will get the projectPath
     * @returns {string}
     * @see  this.destinationRoot(undefined)  can get same value
     */
    getProjectPath(){
        const projectName = this.opts.name || this.opts.env.cwd;
        const projectPath = path.resolve(projectName);
        return projectPath;
    }

    getDataStructureFileName(){
        return '.g/.dataStructure.json';
    }

    /**
     * check exists
     * check version
     */
    checkDataStructure(){
        const fs = require('fs');
        const fileName = this.getDataStructureFileName();
        if(!this.fs.exists(fileName)){
            this.exitByError(`✘ ${fileName} not exists,you can initDataStructure to create it `)
        }

        const dataStructureVersion = this.getDataStructure().version;
        if (!semver.satisfies(this.getAntGVersion(), `>= ${dataStructureVersion}`)) {
            const message = `✘ Warning The generator's version:${this.getAntGVersion()} > the .g/dataStructure.json version:${dataStructureVersion} .  `;
            console.error(chalk.yellowBright(message));
        }
    }

    checkConfigFile(){
        if(!this.existConfigFile()){
            this.exitByError(`✘ the file g-config.json is not exists,you need to create new g-config.json `)
        }
    }

    /**
     * get data from database
     * @param tableName
     * @returns {Generator<*, *, ?>}
     */
    getMockDataFromDb(tableName){
        this._initDb();
        return this.db.getMockData(tableName)
    }

    /**
     * exit process
     * @param errMessage
     */
    exitByError(errMessage){
        console.error(chalk.red(errMessage));
        process.exit(1);
    }

    /**
     * get the ant-g code generators's version . this version is not the project package.json
     * @returns {string}
     */
    getAntGVersion(){
        return require("../package.json").version;
    }

    prettierCode(fileName){
        const txt =this.fs.read(fileName);
        const suffix = fileName.substr(fileName.lastIndexOf(".")+1);
        const options =prettierOptions[suffix]
        if(!options){
            console.error(chalk.red(`not find parser for ${fileName}`));
            return;
        }
        const formatted  = prettier.format(txt,options)
        this.fs.write(fileName,formatted)
    }

}

module.exports = BasicGenerator;
