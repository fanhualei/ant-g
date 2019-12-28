const BasicGenerator = require('../../BasicGenerator');

module.exports = class extends BasicGenerator {
    writing() {
        this.fs.copyTpl(
            this.templatePath('utils/Wk'),
            this.destinationPath('src/utils/Wk')
        );
        this.fs.copyTpl(
            this.templatePath('components/Wk'),
            this.destinationPath('src/components/Wk')
        );
    }
};
