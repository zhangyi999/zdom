import Obs, {addPorto} from './Obs'
import { ObjectMap } from './public'

function Observable( obj, key, obsDomObj, value ) {
    let old = value
    Object.defineProperty(obj, key, {
        enumerable: true, // 可枚举
        configurable: true, // fales 不能再define
        get() {
            return old
        }, 
        set(newVal) {
            old = newVal
            console.log(obsDomObj, key, newVal, 'newVal' )
            // if( obsDomObj instanceof Obs ) {
            //     console.log ( obsDomObj.get[key] )
            //     obsDomObj.get[key].set( newVal )
            // } else {
            //     obsDomObj[key].set( newVal )
            // }
            
            // bindObs( obsDomObj, obj, key, newVal )

            obsDomObj.get[key].set( newVal )
        }
    });
    return obj
} 

function bindObs( obsDomObj, obsDataObj, key, value ) {
    if ( value instanceof Array ) {
        obsDomObj[key] = new Obs([])
        Observable( obsDataObj, key, obsDomObj , [] )
        addPorto(obsDataObj[key], 'add', newArr => {
            const len = obsDataObj[key].length
            obsDomObj[key].push(newArr)
            newArr.map( (v,i) => {
                bindObs( obsDomObj[key], obsDataObj[key], len + i  , v )
            })
        })
        value.map( (v,i) => {
            bindObs( obsDomObj[key], obsDataObj[key], i, v )
        })
        return
    }

    if ( value instanceof Object ) {

        if ( obsDomObj instanceof Obs ) {
            obsDomObj.get[key] = new Obs({})
        } else {
            obsDomObj[key] = new Obs({})
        }
        Observable( obsDataObj, key, obsDomObj , {} )
        ObjectMap( value,  (v,i) => {
            bindObs( obsDomObj instanceof Obs?obsDomObj.get[key]:obsDomObj[key], obsDataObj[key], i, v )
        })
        return
    }

    obsDomObj instanceof Obs ? obsDomObj.get[key] = new Obs(value) : obsDomObj[key] = new Obs(value)
    Observable( obsDataObj, key, obsDomObj , value )    
}

/**
g: [
        {a:'123'},
        // {a:'123231'}
    ],

new Obs([
    new Obs({
        a:new Obs(23)
    })
]) 
*/

function initDataObs( Obj ) {
    const obsDom = {}, obsData = {};
    ObjectMap(Obj, (v,k)=>{
        bindObs( obsDom, obsData, k, v )
    })
    return [ obsDom, obsData ]
}

export default initDataObs