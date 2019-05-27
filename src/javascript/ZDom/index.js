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

function JoinData( data, str ) {
    if ( data === undefined ) return str;
    str = str.match(/{\S*?}/g) === null ? '{v} '+str:str;
    if ( typeof data === 'string' || typeof data === 'number' ) { 
        return replaceStr( data , str );
    }
    if ( data.joinStr ) {
        data.joinStr(str);
        return data;
    }
}

export default dom

export {
    Commponent,
    JoinData,
    Observable,
    ObjectMap,
    getPageData
}