const BasicGenerator = require('../../BasicGenerator');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');


const {ejsGetGridRender,
    ejsGetMomentImport,
    ejsGetAntImport,
    ejsGetSearchFormItem,
    ejsGetEditFormItem} = require('../../utils/ejs')

const  { join } = path;
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
                {
                    type: 'confirm',
                    name: 'changeRoute',
                    message: 'are you want to change the route ?',
                    default: false,
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
            ...tables[dataSource],
            ejsGetGridRender,
            ejsGetMomentImport,
            ejsGetAntImport,
            ejsGetSearchFormItem,
            ejsGetEditFormItem
        }
        return pageConfigData;
    }

    _writingSimple(pageConfigData){
        const {dir} = pageConfigData.menu;
        const srcPath = `src/pages/${dir}`;


        const simplePath = path.resolve(__dirname,"templates/simple");
        let files= fs
            .readdirSync(simplePath)
            .map(f => {
                return  f;
            });
        for(let i=0 ; i<files.length ;i=i+1){
            const fileName = files[i];
            this.fs.copyTpl(
                this.templatePath(`simple/${fileName}`),
                this.destinationPath(`${srcPath}/${fileName}`),
                pageConfigData
            );
            if(fileName==='searchForm.tsx' || fileName==='dataTable.tsx' || fileName==='edit.tsx'){
                this.prettierCode(`${srcPath}/${fileName}`)
            }
        }
    }
    writing() {
        const pageConfigData = this._getPageConfigData();
        if(pageConfigData['pageType']==='simple'){
            this._writingSimple(pageConfigData);
            this._changeRoute(pageConfigData);
        }
    }

    _changeRoute(pageConfigData){
        const {changeRoute} = this.prompts;
        if(changeRoute){
            const {writeNewRoute} = require('../../utils/writeNewRoute');
            const configPath = join(this.getProjectPath(),'config/config.ts');
            console.log(configPath)
            if(fs.existsSync(configPath)){
                const {path,name,dir} = pageConfigData.menu;
                const newRoute ={
                    name,
                    icon: 'smile',
                    path: `/${path}`,
                    component: `./${dir}`,
                };
                writeNewRoute(newRoute,configPath,'');
            }
        }
    }
};
