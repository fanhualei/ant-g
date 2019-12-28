const BasicGenerator = require('../../BasicGenerator');
const chalk = require('chalk');

module.exports = class extends BasicGenerator {
    writing() {
        console.log(chalk.green(`> Exit the program `));
        process.exit(0)
    }
};
