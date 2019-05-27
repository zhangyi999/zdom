import dom,{
    Commponent,
    JoinData,
    Observable,
    ObjectMap,
    getPageData
} from './ZDom'

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
    this.loaded = () => {
        setInterval(()=>{
            this.data.time = new Date().Format('yy.MM.dd hh:mm:ss')
        },1000)
    }
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
            class: JoinData( this.data.class , ' <l')
        },
            dom.p({},'this is childCommponent')
        )
    )
}
const ChildCommponent = Commponent(childCommponent)

function prantCommponent( ...child ) {
    return (
        dom.div({
            class : JoinData( this.data.class , ' z_dom_prantcommponent ')
        },
            dom.p({},'this is PrantCommponent'),
            ChildCommponent({
                class: JoinData( this.data.class , ' <z')
            }),
            child
        )
    )
}
const PrantCommponent = Commponent(prantCommponent)

const statics = Observable();
var a = '111'
const ks = {
    get: () => {
     return a
    }
}
function Index() {
    return (
        dom.div({class:'z_dom_index'},
            Header({},'hello word!'),
            Content({}),
            PrantCommponent({ class: JoinData(statics.data('pantent','a'), ks )})
        )
    )
}
setTimeout(()=>{
    a  = '22222'
    statics.data.pantent = 'b'
},5000)

document.getElementById('app').appendChild(Index())