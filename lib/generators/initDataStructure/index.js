const chalk = require('chalk');
const BasicGenerator = require('../../BasicGenerator');

Date.prototype.format = function(fmt){
    const o = {
        "M+" : this.getMonth()+1,                 //月份
        "d+" : this.getDate(),                    //日
        "h+" : this.getHours(),                   //小时
        "m+" : this.getMinutes(),                 //分
        "s+" : this.getSeconds(),                 //秒
        "q+" : Math.floor((this.getMonth()+3)/3), //季度
        "S"  : this.getMilliseconds()             //毫秒
    };

    if(/(y+)/.test(fmt)){
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    }

    for(let k in o){
        if(new RegExp("("+ k +")").test(fmt)){
            fmt = fmt.replace(
                RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
    }
    return fmt;
}


module.exports = class extends BasicGenerator {
    initializing(){
        this.checkConfigFile();
    }

    async writing() {
        const tables=await this.getTablesMap(true);
        const version = this.getAntGVersion();
        const fileName = this.getDataStructureFileName();
        let dataStructure ={
            version,
            tables,
        }
        if(this.fs.exists(fileName)){
            const fs = require('fs');
            const postfix = new Date().format('yyyy-MM-dd-hhmmss');

            console.log(fileName.substr(0,fileName.lastIndexOf('.')))
            const newFileName = `.g/.dataStructure-${postfix}.json`;
            fs.renameSync(fileName, newFileName)
            console.log(chalk.green(`   backup current file to: ${newFileName} `));
        }
        this.fs.writeJSON(fileName,dataStructure);
    }
};
