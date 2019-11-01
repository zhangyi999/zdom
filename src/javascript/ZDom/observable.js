import {ObjectMap} from './public'
import checkTypes from './types'

function addPorto(obj, key, val) {
    Object.defineProperty(obj, key, {
        enumerable: false,
        configurable: false,
        writable: false,
        value: val
    })
}

Array.prototype.mapA = function(fun) {
    return this.map(fun)
}

function ZdomArray ( arr , callback) {
    if ( !(arr instanceof Array ) ) return arr;
    if ( arr.length === 0 ) arr = ['']
    addPorto(arr, 'mapCall', [])
    addPorto(arr, 'mapA', function(fn) {
        arr.mapCall.push(fn)
        return arr
    })
    function add ( newArray ) {
        if ( ! (newArray instanceof Array ) ) newArray = [newArray];
        this.push(...newArray)
        newArray.mapCall?'':addPorto(newArray, 'mapCall', this.mapCall)
        callback({
            type: 'push',
            data: newArray
        })
    }

    function replace (index, newValue) {
        if ( newValue instanceof Function ) {
            newValue = [newValue(this[index])] 
        } else {
            if ( ! (newValue instanceof Array ) ) newValue = [newValue];
            if ( isDiff( this[index], newValue[0] ) === false ) return
        }
        
        this.splice( index, newValue.length, ...newValue );
        newValue.mapCall?'':addPorto(newValue, 'mapCall', this.mapCall)
        callback({
            type: 'replace',
            index, 
            data: newValue
        })
    }

    function addProve ( newValue ) {
        if ( ! (newValue instanceof Array ) ) newValue = [newValue];
        this.unshift( ...newValue );
        // console.log(newValue, newValue.mapCall)
        newValue.mapCall?'':addPorto(newValue, 'mapCall', this.mapCall)
        callback({
            type: 'unshift',
            data: newValue
        })
    }

    function remove ( index, len = 1 ) {
        this.splice( index, len );
        callback({
            type: 'remove',
            data: {
                index,
                n: len
            }
        })
    }

    addPorto(arr, 'add', add);
    addPorto(arr, 'replace', replace);
    addPorto(arr, 'addshift', addProve);
    addPorto(arr, 'remove', remove);
    return arr
}

const TypeFun = {
    string: e => new String(e),
    number: e => new Number(e),
    boolean: e => new Boolean(e)
}

function addObservable( s, Observable ) {
    // console.log(typeof s, Observable.key, Observable)
    if ( s === undefined ) throw ' undefined is not Object '
    if ( s.Observable !== undefined ) return s
    const val = TypeFun[typeof s]? 
        TypeFun[typeof s](s): 
        s instanceof Array?
            ZdomArray( s, newData => Observable.domtree.map( v => v(newData))):
            s;

    addPorto(val, 'Observable', Observable);
    return val
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

function Observable( obj, key, val ) {
    let oldValueData = val.value
    let oldVal = addObservable( oldValueData, val );
    Object.defineProperty(obj.data, key, {
        enumerable: true, // 可枚举
        configurable: true, // fales 不能再define
        get() {
            return oldVal
        }, 
        set(newVal) {
            if ( isDiff( newVal, oldValueData ) === false ) return
            oldVal = addObservable( newVal, val );
            oldValueData = newVal;
            val.change( oldVal )
        }
    });
    return obj
} 

/** 
 * Data() 的作用是创建钩子
 * 钩子数据结构
 * data = {
 *  key,
 *  initValue,
 *  props,
 *  domtree,
 *  attrtree,
 *  change,
 *  watch,
 *  get
 * }
 * 
 *  */

function Props( attr ) {
    const props = {
        domtree: {},
        attrtree: {},
        watch: {}
    };
    function initData ( key, value ) {
        if ( typeof key === 'object' ) {
            ObjectMap( key, function( v, k ){
                key[k] = initData( k, v );
            });
            return key;
        }
        if ( value.Observable !== undefined ) {
            Observable( props, key, value.Observable )
            return value;
        };
        
        value = value === false? value : value || props.data[key] || '';
        props.domtree[key]?'':props.domtree[key] = [];
        props.attrtree[key]?'':props.attrtree[key] = [];
        props.watch[key]?'': props.watch[key] = [];
        const data =  {
            value,
            key,
            domtree: props.domtree[key],
            attrtree: props.attrtree[key],
            change ( newValue ) {
                props.domtree[key].map( v => v(newValue) );
                props.attrtree[key].map( v => v(newValue) );
                props.componentUpdate ? props.componentUpdate( key ) : '' ;
                props.watch[key].map( v => v(newValue) );
            },
            props,
            watch : callback => props.watch[key].push(callback.bind(props)),
            set( n ) {
                props.data[key] = n
                return n
            },
            get() {
                return props.data[key] 
            }
        }
        Observable( props, key, data );
        return props.data[key]; 
    }
    props.data = Object.assign( initData, attr );
    return props
}

export default Props