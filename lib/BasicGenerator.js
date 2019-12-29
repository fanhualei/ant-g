const Generator = require('yeoman-generator');
const glob = require('glob');
const { statSync,existsSync } = require('fs');
const { basename, join } = require('path');
const chalk = require('chalk');
const Database = require('./utils/db');
const semver = require('semver');
const debug = require('debug')('create-umi:BasicGenerator');

function noop() {
    return true;
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

    _initDb(){
        if(!this.db){
            if(!this.getConfigFilePath()){
                console.error(chalk.red(`> the file g-config.json is not exists`));
                process.exit(1);
            }
            const dbConfig = this.getGConfig().db;
            this.db = new Database(dbConfig)
        }
    }

    getTablesMap(fromDb){
        if(fromDb){
            this._initDb();
            return this.db.getTablesMap()
        } else {
            return require(`../${this.getDataStructureFileName()}`).tables
        }
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

        const dataStructureVersion = require(`../${this.getDataStructureFileName()}`).version;
        if (!semver.satisfies(this.getVersion(), `>= ${dataStructureVersion}`)) {
            const message = `✘ Warning The generator's version:${this.getVersion()} > the .g/dataStructure.json version:${dataStructureVersion} .  `;
            console.error(chalk.yellowBright(message));
        }
    }

    checkConfigFile(){
        if(!this.existConfigFile()){
            this.exitByError(`✘ the file g-config.json is not exists,you need to create new g-config.json `)
        }
    }

    getMockDataFromDb(tableName){
        this._initDb();
        return this.db.getMockData(tableName)
    }

    exitByError(errMessage){
        console.error(chalk.red(errMessage));
        process.exit(1);
    }

    getVersion(){
        return require("../package.json").version;
    }


}

module.exports = BasicGenerator;
