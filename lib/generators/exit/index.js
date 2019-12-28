const BasicGenerator = require('../../BasicGenerator');
const chalk = require('chalk');

module.exports = class extends BasicGenerator {
    writing() {
        console.log(chalk.green(`> exit the program `));
        process.exit(0)
    }
};
