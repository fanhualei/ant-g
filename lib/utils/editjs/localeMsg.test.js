const fs = require('fs');
const path = require('path');
const {getNewMenuMsgCode} = require('./localeMsg');

const  { join, dirname } = path;
const getPath = path => join(__dirname, path);



const configPath = getPath('../../../src/locales/zh-CN/menu.ts');


const aaa = getNewMenuMsgCode(configPath,'menu.store.storeHelp.list12','你好123')

console.log(aaa);
