const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const mkdirp = require('mkdirp');
const inquirer = require('inquirer');
const clipboardy = require('clipboardy');


const menuOrder={
    "init": 10,
    "dependencies": 20,
    "service": 30,
    "mock": 40,
    "exit": 100,
}

const getGenerators=()=> {
    let ren= fs
        .readdirSync(`${__dirname}/generators`)
        .filter(f => !f.startsWith('.'))
        .map(f => {
            return {
                name: `${f.padEnd(15)} - ${chalk.gray(require(`./generators/${f}/meta.json`).description)}`,
                value: f,
                short: f,
            };
        });
    ren=ren.sort((a,b)=>{
        const aOrder=menuOrder[a.value]?menuOrder[a.value]:500;
        const bOrder=menuOrder[b.value]?menuOrder[b.value]:500;
        return aOrder - bOrder
    })
    return ren;
}

const generators = getGenerators();



const runGenerator = async (generatorPath, { name = '', cwd = process.cwd(), args = {} }) => {
    return new Promise(resolve => {
        if (name) {
            mkdirp.sync(name);
            cwd = path.join(cwd, name);
        }

        const Generator = require(generatorPath);
        const generator = new Generator({
            name,
            env: {
                cwd,
            },
            resolved: require.resolve(generatorPath),
            args,
        });

        return generator.run(() => {
            if (name) {
                if (process.platform !== `linux` || process.env.DISPLAY) {
                    clipboardy.writeSync(`cd ${name}`);
                    console.log('📋 Copied to clipboard, just use Ctrl+V');
                }
            }
            console.log('✨ File Generate Done');
            resolve(true);
            process.exit(10)
        });
    });
};

const run = async config => {
    process.send && process.send({ type: 'prompt' });
    process.emit('message', { type: 'prompt' });

    let { type } = config;
    if (!type) {
        const answers =
            await inquirer.prompt([
            {
                name: 'type',
                message: 'Select the boilerplate type',
                type: 'list',
                choices: generators,
            },
        ]);
        type = answers.type;
    }

    try {
        return runGenerator(`./generators/${type}`, config);
    } catch(e) {
        console.error(chalk.red(`> Generate failed`), e);
        process.exit(1);
    }
};

module.exports = run;
