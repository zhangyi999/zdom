
import dom,{Obs, Commponent} from './ZDom'

/**
    bug
    2 map 函数中的 Obs 对象 被删除后 无法 恢复，主要需要处理 {} map 中的方法
 */ 
let i = 0
function addList( ) {
    this.list.unshift([{a:99}])
    console.log  ( this )
}

function reloadeArr(){
    this.data.date  = !this.data.date
    console.log ( this.data.list)
    this.data.list = [{a:i++}]
}
 
function chengeArr4(){
    // console.log ( this.data.list[6], this, this.deepLisst )
    // this.list[6].__set({a:('sdffff')}) // 
    // this.data.list[6].a = (dom.b({},'this is 4'))
    // this.data.deepLisst[0] = ({a:{b:'33333'}})

    console.log ( this.list )
    this.data.list[0].a = !this.data.list[0].a
    this.data.list[2].a = !this.data.list[2].a
    console.log(
        this.list[2].a ,'sdfsdfds'
    )
}

function Test( ...child ) {
    // const dk = new Obs({k: 'sdffssd'})
    // console.log ( this)
    // setTimeout(() => {
    //     dk.data.k = 123312
    //     this.props.a = 21332213 
    // }, 4000);
    console.log ( this )
    return (
        dom.div({class: ['dk.k', this.a.map( v => v == true? '2' : '1')]}, this.a)
    )
}

const TestCommpent = Commponent(Test)

function Index() {
    const $ = new Obs({
        date: true,
        list: [ dom.p({}, 'load') ],
        // deepLisst: [
        //     {a:{
        //         b:'12133'
        //     }}
        // ]
    })
    let i = 0
    console.log ( $ )
    // const k =  setInterval(() => {
    //     i ++
    //     console.log ( $ )
    //     $.data.date = new Date().Format('yyyy.MM.dd hh:mm:ss')
    //     i > 6? clearInterval(k):''
    // }, 1000);
    return (
        dom.div({},
            dom.h2({class:$.date.map( v => v == true? '1':'0' )},'this is demo'),
            dom.div({class: ['ddd ',$.date.map( v => v == true? '1':'0' )]}, 
                $.date.map( v => v == true? '1':'0' )
                // dom.h4({},'time'),
                // dom.p({}, $.date )
            ),
            dom.div({}, 
                // dom.h4({},'list'),
                // TestCommpent({a:$.date}),
                // dom.p({}, $.list[0].a ),
                dom.p({}, $.list.map( (v,i) => {
                    // console.log ( v, i, 'vvvssss' )
                    if ( v.a === undefined ) return v
                    return TestCommpent({a:v.a.map(v => {
                        console.log ( v, 'vvvssss1' )
                        return v 
                    })}) 
                    // return dom.input({class:v.a,checked: v.a, type:'checkbox'})
                }) )
            ),
            // dom.div({}, 
            //     dom.h4({},'list'),
            //     // dom.p({}, $.deepLisst.map( v => {
            //     //     console.log ( v ,'cccssss')
            //     //     return dom.p({}, v.b )
            //     // }) ),
            //     // dom.p({}, $.list.map( v => dom.p({}, v.a || v)) )
            // ),
            
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
            )
            
        )
    )
}

document.getElementById('app').appendChild(Index())