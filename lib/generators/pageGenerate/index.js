const chalk = require('chalk');
const BasicGenerator = require('../../BasicGenerator');


module.exports = class extends BasicGenerator {
    async initializing(){
        this.checkDataStructure();
    }
    writing() {

    }
};
