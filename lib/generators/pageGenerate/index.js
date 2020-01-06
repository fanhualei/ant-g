const BasicGenerator = require('../../BasicGenerator');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');

const _ = require('lodash');
const fuzzy = require('fuzzy');
inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));

module.exports = class extends BasicGenerator {
    initializing(){
        this.checkDataStructure();
        this.checkConfigFile();
    }

    _getPageConfigs=()=>{
        const configPath = path.resolve(this.getProjectPath(),".g");
        let ren= fs
            .readdirSync(`${configPath}`)
            .filter(f => !f.startsWith('.'))
            .map(f => {
                const fileName =path.resolve(configPath,`${f}`);
                const configData = require(fileName);
                const configOption = `${configData.dataSource}(${configData.title})`;
                return  `${f.padEnd(25)} -${chalk.grey(configOption)}`;
            });
        return ren;
    }

    _searchPageConfigs=(answers, input)=> {
        input = input || '';
        const pageConfigs= this._getPageConfigs();
        return new Promise(function(resolve) {
            setTimeout(function() {
                var fuzzyResult = fuzzy.filter(input, pageConfigs);
                resolve(
                    fuzzyResult.map(function(el) {
                        return el.original;
                    })
                );
            }, _.random(30, 500));
        });
    }

    async prompting() {
        const answers1 =
            await inquirer.prompt([
                {
                    type: 'autocomplete',
                    name: 'pageConfig',
                    message: 'Which pageConfig do you want to use ?',
                    source: this._searchPageConfigs,
                },
            ]);
        this.prompts = {
            ...answers1,
        };
    }

    _getPageConfigData(){
        const {pageConfig} = this.prompts;
        const fileName = pageConfig.substr(0,pageConfig.indexOf('-')).trim();
        const filePath = path.resolve(this.getProjectPath(),`.g/${fileName}`);
        let pageConfigData = require(filePath);
        const {dataSource} = pageConfigData;
        const tables = this.getTablesMap();
        pageConfigData={
            ...pageConfigData,
            ...tables[dataSource]
        }
        return pageConfigData;
    }

    _writingSimple(pageConfigData){
        //console.log(pageConfigData);
        const {dir} = pageConfigData.menu;
        const srcPath = `src/pages/${dir}`;
        const files = ['model.ts','style.less','index.tsx','searchForm.tsx','dataTable.tsx'];
        for(let i=0 ; i<files.length ;i=i+1){
            const fileName = files[i];
            this.fs.copyTpl(
                this.templatePath(`simple/${fileName}`),
                this.destinationPath(`${srcPath}/${fileName}`),
                pageConfigData
            );
            if(fileName==='searchForm.tsx' || fileName==='dataTable.tsx'){
                this.prettierCode(`${srcPath}/${fileName}`)
            }
        }
    }
    writing() {
        const pageConfigData = this._getPageConfigData();
        if(pageConfigData['pageType']==='simple'){
            this._writingSimple(pageConfigData);
        }
    }
};
