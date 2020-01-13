const fs = require('fs');
const path = require('path');
const {getNewMenuLocaleMsgCode} = require('./changeLocaleMessage');

const  { join, dirname } = path;
const getPath = path => join(__dirname, path);



const configPath = getPath('../../../src/locales/zh-CN/menu.ts');


const aaa = getNewMenuLocaleMsgCode(configPath,'store.fanhl','123456789')

console.log(aaa);
