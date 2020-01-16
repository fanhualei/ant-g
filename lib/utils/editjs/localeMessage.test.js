const fs = require('fs');
const path = require('path');
const {getNewMenuMsgCode} = require('./localeMessage');

const  { join, dirname } = path;
const getPath = path => join(__dirname, path);



const configPath = getPath('../../../src/locales/zh-CN/menu.ts');


const aaa = getNewMenuMsgCode(configPath,'store.fanhl','你好')

console.log(aaa);
