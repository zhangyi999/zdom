# zdom

一个简单的前端库，用于学习 javascript。

这个项目代码写的很烂，仅只是作为个人练手用，简单实现了 组件和双向绑定，希望路过的大神们多喷一喷。

### run

```bash
> git clone https://github.com/zhangyi999/zdom.git
> npm i
> npm start
```

### build

```bash
> npm run build
> npm run up
```
### UpSever

通过命令上传到服务端

```mv clientConfig-examples.js clientConfig.js'```

修改上传路径。

```
node up -z all
```


### Zdom.0.3

#### 引入 Zdom

```js
import dom,{Obs, Commponent} from './ZDom'
```

##### dom 生成 DOM 元素

`dom` 可以直接生成 Element 原生 DOM。

```js
const div = dom.div({class: 'dom'}, 'this is DOM')

// 返回
<div class='dom'> this is DOM </>
```

##### Obs 数据单位

`Obs` 的作用是把数据组装成 `Obs` 的集合。

```js
const $ = new Obs({
    a: [{ b: '1' }],
    c: '2'
})

// 绑定 dom
dom.div({class: [ 'this ', $.c ]}, $.a.map( v => dom.b({}, v.b )))

// 获取数据 dom
$.data.c === '2' // true

// 修改数据
$.data.c = 1
```

### Example

```js
import dom,{Obs, Commponent} from './ZDom'

let i = 0
function addList( ) {
    this.list.push([{a:99}])
}

function reloadeArr(){
    this.data.date  = !this.data.date
    this.data.list = [{a:i++}]
}

function chengeArr4(){
    this.data.list[0].a = !this.data.list[0].a
    this.data.list[2].a = !this.data.list[2].a
    this.data.deepLisst[0].a.b = this.data.deepLisst[0].a.b + '-'
}

function Test( ...child ) {
    const l1 = this.a
    const l = this.a.map( v => v == true? '2' : '1')
    return (
        dom.div({class: ['dk.k', l]}, l1)
    )
}

const TestCommpent = Commponent(Test)


const lll = []
for ( let i = 0; i < 10; i ++ ) {
    lll.push('sss')
}

function Index() {
    const $ = new Obs({
        date: true,
        list: lll,
        deepLisst: [
            {a:{
                b:'12133'
            }}
        ]
    })
    let i = 0
    const k =  setInterval(() => {
        i ++
        $.data.date = new Date().Format('yyyy.MM.dd hh:mm:ss')
        i > 6? clearInterval(k):''
    }, 1000);
    return (
        dom.div({},
            dom.h2({class:$.date.map( v => v == true? '1':'0' )},'this is demo'),
            dom.div({class: ['ddd ',$.date.map( v => v == true? '1':'0' )]},
                $.date
            ),
            dom.div({},
                dom.h4({},'list'),
                dom.p({}, $.deepLisst.map( v => {
                    return dom.p({}, v.a.b )
                }) ),
                dom.p({}, $.list.map( v => dom.p({}, v.a || v)) )
            ),
            dom.p({},
                dom.a({
                    '@click': addList.bind( $ )
                },'加长列表')
            ),
            dom.p({},
                dom.a({
                    '@click': reloadeArr.bind( $ )
                },'重置')
            ),
            dom.p({},
                dom.a({
                    '@click': chengeArr4.bind( $ )
                },'修改')
            ),
            dom.div({},
                dom.p({}, $.list.map( (v,i) => {
                    if ( v.a === undefined ) return v
                    return TestCommpent({a:v.a.map(v => {
                        return v
                    })})
                }) )
            ),
        )
    )
}

document.getElementById('app').appendChild(Index())
```