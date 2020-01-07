const fs = require('fs');
const path = require('path');
const {writeNewRoute} = require('./writeNewRoute');

const  { join, dirname } = path;
const getPath = path => join(__dirname, path);

console.log('--------------------------------------')


const configPath = getPath('../../config/config.ts');

console.log(configPath)

writeNewRoute(
    {
        name: 'demo111',
        icon: 'smile',
        path: `/demo/aaa`,
        component: `/demo/aaa`,
    },
    configPath,
    'dddddddddddddddddd'
)





