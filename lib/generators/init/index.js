const chalk = require('chalk');
const BasicGenerator = require('../../BasicGenerator');


module.exports = class extends BasicGenerator {
    async initializing(){
        if(this.existConfigFile()){
            this.exitByError(`✘ the file g-config.json is exists,you need to delete it manually `)
        }
    }

    prompting() {
        const prompts = [
            {
                name: 'host',
                message: `What's the mysql host you want to set?`,
                default: 'localhost',
            },
            {
                name: 'user',
                message: `What's the mysql user you want to set?`,
                default: 'root',
            },
            {
                name: 'password',
                message: `What's the mysql password you want to set?`,
                default: 'rootmysql',
            },
            {
                name: 'database',
                message: `What's the database you want to set?`,
                default: 'phoenix',
            },
            {
                name: 'tablePrefix',
                message: `What's the table prefix you want to set?`,
                default: '',
            },
        ];
        return this.prompt(prompts).then(props => {
            this.prompts = props;
        });
    }

    writing() {
        this.fs.copyTpl(
            this.templatePath('g-config.json'),
            this.destinationPath('g-config.json'),
            this.prompts
        );
    }
};
