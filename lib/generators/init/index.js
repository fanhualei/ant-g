const chalk = require('chalk');
const BasicGenerator = require('../../BasicGenerator');


module.exports = class extends BasicGenerator {
    async initializing(){
        if(this.existConfigFile()){
            this.exitByError(`✘ the file g-config.json is exists,you need to delete it manually `)
        }
    }
    writing() {
        this.fs.copyTpl(
            this.templatePath('g-config.json'),
            this.destinationPath('g-config.json')
        );
    }
};
