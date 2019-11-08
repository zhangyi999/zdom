import DomPrototype from './dom'

import Obs from './Obs'

import {ObjectMap} from './public'


function addElemens ( p, newElement, targetElement) {
    if (p.lastChild == targetElement) {
        p.appendChild(newElement);
    } else {
        p.insertBefore(newElement, targetElement.nextSibling);
    }
}

// domtree: 0 | 从头部增加，1 | 从尾部增加， 2 | 删除，3 | 替换 
const ArrayElement = [
    ( prant, oldRepalce, newArray ) => {
        // 从头部增加
        const addElement = initChild(newArray);
        const indexEl = oldRepalce[0];
        oldRepalce.unshift( ...Array.from( addElement.childNodes ) );
        prant.insertBefore( addElement, indexEl );
        return oldRepalce;
    },
    ( prant, oldRepalce, newArray ) => {
        // 从尾部增加
        const addElement = initChild(newArray);
        const newPr = oldRepalce.concat( Array.from( addElement.childNodes ));
        addElemens(prant, addElement,oldRepalce[oldRepalce.length -1] )
        return newPr
    },
    ( prant, oldRepalce, data ) => {
        // 删除
        const { index, n } = data;
        for ( let i = index; i < index*1 + n*1; i ++ ) {
            oldRepalce[i].ondie?oldRepalce[i].ondie():'';
            oldRepalce[i].remove();
        }
        oldRepalce.splice( index, n );
        return oldRepalce;
    },
    ( prant, oldRepalce, newArray, index ) => {
        // 替换
        const addElement = initChild(newArray);
        const newArrayLen = newArray.length;
        const indexDom = oldRepalce[index];
        const childArr = Array.from( addElement.childNodes );
        prant.replaceChild( addElement ,indexDom );
        for( let i = index*1 + 1; i < index*1 + newArrayLen; i ++ ) {
            const v = oldRepalce[i];
            if( v === undefined ) break;
            v.ondie?v.ondie():'';
            v.remove()
        }
        oldRepalce.splice( index, newArrayLen, ...childArr );
        return oldRepalce;
    }
]

// domtree: 0 | 从头部增加，1 | 从尾部增加， 2 | 删除，3 | 替换  
function replaceDom( type, prant, oldDom, newRender ) {
    const newDom = newRender()
}



function addObsDom( prant, Obs ) {
    const {render,renders} = Obs
    let oldDom = addChild ( prant, render() )
    Obs.domtree.push((type) => {
        Obs.renders = renders
        oldDom = replaceDom( type, prant, oldDom, render )
        Obs.renders = []
    })
    // 初始化
    Obs.renders = []
}

function creatDocumentFragment(childs) {
    const dom = document.createDocumentFragment()
    addChild ( dom, childs )
    return dom
}

function addChild ( prant, childs ) {
    if ( childs === undefined ) return ''
    if ( childs instanceof Obs ) {
        addObsDom( prant, childs )
    } else if ( childs instanceof Array ) {
        const len =  childs.length;
        for( let i = 0; i < len; i ++) {
            const child = childs[i];
            addChild( prant, child );
        }
    } else if ( childs instanceof Element || childs instanceof Text || childs instanceof DocumentFragment ) {
        prant.appendChild(childs)
    } else if ( typeof childs === 'string' || typeof childs === 'number' || typeof childs === "boolean" ) {
        prant.appendChild(document.createTextNode(childs));
    } else  {
        console.log(childs);
        console.log('child 类型不支持');
    }
}

// attr
function setAttribute(dom, key, attrs) {
    if(key === 'placeholder') return dom.placeholder = attrs || '';
    if(key === 'value') return dom.value = attrs || ''
    if(key === 'checked') return dom.checked = attrs == true
    if(key === 'disabled') return dom.disabled = attrs == true
    if(key === '$innerHTML') return dom.innerHTML = attrs
    dom.setAttribute(key, attrs);
}

function supplementArray( arr ) {
    let supplement = ''
    arr.map( (v = '') => {
        supplement += v instanceof Obs ? v.get :v
    })
    return supplement
}

function mapAttr( dom, arr ) {
    ObjectMap(arr, ( value, key ) => {
        if(!value && value !== 0 ) return

        if(key === '$data') {
            dom.$data = value
            return;
        }

        if(/@\S/.test(key)) {
            const events = key.replace('@','')
            if(!events || events === '' || value === '') return;
            if( events === 'die' ) dom.ondie = value;
            dom.addEventListener(events,function(e){
                e.stopPropagation();
                try{
                    value( this, e );
                }catch(err){
                    console.log(err);
                    throw new Error(events +'方法不存在');
                }
            })
            return;
        }

        if ( value instanceof Obs ) {
            value = value.Observable;
            value.attrtree.push( function ( ) {
                setAttribute(dom, key, value.get )
            })
            return setAttribute(dom, key, value.get );
        }

        if ( value instanceof Array ) {
            value = value.flat(Infinity);
            value.map( v => {
                if ( v instanceof Obs ) {
                    v.attrtree.push( function ( ) {
                        setAttribute(dom, key, supplementArray( value ))
                    })
                }
            })
            return setAttribute( dom, key, supplementArray( value ) )
        }
        setAttribute(dom, key, value )
    })
}

function creatElement(type ,arr, ...childs) {
    const dom = document.createElement(type);
    mapAttr( dom, arr );
    addChild(dom, ...childs)
    return dom
}

const dom = new DomPrototype(({attrs, child, nodeName}) => creatElement(nodeName ,attrs, child))

export default dom