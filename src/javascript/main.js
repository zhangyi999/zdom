import dom,{
    Commponent,
    Observable,
    ObjectMap,
    getPageData
} from './ZDom'

import './init.css'

// 组件
function header( ...child ) {
    return (
        dom.h1({class: 'z_dom_header'}, child )
    )
}
const Header = Commponent(header)

// 数据绑定
function content( ) {
    const times = this.data('time', new Date().Format('yy.MM.dd hh:mm:ss'))
    // this.loaded = () => {
    //     setInterval(()=>{
    //         this.data.time = new Date().Format('yy.MM.dd hh:mm:ss')
    //     },1000)
    // }
    return (
        dom.div({class: 'z_dom_content'},
            dom.p({},'the time now'),
            dom.h2({}, times )
        )
    )
}
const Content = Commponent(content)

// 组件套用
function childCommponent( ) {
    return (
        dom.div({
            class: [ this.data.class , ' <l' ]
        },
            dom.p({},'this is childCommponent')
        )
    )
}
const ChildCommponent = Commponent(childCommponent)

function prantCommponent( ...child ) {
    return (
        dom.div({
            class : [ this.data.class , ' z_dom_prantcommponent ']
        },
            dom.p({},'this is PrantCommponent'),
            ChildCommponent({
                class: [ this.data.class , ' <z']
            }),
            child,
            dom.div({},
                // this.data.list.mapA( v => dom.p({},
                //     dom.b({},v.b),
                //     dom.span({},v.s)
                // ))
            )
        )
    )
}
const PrantCommponent = Commponent(prantCommponent)

const statics = Observable();
var a = '111'
function Index() {
    const {
        img,
        list
    } = statics.data({
        img: 'a',
        list: [
            true,
            false
        ]
    })
    // console.log(img)
    return (
        dom.div({class:'z_dom_index'},
            // Header({},'hello word!'),
            // Content({list}),
            PrantCommponent({ 
                class: [ statics.data('pantent','a') ],
                list
            }),
            dom.img({src: [ './static/img/',img,'.jpg' ] }),
            dom.a({
                '@click': change
            },'修改 arr'),
            dom.a({
                '@click': change1
            },'修改 0'),
            dom.h1({$innerHTML: [ '<p>', img, '</p>']}),
            list.mapA( v => {
                console.log(v)
                return dom.input({
                    type: 'checkbox',
                    checked: v 
                } )
            })
        )
    )
}

function change1() {
    statics.data.list.replace(1,[true])
}

function change() {
    statics.data.img = 'g'

    statics.data.list = [
        {b:1,s:3},
        {b:1,s:5},
        {b:1,s:4}
    ]
    // console.log(statics.data.pantent)

    // console.log([statics.data.list])
}

setTimeout(()=>{
    a  = '22222'
    statics.data.pantent = 'b'
},5000)

document.getElementById('app').appendChild(Index())
