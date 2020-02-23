var Client = require('scp2').Client;
const util = require('util');
const SSH = require('simple-ssh');
const exec = util.promisify(require('child_process').exec);
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

const FileName = path => ({
    css : `${path}.css`,
    js: `${path}.js`,
    html : `${path}.html`,
    static: `/static`,
})

function getProcess() {
    const [ file_type = 'index[js/css/html/static]' ] = process.argv.slice(2);
    const [file_name, file_types] = (/(.*?)\[(.*?)\]/.exec(file_type) || ['','']).slice(1,3)
    if(file_name === undefined || file_types === undefined) throw Error('Please enter the correct file format, such as: index[js/css/html/static]')
    const filePath = FileName(file_name)
    const fileNameArr = (file_types === ''?'js/html/css':file_types).split('/').map( v => filePath[v])
    return fileNameArr.join(' ')
}

function zipFile() {
    return exec(`cd ${local_path} && zip -r ${ARCHIVE_NAME} ${getProcess()}`);
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
            await exec(`cd ${local_path} && zip -r ${ARCHIVE_NAME} ${getProcess()}`)
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
        ssh.exec(`unzip -o -d ${service_path} ${service_path}/${ARCHIVE_NAME}.zip`, {
            out: (stdout) => console.log(stdout),
        }).exec(`rm ${service_path}/${ARCHIVE_NAME}.zip`, {
            out: (stdout) => console.log(stdout),
            exit: () => {
                resolve()
            },
        }).on('error', function(err) {
            reject()
            console.log('解压失败')
            ssh.end();
        })
        .start();
    })
}

(async function up() {
    console.log('文件打包...')
    await zipFile()
    await upFile()
    await unzipFile()
    console.log('更新成功')
    process.exit();
})();



