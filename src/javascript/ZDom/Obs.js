import checkTypes from './types'
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

function addPorto(obj, key, val) {
    Object.defineProperty(obj, key, {
        enumerable: false,
        configurable: false,
        writable: false,
        value: val
    })
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
        addPorto(this, 'initValue', valueAny)
        this.get = valueAny
        this.set = ( newValue ) => {
            if ( newValue === null ) return this.rmove()
            if ( isDiff( newValue, this.get ) === false ) return
            this.get = newValue
            this.domtree.map( v => v(3, newValue) );
            this.attrtree.map( v => v() );
            this.watch.map( v => v(newValue) );
        }

    }

    push( newValue ) {
        this.domtree.map( v => v( 1, newValue) )
    }

    unshift( newValue ) {
        this.domtree.map( v => v( 0, newValue) )
    }

    rmove() {
        this.domtree.map( v => v( 2 ) )
    }

    map( fun ) {
        this.renders.push(fun)
        return this
    }

    renderValue ( v, i ) {
        let prvValue = v;
        this.renders.map( fn => {
            prvValue = fn( v instanceof Obs ? prvValue.get: prvValue, i )
        })
        return prvValue
    }

    renderArray ( newValue ) {
        return newValue.map( (v,i) => this.renderValue ( v, i ))
    }

    render( newValue = this.get ) {
        if ( this.renders.length === 0 ) return newValue
        if ( newValue instanceof Array ) return this.renderArray( newValue )
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

