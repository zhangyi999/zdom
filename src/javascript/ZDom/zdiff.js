import checkTypes from './types'
/**
 * @param { Object } oldData
 * @param { Object } newData
 * @return [
 *  { props: Object, key: string | number | boolean, newAlue: string | number | boolean}
 * ]
 */
function getDiff( oldData, newData ) {
    const diffArr = [];
    if ( oldData == newData ) return diffArr
    if ( checkTypes(oldData) === 'Array' &&  checkTypes(newData) === 'Array' ) {
        const olen = oldData.length
        const nlen = newData.length
        const mlen = Math.max( olen, nlen )
        for ( let i = 0; i < mlen; i++ ) {
            if ( getDiff( oldData[i], newData[i] ) === true ) {
                diff = true
                break; 
            }
        }
        return diff
    }
    if ( checkTypes(oldData) === 'Object' &&  checkTypes(newData) === 'Object' ) { 
        for ( let i in  oldData ) {
            if ( getDiff( oldData[i], newData[i] ) === true ) {
                diff = true
                break; 
            }
        }
        return diff
    }
    if ( oldData != newData ) {
        diffArr.push({
            props: oldData,
            key: '',
            newValue: newData
        })
        return diffArr
    }
}

function diffDate( oldData, newData, key ) {
    const oldD = oldData[key]
    const newD = newData[key]
    if ( oldD == newD ) return false
    let type = 'update'
    if ( oldD === undefined && newD !== undefined ) type = 'add'
    if ( oldD !== undefined && newD === undefined ) type = 'remove'
    if ( oldD != newD ) return {
        type,
        props: oldData,
        key,
        newValue: newD
    }
}

const vdom = {
    type: 'div',
    attr: {},
    childs: [],
    $el: document.createElement(this.type),
    data: {},
    change () {}
}