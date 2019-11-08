

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

// 数据绑定最小单位
class Obs {
    constructor( valueAny ) {
        this.initValue = valueAny
        this.domtree = []
        this.attrtree = []
        this.watch = []
        this.get = valueAny
    }

    set( newValue ) {
        if ( isDiff( newVal, oldValueData ) === false ) return
        this.get = newValue
        this.domtree.map( v => v(newValue) );
        this.attrtree.map( v => v(newValue) );
        this.watch.map( v => v(newValue) );
    }
}