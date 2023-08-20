#!/usr/bin/env node
// 进度
const ora = require('ora');
// 字体
const chalk = require('chalk');
// 命令行交互
const { Command, Argument } = require('commander');
const inquirer = require('inquirer');

const program = new Command();

program
    .name('create-template-cli')
    .version('1.0.0', '-v, --version')

program.parse()

// 下载方法
const { rmdirSync } = require('fs');
const downloadGitRepo = require('download-git-repo');

function download(url, projectName = 'template') {
    const path = `${process.cwd()}/${projectName}`;
    console.log(path);
    return new Promise((resolve, reject) => {
        rmdirSync( path, { recursive: true, force: true })
        downloadGitRepo(`direct:${url}`, path, { clone: true }, err => {
            if (err) return reject(err);
            resolve();
        })
    })
}

// 配置
// 技术类型列表
const typeList = [
    { name: 'vue3', value: 'vue3'},
    { name: 'h5', value: 'h5'},
    { name: '小程序', value: 'miniProgram'},
    { name: 'vue2', value: 'vue3'}
]

// 路径地址
const pathMap = {
    'vue3': 'http://git.17usoft.com/elonghotel/front-end-template.git'
}

// 交互
inquirer.prompt([
    {
        type: 'input',
        message: '设置一个项目名称:',
        name: 'name',
        default: "template"
    }
]).then((inputVal) => {
    const { name } = inputVal;
    // 选择框架
    inquirer.prompt([
        {
            type: 'list',
            name: 'value',
            message: '请选择你想要操作的任务？',
            choices: typeList
        },
    ]).then((answer) => {
        const { value } = answer;
        if (!config.pathMap[value]) {
            console.warn('暂时不支持当前技术栈,敬请期待!');
            return;
        }
        let start = Date.now(), end;
        const spinner = ora(chalk.hex('#DEADED').bold("👻 I'm trying......")).start();
        download(pathMap[value], name).then(res => {
            end = Date.now();
            console.log(chalk.green.bold(`success in ${(end - start) / 1000} s`));
        }).finally(() => {
            spinner.stop();
        });
    });
});


