import {ObjectMap} from './public'

Array.prototype.mapA = function(fn) {
    let i = 0
	const arr = []
    const len = this.length
    addPorto(arr, 'mapCall', fn)
	while( i < len ) {
		arr.push(this[i])
		i ++
    }
	return arr
	
}

function addPorto(obj, key, val) {
    Object.defineProperty(obj, key, {
        enumerable: false,
        configurable: false,
        writable: false,
        value: val
    })
}

function ZdomArray ( arr , callback) {
    if ( !(arr instanceof Array ) ) return arr;
    if ( arr.length === 0 ) arr = ['']
    // const domtree = arr.map( v => [] );
    // const attrtree = arr.map( v => [] );
    // function get ( index ) {
    //     return {
    //         value: arr[index],
    //         index,
    //         domtree,
    //         attrtree
    //     }
    // }
    // addPorto(arr, 'get', get);
    // let mapFun;

    // function maps ( call ) {
    //     mapFun = call;
    //     callback({
    //         type: 'push',
    //         data: newArray,
    //         mapFun
    //     })
    // }

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
        if ( ! (newValue instanceof Array ) ) newValue = [newValue];
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
            ZdomArray( Observable.value, newData => Observable.domtree.map( v => v(newData))):
            s;

    addPorto(val, 'Observable', Observable);
    return val
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
            if (newVal == oldValueData && oldValueData !== '') {
                return;
            }
            oldVal = addObservable( newVal, val );
            oldValueData = newVal;
            val.change( oldVal )
        }
    });
    return obj
} 

function Props( attr ) {
    const props = {
        domtree: {},
        attrtree: {},
        watch: {}
    };
    function initData ( key, value ) {
        if ( typeof key === 'object' ) {
            const data = {}
            ObjectMap( key, function( v, k ){
                data[k] = initData( k, v );
            });
            return data;
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
            supplement: (newVal, supple) => {
                if ( supple === undefined ) return newVal
                let supplement = ''
                supple.map( v => {
                    supplement += v.Observable?v.Observable.get():v
                })
                return supplement
            },
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