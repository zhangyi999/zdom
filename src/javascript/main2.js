
import dom,{Obs} from './ZDom'

/**
    bug
    1 map 函数v只能用 获取 最底层数据 
 */ 
let i = 0
function addList( ) {
    this.list.push([{a:1}])
    console.log  ( this )
}

function reloadeArr(){
    this.data.date  = (i++)
    this.data.list =' [{a:1}]'
}
 
function chengeArr4(){
    // console.log ( this.data.list[6], this, this.deepLisst )
    // this.list[6].__set({a:('sdffff')}) // 
    // this.data.list[6].a = (dom.b({},'this is 4'))
    // this.data.deepLisst[0] = ({a:{b:'33333'}})

    console.log ( this.data.list )
    this.data.list[3].a = !this.data.list[3].a
    console.log(
        this.list[0]
    )
}

function Index() {
    const $ = new Obs({
        date: '--',
        list: [
            // 1,
            // 3,
            // 5,
            // {a:'true'},
            // false,
            {a:false},
            // {a:true},
            // {a:true}
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
    //     i > 6? clearInterval(k):''
    // }, 1000);
    return (
        dom.div({},
            // dom.h2({},'this is demo'),
            dom.div({}, 
                // dom.h4({},'time'),
                dom.p({}, $.date )
            ),
            dom.div({}, 
                // dom.h4({},'list'),
                dom.p({}, $.list[0].a ),
                dom.p({}, $.list.map( v => {
                    console.log ( v, 'vvvvv' )
                    return dom.input({type: 'checkbox',checked:v.a || v, class: v.a || v }) 
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