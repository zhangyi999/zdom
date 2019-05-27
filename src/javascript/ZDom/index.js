import dom from './domEidt'

import Commponent, {replaceStr, Observable} from './commponent'

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

function JoinData( ) {
    const arg = [...arguments];
    let i = 0, len = arg.length;
    const supplementArr = []
    while ( i < len ) {
        i++;
        const argValue = arg[i];
        if ( argValue instanceof Array ) {
            supplementArr.push(...argValue);
            continue;
        }
        supplementArr.push(argValue);
    }
    
    return supplementArr
}

export default dom

export {
    Commponent,
    JoinData,
    Observable,
    ObjectMap,
    getPageData
}