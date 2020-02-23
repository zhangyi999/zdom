var Client = require('scp2').Client;
const util = require('util');
const SSH = require('simple-ssh');
const exec = util.promisify(require('child_process').exec);
const fs = require('fs');
const path = require('path');

const Config = require('./clientConfig')


const local_path = __dirname + '/build/'
const service_path = Config.service_path
const _http = Config.host
const ARCHIVE_NAME = 'build'
const USER = Config.username
const PASSWORD = Config.password

const client = new Client({
    port: '22',
    host: _http,
    username: USER,
    password: PASSWORD,
});

function zipFile( filesArr ) {
    return exec(`cd ${local_path} && zip -r ${ARCHIVE_NAME} ${filesArr.join(' ')}`);
}

function upLoad(file_name) {
    return new Promise((resolve, j) => {
        client.upload(local_path+file_name, service_path+file_name,resolve)
    })
}

async function upFile() {
    return new Promise((resolve, reject) => {
        console.log('链接：'+_http+'中...')
        client.sftp(async function(err,sftp){
            console.log(_http+' 链接成功')
            console.log('---------------')
            const fileArr = ARCHIVE_NAME+'.zip'//getProcess()
            console.log('开始上传:'+fileArr)
            console.log('---------------')
            const s = await upLoad(fileArr)
            await exec(`cd ${local_path} && rm -rf ${ARCHIVE_NAME}.zip`)
            if(s === null) {
                console.log(fileArr+' 上传成功！')
                console.log('---------------')
                resolve()
            } else {
                reject()
            }
        })
    })
}

function unzipFile() {
    const ssh = new SSH({
        host: _http,
        user: USER,
        pass: PASSWORD,
    });
    return new Promise((resolve, reject) => {
        ssh.exec(`unzip -o ${service_path}${ARCHIVE_NAME}.zip -d ${service_path}`, {
            out: (stdout) => console.log(stdout),
        })
        .exec(`rm -rf ${service_path}${ARCHIVE_NAME}.zip`, {
            out: (stdout) => console.log(stdout),
            exit: () => {
                resolve()
            },
        })
        .on('error', function(err) {
            reject()
            console.log('解压失败')
            ssh.end();
        })
        .start();
    })
}

// 列出可压缩的文件夹
function getDirectories( fn ) {
    const d = []
    fs.readdirSync(local_path).filter(function(file, i) {
        if ( !(fn instanceof Function)){
            file !== '.DS_Store' ? d.push(file) : ''
        } else if ( fn( i, file ) ) {
            file !== '.DS_Store' ? d.push(file) : ''
        } 
    });
    return d
}

// 上传文件并解压
async function upFileToSever( ) {
    await upFile()
    await unzipFile()
}

module.exports = {
    getDirectories,
    zipFile,
    upFileToSever
}
