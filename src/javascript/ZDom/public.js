export function ObjectMap(obj, call) {
    if ( obj === undefined ) return 
    const res = {}
    const keys = Object.keys(obj)
    const len = keys.length
    for(let i = 0; i < len; i ++) {
        const key = keys[i]
        let val = obj[key]
        const r = typeof call === 'function'?call(val, key):''
        r?res[key] = r:''
    }
    return res
}