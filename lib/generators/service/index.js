const chalk = require('chalk');
const BasicGenerator = require('../../BasicGenerator');

class ServiceGenerator extends BasicGenerator {
    initializing(){
        this.checkConfigFile();
        this.checkDataStructure();
    }

    async writing() {
        const tables=await this.getTablesMap();
        const gConfig= this.getGConfig();
        const serviceConfig=gConfig["service"]
        if(!serviceConfig){
            this.exitByError(`✘ the file g-config.json have not service config  `)
        }
        const toGTables = serviceConfig["tables"]
        for(let i=0; i < toGTables.length; i++){
            const gTableName = toGTables[i]
            const tableDetail =  tables[gTableName]
            if(!tableDetail){
                this.exitByError(`✘ can't find the table detail ${gTableName}  `)
            }
            this._saveOneFile(gTableName,tableDetail)
        }
    }

    _saveOneFile(camelTableName,tableDetail,){

        const apiBasePath = this.getApiBasePath();
        tableDetail['apiBasePath']=apiBasePath + camelTableName + "/";
        // console.log(tableDetail)
        this.fs.copyTpl(
            this.templatePath("data.d"),
            this.destinationPath(`src/services/${camelTableName}.d.ts`),
            tableDetail
        );
        this.fs.copyTpl(
            this.templatePath("service.d"),
            this.destinationPath(`src/services/${camelTableName}Service.ts`),
            tableDetail
        );
    }
}

module.exports = ServiceGenerator;
