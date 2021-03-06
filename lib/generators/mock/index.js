const { join } = require('path');
const Generator = require('yeoman-generator');
const BasicGenerator = require('../../BasicGenerator');


module.exports = class extends BasicGenerator {
    initializing(){
        this.checkConfigFile();
        this.checkDataStructure();
    }

    async writing() {
        const tables=await this.getTablesMap();
        const gConfig= this.getGConfig();
        const mockConfig=gConfig["mock"]
        if(!mockConfig){
            this.exitByError(`✘ the file g-config.json have not mock config  `)
        }
        const toGTables = mockConfig["tables"].length>0
            ?mockConfig["tables"]
            :this.getTableNameArrayByReg(mockConfig["tableReg"]);

        if(toGTables.length>0){
            for(let i=0; i < toGTables.length; i++){
                const gTableName = toGTables[i]
                const tableDetail =  tables[gTableName]
                if(!tableDetail){
                    this.exitByError(`✘ can't find the table detail ${gTableName}  `)
                }
                this._saveOneFile(gTableName,tableDetail)
            }
        }
    }


    _saveOneFile(camelTableName,tableDetail,){
        const apiBasePath = this.getApiBasePath();
        tableDetail['apiBasePath']=apiBasePath + camelTableName + "/";
        const fileName = `mock/${camelTableName}.ts`;
        this.fs.copyTpl(
            this.templatePath("mock.txt"),
            this.destinationPath(fileName),
            tableDetail
        );
        this.prettierCode(fileName)
    }

};
