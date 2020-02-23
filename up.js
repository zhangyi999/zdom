var program = require('commander')
const upfile = require('./toCline')

async function getList() {
    const li = await upfile.getDirectories()
    console.table( li )
    return li
}

async function getLists( arg ) {
    let li ;
    if ( /all/.test(arg) ) {
        arg = arg.split('^')
        if( arg.length === 1 ) {
            li = await upfile.getDirectories()
        } else {
            const df = new RegExp(arg[1].replace(/,/g,'|'))
            li = await upfile.getDirectories( (i,f) => !df.test(f))
        }
    } else {
        const index = arg.split(',')
        li = await upfile.getDirectories( i => index.includes(i + ''))
    }
    return li
}

async function zipFile( arg ) {
    const file = await getLists( arg );
    console.table( file )
    await upfile.zipFile(file)
    await upfile.upFileToSever()
    console.log('更新成功')
    process.exit();
}

program
    .version('0.0.1')
    .description('一个简单 UI')
    .option('-l, --list', '显示可以打包的文件', getList)
    .option('-z, --zip <file>', '打包指定文件，传到服务端解压。 file: 0,1,2,3,4 || all || all^.map,.js', zipFile)


program.parse(process.argv)
