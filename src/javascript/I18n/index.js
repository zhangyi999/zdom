import dom, {Commponent,Obs} from '../ZDom'

import Config from './config.json'

let TYPE = 0

// 使用 C.data 获取静态文案，不影响性能，但不能动态改变
const C = new Obs(lunger())

// 当前语种
function getType() {
    return [ TYPE, Config.type[TYPE] ]
}

// 获取当前语种列表
function lunger() {
    const l = {}
    const c = Config.cont
    Object.keys(Config.cont).map( k => {
        l[k] = c[k][TYPE]
    })
    return l
}

// 切换语种
function checkoutType( type = 0 ) {
    if ( type === TYPE ) return
    TYPE = type
    C.data = lunger()
}

function checkoutTypeByCn( type = 'cn' ) {
    checkoutType( Config.type.indexOf(type) ) 
}



// 自动切换
function autoCheckout() {
    const len = Config.type.length
    const t = TYPE === len - 1 ? 0 : TYPE + 1
    checkoutType( t )
}


export {
    checkoutType,
    autoCheckout,
    checkoutTypeByCn,
    C,
    getType
}