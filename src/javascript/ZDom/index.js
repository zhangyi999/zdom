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
        props.props = {}
        ObjectMap( attr, (v,key) => {
            if ( v instanceof Obs ) {
                Object.defineProperty(props.props, key, {
                    enumerable: true, // 可枚举
                    configurable: true, // fales 不能再define
                    get() {
                        return attr[key].data
                    },
                    set(newVal) {
                        attr[key].data = newVal
                    }
                })
                addPorto(props, key, v)
                
            } else props.props[k] = v
        })
        const dom = ZDomCommponFunction.call(props, chlid);
        props.loaded?setTimeout(()=> props.loaded(),0):''; 
        props.die?dom.ondie = props.die:'';
        return dom
    }
}


export default dom

export {
    Obs,
    ObjectMap,
    getPageData,
    Commponent
}