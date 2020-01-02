const { join } = require('path');
const Generator = require('yeoman-generator');
const BasicGenerator = require('../../BasicGenerator');
const prettier = require('prettier');


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
        const toGTables = mockConfig["tables"]
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
        const fileName = `mock/${camelTableName}.ts`;
        this.fs.copyTpl(
            this.templatePath("mock.txt"),
            this.destinationPath(fileName),
            tableDetail
        );

        const txt =this.fs.read(fileName);
        const formatted  = prettier.format(txt,{ parser: "typescript" })
        this.fs.write(fileName,formatted)
        this.prettierArray.push(fileName)
    }

    async end(){
        // await this.prettierCode();
    }


};
