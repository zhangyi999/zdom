import Obs from './Obs'
import { ObjectMap } from './public'

function Observable( obj, key, Obs ) {
    Object.defineProperty(obj, key, {
        enumerable: true, // 可枚举
        configurable: true, // fales 不能再define
        get() {
            return Obs.get
        }, 
        set(newVal) {
            Obs.set( newVal )
        }
    });
    return obj
} 

function bindObs( obsDomObj, obsDataObj, key, value ) {
    if ( value instanceof Array ) {
        obsDomObj[key] = []
        obsDataObj[key] = []
        value.map( (v,i) => {
            bindObs( obsDomObj[key], obsDataObj[key], i, v )
        })
        return
    }

    if ( value instanceof Object ) {
        obsDomObj[key] = {}
        obsDataObj[key] = {}
        ObjectMap( value,  (v,i) => {
            bindObs( obsDomObj[key], obsDataObj[key], i, v )
        })
        return
    }
    obsDomObj[key] = new Obs(value)
    Observable( obsDataObj, key, obsDomObj[key] )
}

function initDataObs( Obj ) {
    const obsDom = {}, obsData = {};
    ObjectMap(Obj, (v,k)=>{
        bindObs( obsDom, obsData, k, v )
    })
    return [ obsDom, obsData ]
}

export default initDataObs