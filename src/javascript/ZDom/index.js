import './polyfill'
import Obs,{addPorto} from './Obs'
import dom from './newDomEidt'

import {ObjectMap} from './public'

function getPageData() {
    const page = window.location.search.replace('?','');
    const data = {}
    page.split('&').map( v => {
        if ( v === undefined ) return
        const obj = v.split('=') 
        data[obj[0]] = obj[1]
    })
    return data
}

function Commponent(ZDomCommponFunction) {
    return function ( attr, ...chlid ) {
        const props = {}
        addPorto(props, 'props', {})
        ObjectMap( attr, (v,key) => {

            if ( v instanceof Obs ) {
                Object.defineProperty(props.props, key, {
                    enumerable: true, // 可枚举
                    configurable: true, // fales 不能再define
                    get() {
                        return attr[key].data
                    },
                    set(newVal) {
                        attr[key].__set(newVal)
                    }
                })
                // addPorto(props, key, v, {writable:true, enumerable: true}) 
            } 
            addPorto(props, key, v, {writable:true, enumerable: true})
        })
        const dom = ZDomCommponFunction.call(props, chlid);
        props.loaded?setTimeout(()=> props.loaded(),0):''; 
        props.die?dom.$ondie = props.die:'';
        return dom
    }
}


export default dom

export {
    Obs,
    ObjectMap,
    getPageData,
    Commponent,
    addPorto
}