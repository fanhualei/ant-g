// https://www.imooc.com/article/289744

/**
 * 本函数用来修改多语言文件，这里使用了Babel才进行操作
 * https://www.imooc.com/article/289744
 *
 * https://astexplorer.net/
 *
 * 使用 Babel 进行抽象语法树操作
 * @babel/parser通过该模块来解析我们的代码生成AST抽象语法树；
 * @babel/traverse通过该模块对AST节点进行递归遍历；
 * @babel/types通过该模块对具体的AST节点进行进行增、删、改、查；
 * @babel/generator通过该模块可以将修改后的AST生成新的代码；
 */


const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const {default: traverse} = require('@babel/traverse');
const {default:generate} = require('@babel/generator');
const t = require('@babel/types');
const prettier = require('prettier');

const  { readFileSync, writeFileSync, existsSync } = fs;
const  { join, dirname } = path;

/**
 * 生成代码
 * @param {*} ast
 */
function _generateCode(ast) {
    const newCode = generate(ast, {}).code;
    return prettier.format(newCode, {
        // format same as ant-design-pro
        singleQuote: true,
        trailingComma: 'all',
        parser: 'typescript',
    });
}

/**
 * 得到一个新的资源文件，如果key存在，就更新，如果不存在，就追加一个
 * @param filePath 文件路径
 * @param keyStr   要追加的key
 * @param valueStr 数据
 * @returns {string}
 */
function _getNewLocaleMessageCode(filePath,keyStr,valueStr) {
    const codes = readFileSync(filePath, 'utf-8');
    const ast = parser.parse(codes,{
        sourceType: 'module',
        plugins: ['typescript'],
    })
    traverse(ast,{
        ObjectExpression(path) {
            const { node, parent } = path;
            const { properties } = node;
            let isNewKey = true;
            properties.forEach(p => {
                const { key, value } = p;
                // console.log(`key:${key.value}  value:${value.value}`)
                if (key.value === keyStr) {
                    value.value = valueStr;
                    isNewKey=false;
                }
            });
            if(isNewKey){
                const property = t.objectProperty(t.identifier(`'${keyStr}'`), t.stringLiteral(valueStr));
                path.pushContainer('properties', property);
            }
        },
    });
    const code = _generateCode(ast);
    return code;
}

function getNewMenuLocaleMsgCode(filePath,keyStr,valueStr) {
    return _getNewLocaleMessageCode(filePath,`menu.${keyStr}`,valueStr);
}

module.exports = changeLocaleMessage ={
    getNewMenuLocaleMsgCode,
}

