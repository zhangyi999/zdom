import checkTypes from './types'
import { ObjectMap } from './public'

function Observable( obj, key, obs ) {
    Object.defineProperty(obj, key, {
        enumerable: true, // 可枚举
        configurable: true, // fales 不能再define
        get() {
            return obs[key].__get
        },
        set(newVal) {
            obs[key].__set(newVal)
        }
    });
    return obj
}

// return ture is diff status
function isDiff( oldData, newData ) {
    if ( oldData == newData ) return false
    let diff = false
    if ( checkTypes(oldData) === 'Array' &&  checkTypes(newData) === 'Array' ) {
        const olen = oldData.length
        const nlen = newData.length
        if ( olen !== nlen ) return true
        for ( let i = 0; i < olen; i++ ) {
            if ( isDiff( oldData[i], newData[i] ) === true ) {
                diff = true
                break; 
            }
        }
        return diff
    }
    if ( checkTypes(oldData) === 'Object' &&  checkTypes(newData) === 'Object' ) { 
        for ( let i in  oldData ) {
            if ( isDiff( oldData[i], newData[i] ) === true ) {
                diff = true
                break; 
            }
        }
        return diff
    }
    if ( oldData != newData ) return true
}

function addPorto(obj, key, val, {enumerable, configurable, writable} = {}) {
    Object.defineProperty(obj, key, {
        enumerable: enumerable || false,
        configurable: configurable || false,
        writable: writable || false,
        value: val
    })
}

function bindObs( obsDomObj, obsObj, key, value ) {
    Observable( obsObj, key, obsDomObj )
    if ( value instanceof Array ) {
        obsDomObj[key] = new Obs(value)
        value.map( (v,i) => {
            bindObs( obsDomObj[key], obsObj[key], i, v )
        })
        return
    }
    if ( value instanceof Object ) {
        obsDomObj[key] = new Obs(value)
        // Observable( obsDataObj, key, obsDomObj , value )
        ObjectMap( value,  (v,i) => {
            bindObs( obsDomObj[key], obsObj[key], i, v )
        })
        return
    }
    obsDomObj[key] = new Obs(value)
    // Observable( obsObj, key, obsDomObj ) 
}

// 数据绑定最小单位
// domtree: 0 | 从头部增加，1 | 从尾部增加， 2 | 删除，3 | 替换  
class Obs {
    constructor( valueAny ) {
        // this.renders = [] 
        // this.domtree = []
        // this.attrtree = []
        // this.watch = []
        addPorto(this, 'domtree', [])
        addPorto(this, 'attrtree', [])
        addPorto(this, 'watch', [])
        addPorto(this, 'renders', [])
        // addPorto(this, 'data', valueAny, {writable:true})
        addPorto(this, '__get', valueAny, {writable:true})
        addPorto(this, '__set', ( newValue ) => {
            
            // if ( newValue === null ) return this.rmove()
            if ( isDiff( newValue, this.__get ) === false ) return
            
            Object.keys(this).map ( v => {
                delete this[v]
                delete this.data
            })
            const domtree = [...this.domtree]
            const attrtree = [...this.attrtree]
            const watch = [...this.watch]
            this.domtree.length = 0
            // this.attrtree.length = 0
            this.watch.length = 0
            // this.domtree.length = 0

            this.init( newValue )

            domtree.map( v => v(3, this) );
            attrtree.map( v => v());
            watch.map( v => v(newValue) );
            // 非对象类型重置时会重新渲染，push domtree
            if ( !( newValue instanceof Object) ) return
            this.domtree.push(...domtree)
            this.watch.push(...watch)
        })
        this.init( valueAny )
    }

    init( valueAny ) {
        this.__get = valueAny;
        Object.defineProperty(this, 'data', {
            enumerable: false, // 可枚举
            configurable: true, // fales 不能再define
            get() {
                return this.__get
            },
            set(newVal) {
                // console.log ( this, newVal )
                this.__set(newVal)
            }
        });
        if ( valueAny instanceof Array ) {
            this.__get.map((v,k)=>{
                bindObs( this, this.data, k, v )
            })
        } else if ( valueAny instanceof Object ) {
            ObjectMap(this.__get, (v,k)=>{
                bindObs( this, this.data, k, v )
            })
        }
        
    }

    replace ( newOnObject ) {
        this.__get = newOnObject

        const domtree = [...this.domtree]
        const attrtree = [...this.attrtree]
        const watch = [...this.watch]
        this.domtree.length = 0
        // this.attrtree.length = 0
        // this.watch.length = 0

        domtree.map( v => v(3, this) );
        attrtree.map( v => v());
        watch.map( v => v(newOnObject) );
        // 非对象类型重置时会重新渲染，push domtree
        // if ( !( newValue instanceof Object) ) return
        // this.domtree.push(...domtree)
        this.watch.push(...watch)
    }

    add ( newObject ) {
        const nV = []
        ObjectMap( newObject, (v, k) => {
            bindObs( this, this.data, k, newObject[k] )
            nV.push( this[k] )
        })
        this.domtree.map( v => v( 1, nV) )
    }

    push( newValue ) {
        // console.log ( this, 'push push' )
        if (!( newValue instanceof Array ) ) throw 'push argument need array'
        const len = Object.keys(this).length
        const valueLen = newValue.length
        const nV = {}
        for ( let i = 0; i < valueLen; i++ ) {
            nV[i + len] = this[i + len]
        }
        this.add ( nV )
    }

    unshift( newValue ) {
        this.domtree.map( v => v( 0, newValue) )
    }

    rmove() {
        this.__get = undefined
        this.domtree.map( v => v( 2 ) )
    }

    map( fun ) {
        this.renders.push(fun)
        return this
    }

    renderValue ( v, i ) {
        let prvValue = v;
        this.renders.map( fn => {
            prvValue = fn( prvValue, i )
        })
        return prvValue
    }

    renderArray ( newValue ) {
        return newValue.map( (v,i) => this.renderValue ( v, i ))
    }

    render( newValue = this.__get ) {
        // if ( this.renders.length === 0 ) return newValue
        if ( newValue instanceof Array ) return this.renderArray( newValue )
        if ( newValue instanceof Object || newValue instanceof Obs ) {
            // if ( typeof newValue.__get !== 'object' ) return [this.renderValue ( newValue, 0 )]
            if ( 
                newValue.__get instanceof Element || 
                newValue.__get instanceof Text || 
                newValue.__get instanceof DocumentFragment 
            ) return [this.renderValue ( newValue.__get, 0 )] 
            if ( Object.keys(newValue).length === 0 ) return [this.renderValue ( newValue, 0 )]
            const data = []
            ObjectMap( newValue, ( v, k ) => {
                data.push(this.renderValue ( this[k], k ))
            })
            return data
        }
        return this.renderValue ( newValue )
    }
}

// function renderValue ( v, i ) {
//     let prvValue = v;
//     this.renders.map( fn => {
//         prvValue = fn( prvValue, i )
//     })
//     return prvValue
// }

// function render( v ) {
//     if ( v instanceof Array ) return renderArray(v)
//     return renderValue ( v )
// }

export default Obs

export {
    addPorto
}

