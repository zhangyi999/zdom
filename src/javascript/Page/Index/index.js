

import dom,{ Commponent, Obs } from '../../ZDom'
    
// import './index.css'
/**
    bug
    2 map 函数中的 Obs 对象 被删除后 无法 恢复，主要需要处理 {} map 中的方法
 */ 
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
        $.data.deepLisst[0].a.b = i
        i > 6? clearInterval(k):''
    }, 1000);

// alert($.date.map)
    return (
        dom.div({},
            dom.h1({class:'z_dom_content'},'new Data'),
            dom.h2({class:$.date.map( v => v == true? '1':'0' )},'this is demo'),
            dom.div({class: ['ddd ',$.date.map( v => v == true? '1':'0' )]}, 
                $.date
                // dom.h4({},'time'),
                // dom.p({}, $.date )
            ),
            
            dom.div({}, 
                dom.h4({},'list',
                    $.deepLisst[0].a.b,
                    dom.b({},$.deepLisst[0].a.b)
                ),
                dom.p({class:$.deepLisst[0].a.b}, $.deepLisst.map( v => {
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

export default Commponent(Index)