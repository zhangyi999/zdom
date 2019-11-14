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

function isDiff( newData, oldObs ) {
    const oldData = oldObs.__get
    debugger
    // console.log ( newData, oldData, checkTypes(newData) , checkTypes(oldData) )
    if ( 
        ( newData instanceof Object || oldData instanceof Object ) &&
        checkTypes(newData) !== checkTypes(oldData)  
    ) throw '值为对象时，不可改变值得类型'
    if ( newData === oldData ) return false
    if ( newData instanceof Object ) {
        const newValueArr = {}
        // console.log  ( newData )
        ObjectMap( newData, (v,k) => {
            if ( oldData[k] === undefined ) {
                newValueArr[k] = v
            } else {
                // 0.3 只考虑 [{}] 一层状态，哈哈，能力有限，请见谅
                if ( v instanceof Object ) {
                    ObjectMap( v, (v, k1) => {
                        isDiff( v, oldObs[k][k1] )
                    })
                } else {
                    isDiff( v, oldObs[k] )
                }
            }
        })
        ObjectMap( oldData, (v,k) => {
            if ( newData[k] === undefined ) {
                // Object.keys(oldObs[k]).map ( v => {
                //     oldObs[k][v].remove()
                //     delete oldObs[k][v]
                //     delete oldObs.data[k]
                // })
                console.log ( k, oldObs )
                oldObs[k].remove()
                delete oldObs[k]
                delete oldObs.data[k]
            }
        })
        oldObs.add(newValueArr, 1)
        return false
    }
    if ( 
        checkTypes(newData) === 'Boolean' ||
        checkTypes(newData) === 'Number' ||
        checkTypes(newData) === 'String' ||
        newData instanceof Element || 
        newData instanceof Text || 
        newData instanceof DocumentFragment 
    ) {
        Object.keys(oldObs).map ( v => {
            delete oldObs[v]
            delete oldObs.data[v]
        })
        oldObs.replace( newData )
        return false
    }

    

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
    if ( value instanceof Object ) {
        obsDomObj[key] = new Obs(value)
        ObjectMap( value,  (v,i) => {
            bindObs( obsDomObj[key], obsObj[key], i, v )
        })
        return
    }
    obsDomObj[key] = new Obs(value)
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
            if ( isDiff( newValue, this ) === false ) return
            
            // Object.keys(this).map ( v => {
            //     delete this[v]
            // })

            // delete this.data
            // const domtree = [...this.domtree]
            // const attrtree = [...this.attrtree]
            // const watch = [...this.watch]
            // this.domtree.length = 0
            // // this.attrtree.length = 0
            // this.watch.length = 0
            // // this.domtree.length = 0

            // this.init( newValue )

            // domtree.map( v => v(3, this) );
            // attrtree.map( v => v());
            // watch.map( v => v(newValue) );
            // // 非对象类型重置时会重新渲染，push domtree
            // if ( !( newValue instanceof Object) ) return
            // this.domtree.push(...domtree)
            // this.watch.push(...watch)
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
        if ( valueAny instanceof Object ) {
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
        // this.watch.push(...watch)
    }

    add ( newObject, typeAdd = 0 ) {
        const nV = []
        ObjectMap( newObject, (v, k) => {
            // console.log ( newObject, newObject[k] )
            bindObs( this, this.data, k, newObject[k] )
            nV.push( this[k] )
        })
        if ( nV.length == 0 ) return
        this.domtree.map( v => v(  typeAdd, nV ) )
    }

    push( newValue ) {
        if (!( newValue instanceof Array ) ) throw 'push argument need array'
        const len = Object.keys(this).length
        const valueLen = newValue.length
        const nV = {}
        for ( let i = 0; i < valueLen; i++ ) {
            nV[i + len] = newValue[i]
        }
        this.add ( nV, 1 )
    }

    unshift( newValue ) {
        if (!( newValue instanceof Array ) ) throw 'push argument need array'
        const len = Object.keys(this).length
        const valueLen = newValue.length
        // const nV = {}
        for ( let i = 0; i < len; i++ ) {
            // nV[len] = newValue[i]
            const k = len - 1 - i
            this[ k + valueLen ] = this[ k ]
            // console.log ( this[ k + valueLen ] )
            bindObs( this, this.data, k + valueLen, this[ k ].__get )
        }
        this.add ( newValue )
    }

    remove() {
        this.__get = undefined
        this.domtree.map( v => v( 2 ) )
        // this.attrtree.map( v => v( 2 ) )
    }

    map( fun ) {
        this.renders.push(fun)
        return this
    }

    renderValue (fnArray, v, i ) {
        let prvValue = v;
        fnArray.map( fn => {
            if ( prvValue !== undefined ) prvValue = fn( prvValue, i )
        })
        return prvValue
    }

    // renderArray ( newValue ) {
    //     return newValue.map( (v,i) => this.renderValue ( v, i ))
    // }

    render( newValue, renderFunArray ) {
        // if ( this.renders.length === 0 ) return newValue
        if ( newValue instanceof Obs ) {
            const value = newValue.__get
            if ( Object.keys(newValue).length === 0 ) {
                return this.renderValue( renderFunArray, value, null )
            }
            else if ( value instanceof Array ) {
                // index 参数在 添加数组时 可能会出现重复

                return value.map( (v, i) => this.renderValue(renderFunArray, newValue[i], i))
            }
            else if ( value instanceof Object  ) {
                return this.renderValue( renderFunArray, this, null )
            }
        }

        if ( newValue instanceof Array ) {
            return newValue.map( (v, i) => this.renderValue(renderFunArray, v, i))
        }

        if ( newValue instanceof Object ) {
            return this.renderValue( renderFunArray, newValue, null )
        }

        

        return newValue 
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

