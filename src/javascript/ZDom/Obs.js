// 数据绑定最小单位
// domtree: 0 | 从头部增加，1 | 从尾部增加， 2 | 删除，3 | 替换  
class Obs {
    constructor( valueAny ) {
        this.initValue = valueAny
        this.domtree = []
        this.attrtree = []
        this.watch = []
        this.get = valueAny
        this.renders = [] 
    }

    set( newValue ) {
        if ( isDiff( newVal, oldValueData ) === false ) return
        this.get = newValue
        this.domtree.map( v => v(3) );
        this.attrtree.map( v => v() );
        this.watch.map( v => v(newValue) );
    }

    map( fun ) {
        this.renders.push(fun)
    }

    renderValue ( v, i ) {
        let prvValue = v;
        this.renders.map( fn => {
            prvValue = fn( prvValue, i )
        })
        return prvValue
    }

    renderArray () {
        return this.get.map( (v,i) => this.renderValue ( v, i ))
    }

    render( ) {
        if ( this.renders.length === 0 ) return this.get
        if ( this.get instanceof Array ) return this.renderArray()
        return this.renderValue ( this.get )
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

