import dom from './domEidt'

import Commponent, { Observable } from './commponent'

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
    Commponent,
    Observable,
    ObjectMap,
    getPageData
}