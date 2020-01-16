const fs = require('fs');
const prettier = require('prettier');
const  { readFileSync } = fs;


function getNewMenuMsgCode(filePath,keyStr,valueStr){
    const codes = readFileSync(filePath, 'utf-8');
    const jsonContext = codes.substr(codes.indexOf('{'),codes.lastIndexOf('}')-codes.indexOf('{')+1);
    let jsonObject = eval('(' + jsonContext + ')');
    jsonObject[keyStr] = valueStr;
    const newCode= `export default ${JSON.stringify(jsonObject)}  ;`
    return prettier.format(newCode, {
        // format same as ant-design-pro
        singleQuote: true,
        trailingComma: 'all',
        parser: 'typescript',
    });
}

module.exports = localeMsg ={
    getNewMenuMsgCode,
}
