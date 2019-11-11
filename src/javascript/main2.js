
import dom,{Obs} from './ZDom'

/**
    bug
    1 重置的数组 无法 add fixed
    2 add 的数组修改 add 部分元素 会把全部覆盖  fix
    3 list: [
            {a:1}
        ]
        list.a 没有dometree

 */ 
let i = 0
function addList( ) {
    this.list.push([22])
    console.log  ( this )
}

function reloadeArr(){
    this.data.list = [i++]
}
 
function chengeArr4(){
    console.log ( this.data.list[6], this, this.deepLisst )
    // this.list[6].__set({a:('sdffff')}) // 
    this.list[6].a.__set(dom.b({},'this is 4'))
    // this.deepLisst[0].__set({a:{b:'33333'}})
}

function Index() {
    const $ = new Obs({
        // date: '--',
        list: [
            1,
            // 3,
            // 5,
            // {a:1},
            // {a:1},
            // {a:1},
            // {a:1}
        ],
        // deepLisst: [
        //     {a:{
        //         b:'12133'
        //     }}
        // ]
    })
    let i = 0
    // const k =  setInterval(() => {
    //     i ++
    //     console.log ( $ )
    //     $.data.date = new Date().Format('yyyy.MM.dd hh:mm:ss')
    //     // i > 6? clearInterval(k):''
    // }, 1000);
    return (
        dom.div({},
            dom.h2({},'this is demo'),
            dom.div({}, 
                dom.h4({},'time'),
                // dom.p({}, $.date )
            ),
            dom.div({}, 
                dom.h4({},'list'),
                // dom.p({}, $.date ),
                dom.p({}, $.list )
            ),
            dom.div({}, 
                dom.h4({},'list'),
                // dom.p({}, $.deepLisst.map( v => {
                //     console.log ( v.a ,'cccssss')
                //     return dom.p({}, v.a.b )
                // }) ),
                // dom.p({}, $.list.map( v => dom.p({}, v.a || v)) )
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
            )
            
        )
    )
}

document.getElementById('app').appendChild(Index())