import Obs from './Obs'
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


export default dom

export {
    Obs,
    ObjectMap,
    getPageData
}