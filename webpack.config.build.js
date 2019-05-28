const path = require('path'); 
const CopyWebpackPlugin = require('copy-webpack-plugin') 
const CleanWebpackPlugin = require('clean-webpack-plugin') // 清空打包目录的插件 
const HtmlWebpackPlugin = require('html-webpack-plugin') // 生成html的插件
const uglifyjs = require('uglifyjs-webpack-plugin');
// const ExtractTextWebapckPlugin = require('extract-text-webpack-plugin') //CSS文件单独提取出来 
const ExtractTextWebapckPlugin = require('mini-css-extract-plugin')

const  index = 'src'

module.exports = { 
    entry: { 
        index: path.resolve(__dirname, './'+index+'/javascript', 'main.js'), //"/"+index+"/javascript/main.js"
        // vendor:'lodash' // 多个页面所需的公共库文件，防止重复打包带入 
    }, 
    output:{ 
        // publicPath: __dirname+'/static', //这里要放的是静态资源CDN的地址 
        path: __dirname+'/build/', //这里会把 js css html 三个文件放到一起
        filename:'[name].js' 
    }, 
    resolve:{ 
        extensions: [".js",".css",".json"]
    }, 
    module: { 
        // 多个loader是有顺序要求的，从右往左写，因为转换的时候是从右往左转换的 
        rules:[
            { 
                test: /(\.jsx|\.js)$/, 
                use: { 
                    loader: "babel-loader", 
                    options: { 
                        presets: [ "es2015"],
                        "plugins": [
                            'transform-runtime',
                            "transform-async-to-generator",
                            'transform-decorators-legacy'
                        ],
                        babelrc: false
                    } 
                }, 
                exclude: /node_modules/ 
            }, 
            { 
                test: /\.css$/, 
                use: [
                    {
                        loader: ExtractTextWebapckPlugin.loader,
                        options: {
                            minize: true
                        }
                    },
                    "css-loader"
                ]
            },
            { 
                //file-loader 解决css等文件中引入图片路径的问题 
                // url-loader 当图片较小的时候会把图片BASE64编码，大于limit参数的时候还是使用file-loader 进行拷贝 
                test: /\.(png|jpg|jpeg|gif|svg)/, 
                use: { 
                    loader: 'url-loader', 
                    options: { 
                        outputPath: '../', 
                        publicPath: __dirname+'/'+index+'/img'
                        // 图片输出的路径 limit: 1 * 1024 
                    } 
                } 
            }
        ] 
    }, 
    plugins: [ 
        // 多入口的html文件用chunks这个参数来区分 
        new HtmlWebpackPlugin({ 
            template: './'+index+'/index.html', 
            filename:'index.html', 
            chunks:['index'], 
            hash:true,
            //防止缓存 
            minify:{ 
                removeAttributeQuotes:true//压缩 去掉引号 
            } 
        }),
        new uglifyjs(),//压缩
        new ExtractTextWebapckPlugin({
            filename: '[name].css'
        }),
        new CopyWebpackPlugin([{
            from: './src/static',
            to: './static',
        }]),
        new CleanWebpackPlugin(
            ['build/*'],　 //匹配删除的文件
            {
                root: __dirname,       　　　　　　　　　　//根目录
                verbose:  true,        　　　　　　　　　　//开启在控制台输出信息
                dry:      false        　　　　　　　　　　//启用删除文件
            }
        ),
        
    ], 
    devtool:  'cheap-module-source-map',//'eval-source-map',//
    devServer: { 
        contentBase: "./app", //静态文件根目录 
        port: 9905, // 端口 
        host: 'localhost', 
        overlay: true, 
        compress: false, // 服务器返回浏览器的时候是否启动gzip压缩 
    }, 
    watchOptions: { 
        ignored: /node_modules/, //忽略不用监听变更的目录 
        aggregateTimeout: 500, //防止重复保存频繁重新编译,500毫米内重复保存不打包 
        poll:1000 //每秒询问的文件变更的次数 
    }, 
}

