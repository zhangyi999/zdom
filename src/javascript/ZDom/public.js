import checkTypes from './types'

export function ObjectMap(obj, call) {
    if ( obj === undefined ) return 
    const res = obj instanceof Array ? [] : {}
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


export function ObjectMapFull( obj, call,  {filter} = {} ) {
    
    if ( typeof obj !== 'object' ) return obj
    return ObjectMap(obj, (v, k) => {
        if ( filter && obj instanceof filter ) return call(v, k)
        if ( checkTypes( v ) === 'Object') return ObjectMapFull(v, call, {filter})
        if ( checkTypes( v ) === 'Array' ) return v.map( v => ObjectMapFull( v, call , {filter}))
        return call(v, k)
    })
}

if (!Array.prototype.flat) {
    Object.defineProperty(Array.prototype, 'flat', {
        value: function(depth) {
            let res = [],
                depthArg = depth || 1,
                depthNum = 0,
                flatMap = (arr) => {
                    arr.map((element, index, array) => {
                        if(Object.prototype.toString.call(element).slice(8, -1) === 'Array'){
                            if(depthNum < depthArg){
                                depthNum++;
                                flatMap(element);
                            }else{
                                res.push(element);
                            }
                        }else{
                            res.push(element);
                            if(index === array.length -1) depthNum = 0;
                        }
                    });
                };
            flatMap(this);
            return res;
        }
    });
}