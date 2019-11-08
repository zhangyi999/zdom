// 数据绑定最小单位
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
        this.domtree.map( v => v(newValue) );
        this.attrtree.map( v => v(newValue) );
        this.watch.map( v => v(newValue) );
    }

    map( fun ) {
        this.renders.push(fun)
    }
}

export default Obs

