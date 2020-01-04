const BasicGenerator = require('../../BasicGenerator');
const chalk = require('chalk');
const inquirer = require('inquirer');

const _ = require('lodash');
const fuzzy = require('fuzzy');
inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));

module.exports = class extends BasicGenerator {
    initializing(){
        this.checkConfigFile();
        this.checkDataStructure();
    }

    _getPageTypesChoices(){
        const pageTypes =require(`./meta.json`).pageTypes;
        const pageTypesChoices = pageTypes.map(f=>{
            return {
                name: `${f.name.padEnd(20)}-${chalk.gray(f.description)}`,
                value: f.name
            }
        });
        return pageTypesChoices;
    }

    _checkFileName(value){
        if(!value || value.length<=0){
            console.error(chalk.red('> 文件名不能为空，请重新输入。'));
            return false;
        }
        const reg = new RegExp('[\\\\/:*?\"<>|]');
        if (reg.test(value)) {
            console.error(chalk.red('>文件名包含特殊字符，请重新输入。'));
            return false;
        }
        return true;
    }

    _searchTables=(answers, input)=> {
        input = input || '';
        const tables= this.getTableNameArray();
        return new Promise(function(resolve) {
            setTimeout(function() {
                var fuzzyResult = fuzzy.filter(input, tables);
                resolve(
                    fuzzyResult.map(function(el) {
                        return el.original;
                    })
                );
            }, _.random(30, 500));
        });
    }

    /**
     * get the Choices of fields
     * @param tableName
     * @returns {*}
     * @private
     */
    _getFieldsChoices = (tableName)=>{
        const tables =this.getDataStructure().tables;
        const fields=tables[tableName]['fields'];
        return fields.map(item=>{
            return {
                name: item.camelColumnName,
                value: item.camelColumnName,
            }
        })
    }




    /**
     * See {@link https://github.com/SBoudrias/Inquirer.js/blob/master/README.md Documentation}
     * @returns {*|PromiseLike<any>|Promise<any>}
     */
    async prompting() {
        const answers1 =
            await inquirer.prompt([
                {
                    name: 'pageType',
                    type: 'list',
                    message: 'Which pageType do you want to use?',
                    choices: this._getPageTypesChoices(),
                },
                {
                    type: 'autocomplete',
                    name: 'dataSource',
                    message: 'Which table do you want to use for dataSource.',
                    source: this._searchTables,
                },
            ])

        const tableName= answers1['dataSource'].substr(0,answers1['dataSource'].indexOf('-')).trim();
        const tables = this.getTablesMap();
        const title= tables[tableName].tableComment;
        answers1['title'] = title;
        answers1['dataSource'] = tableName;
        const fields = this._getFieldsChoices(tableName);
        const fieldsCount = fields.length>10?10:fields.length;

        const answers2 =
            await inquirer.prompt([
                {
                    name: 'configFileName',
                    message: `What's the configFile name?`,
                    validate: this._checkFileName,
                    default: tableName,
                },
                {
                    name: 'path',
                    message: `What's the path you want to set?`,
                    default: tableName,
                },
                {
                    name: 'dir',
                    message: `What's the dir you want to save in src/pages/?`,
                    default: tableName,
                },
                {
                    name: 'searchFields',
                    message: 'What fields do you want to show for search form?',
                    type: 'checkbox',
                    choices: fields,
                    pageSize: fieldsCount,
                },
                {
                    name: 'gridFields',
                    message: 'What fields do you want to show for grid list?',
                    type: 'checkbox',
                    choices: fields,
                    pageSize: fieldsCount,
                },
                {
                    name: 'editFields',
                    message: 'What fields do you want to show for add or edit page?',
                    type: 'checkbox',
                    choices: fields,
                    pageSize: fieldsCount,
                },
            ])

        this.prompts ={
            ...answers1,
            ...answers2
        }
    }

    writing() {
        const {configFileName
            } = this.prompts;
        this.fs.copyTpl(
            this.templatePath('simple.txt'),
            this.destinationPath(`.g/${configFileName}.json`),
            this.prompts
        );
    }
};
