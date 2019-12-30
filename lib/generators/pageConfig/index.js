const BasicGenerator = require('../../BasicGenerator');
const chalk = require('chalk');

module.exports = class extends BasicGenerator {

    initializing(){
        // this.checkConfigFile();
        // this.checkDataStructure();
    }

    _getPageTypesChoices(){
        const pageTypes =require(`./meta.json`).pageTypes;
        const pageTypesChoices = pageTypes.map(f=>{
            return {
                name: `${f.name.padEnd(20)} - ${chalk.gray(f.description)}`,
                value: f.name
            }
        });
        return pageTypesChoices;
    }

    _checkFileName(value){
        console.log(value)
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

    /**
     * See {@link https://github.com/SBoudrias/Inquirer.js/blob/master/README.md Documentation}
     * @returns {*|PromiseLike<any>|Promise<any>}
     */
    async prompting() {
        // const tables=await this.getTablesMap();
        const prompts = [
            {
                name: 'pageType',
                type: 'list',
                message: 'Which pageType do you want to use?',
                choices: this._getPageTypesChoices(),
            },
            {
                name: 'configFileName',
                message: `What's the configFile name?`,
                validate: this._checkFileName,
            },
            {
                name: 'reactFeatures',
                message: 'What functionality do you want to enable?',
                type: 'checkbox',
                choices: [
                    {name: 'antd', value: 'antd'},
                    {name: 'dva', value: 'dva'},
                    {name: 'code splitting', value: 'dynamicImport'},
                    {name: 'dll', value: 'dll'},
                    {name: 'internationalization', value: 'locale'},
                ],
            },
        ];
        return this.prompt(prompts).then(props => {
            this.prompts = props;
        });
    }

    writing() {

    }
};
