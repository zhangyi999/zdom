import {ObjectMap} from './public'

function addPorto(obj, key, val) {
    Object.defineProperty(obj, key, {
        enumerable: false,
        configurable: false,
        writable: false,
        value: val
    })
}

function replaceStr( val, str ) {
    if ( str === '' ) return val;
    if ( typeof val === 'string' || typeof val === 'number' ) return str.replace( '{v}', val );
    return val;
}

function ZdomArray ( arr , callback) {
    if ( !(arr instanceof Array ) ) return arr;

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
        this.push(...newArray)
        callback({
            type: 'push',
            data: newArray
        })
    }

    function replace (index, newValue) {
        if ( ! (newValue instanceof Array ) ) newValue = [newValue];
        this.splice( index, newValue.length, ...newValue );
        domtree[index].map( v => v(...newValue));
        attrtree[index].map( v => v(...newValue));
        callback({
            type: 'replace',
            index, 
            data: newValue
        })
    }

    function addProve ( newValue ) {
        this.unshift( ...newValue );
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

function Observable( obj, key, val ) {
    let oldVal = ZdomArray(val, newData => obj.domtree[key].map( v => v(newData)));
    Object.defineProperty(obj.data, key, {
        enumerable: true, // 可枚举
        configurable: true, // fales 不能再define
        get() {
            return oldVal
        },
        set(newVal) {
            if (newVal == oldVal && oldVal !== '') {
                return;
            }
            oldVal = ZdomArray(newVal, newData => obj.domtree[key].map( v => v(newData)));
            // oldVal = newVal;
            // if ( !(newVal instanceof Array ) && supplement ) oldVal = replaceStr( newVal, supplement );
            obj.domtree[key].map( v => v(oldVal) );
            obj.attrtree[key].map( v => v(oldVal) );
            obj.componentUpdate ? obj.componentUpdate() : '' ;
            obj.watch[key].map( v => v(oldVal) );
        }
    });
    // console.log(obv,'Observable')
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
        if ( typeof value === 'object' && value.domtree !== undefined ) {
            Object.defineProperty(props.data, key, {
                enumerable: true,
                configurable: true,
                get() {
                    return value.get()
                },
                set( n ) {
                    value.set = n
                }
            })
            return value;
        };
        value = value || props.data[key] || '';
        // console.log(key, props.data[key], props.data[key]?'1':'0', value,'valuevalue')
        Observable( props, key, value );
        props.domtree[key]?'':props.domtree[key] = [];
        props.attrtree[key]?'':props.attrtree[key] = [];
        props.watch[key]?'': props.watch[key] = [];
        // let supplement = ''; 
        const data =  {
            value,
            key,
            domtree: props.domtree[key],
            attrtree: props.attrtree[key],
            props,
            supplement: (newVal, suppleSre) => replaceStr( newVal || props.data[key], suppleSre || data.supplementStr ),
            supplementStr: '',
            watch : callback => props.watch[key].push(callback.bind(props)),
            joinStr: str => {
                if ( data.supplementStr.match(/{\S*?}/g) !== null ) {
                    data.supplementStr = replaceStr( data.supplementStr, str );
                } else {
                    data.supplementStr = str;
                }
            },
            get: () => props.data[key],
            map: fun => {
                const value = props.data[key];
                if ( !( value instanceof Array ) ) throw key + 'no Array';
                return value.map(fun);
            }
        }
        Object.defineProperty( data, 'set', {
            enumerable: true, // 可枚举
            configurable: false, // false 不能再define
            get() {
                return props.data[key]
            },
            set( n ) {
                props.data[key] = n;
            }
        });

        return data; 
    }
    props.data = Object.assign( initData, attr );
    return props
}

export default Props

export {replaceStr}