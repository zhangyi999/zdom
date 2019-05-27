import DomPrototype from './dom'

import {ObjectMap} from './public'

function setAttribute(dom, key, attrs) {
    if(key === 'placeholder') return dom.placeholder = attrs || '';
    if(key === 'value') return dom.value = attrs || ''
    if(key === 'checked') dom.checked = attrs || false
    dom.setAttribute(key, attrs);
}

function addElemens ( p, newElement, targetElement) {
    if (p.lastChild == targetElement) {
        p.appendChild(newElement);
    } else {
        p.insertBefore(newElement, targetElement.nextSibling);
    }
}

const ArrayElement = {
    push ( prant, oldRepalce, newArray ) {
        const addElement = initChild(newArray);
        const newPr = oldRepalce.concat( Array.from( addElement.childNodes ));
        addElemens(prant, addElement,oldRepalce[oldRepalce.length -1] )
        return newPr
    },
    replace ( prant, oldRepalce, newArray, index ) {
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
    },
    unshift ( prant, oldRepalce, newArray ) {
        const addElement = initChild(newArray);
        const indexEl = oldRepalce[0];
        oldRepalce.unshift( ...Array.from( addElement.childNodes ) );
        prant.insertBefore( addElement, indexEl );
        return oldRepalce;
    },
    remove ( prant, oldRepalce, data ) {
        const { index, n } = data;
        for ( let i = index; i < index*1 + n*1; i ++ ) {
            oldRepalce[i].ondie?oldRepalce[i].ondie():'';
            oldRepalce[i].remove();
        }
        oldRepalce.splice( index, n );
        return oldRepalce;
    }
}

function addChild ( prant, childs ) {
    // if ( childs === undefined ) return ''
    if ( childs instanceof Array ) {
        const len =  childs.length;
        for( let i = 0; i < len; i ++) {
            const child = childs[i];
            addChild( prant, child );
        }
    } else if ( childs instanceof Element || childs instanceof Text || childs instanceof DocumentFragment ) {
        prant.appendChild(childs)
    } else if ( typeof childs === 'string' || typeof childs === 'number' ) {
        prant.appendChild(document.createTextNode(childs));
    } else if ( childs.value !== undefined ) {
        let oldValue = childs.props.data[childs.key];
        if ( typeof oldValue === 'string' || typeof oldValue === 'number' ) {
            oldValue = childs.supplement( oldValue );
        }
        let oldEL = initChild( oldValue );
        let oldRepalce = oldValue instanceof Array ? Array.from( oldEL.childNodes ) : oldEL ;
        
        childs.domtree.push( function ( newVal ) {
            if ( newVal.type !== undefined ) {
                const {data, type, index} = newVal;
                oldRepalce = ArrayElement[type]( prant, oldRepalce, data, index );
            } else {
                if ( typeof newVal === 'string' || typeof newVal === 'number' ) newVal = childs.supplement( newVal );
                // console.log( newVal )
                oldRepalce = replaceDom( prant, oldRepalce , newVal );
            }
        });
        addChild( prant, oldEL );
    } else {
        console.log(childs);
        console.log('child 类型不支持');
    }
}

function initChild( childs ) {
    if ( childs instanceof Element || childs instanceof Text ) return childs;
    else if ( typeof childs === 'string' || typeof childs === 'number' ) return document.createTextNode(childs);
    else if ( childs instanceof Array ) return randerArray(childs);
}


//处理一段el
function randerArray(arr) {
    if(arr instanceof Array) {
        const div = document.createDocumentFragment()
        arr.map( v => {
            const dom = initChild(v)
            div.appendChild(dom)
        })
        return div
    } else {
        throw 'randerArray 仅处理数组'
    }
}


function replaceDom( dom , oldDom, newDom ) {
    const newdom = initChild( newDom );
    /*
        1、oldEl: El, newEl: El;
        2、oldEl: Arr, newEl: El;
        3、oldEl: El, newEl: Arr;
        4、oldEl: Arr, newEl: Arr;
    */
    // if( newDom instanceof Array ) newDom = randerArray(newDom);
    let oldRepalce = newdom instanceof DocumentFragment? Array.from(newdom.childNodes) : newdom;
    if (oldDom instanceof Element || oldDom instanceof Text) {
        oldDom.ondie?oldDom.ondie():'';
        dom.replaceChild( newdom, oldDom );
    } else if (oldDom instanceof Array || oldDom instanceof NodeList) {
        dom.replaceChild( newdom, oldDom[0] )
        oldDom.map( function(v){
            const parentElement = v.parentElement;
            if ( v.parentElement !== null ) {
                v.ondie?v.ondie():'';
                let o = parentElement.removeChild(v);
                o = null;
            }
        })
    }
    return oldRepalce;
}

function creatElement(type ,arr, ...childs) {
    const dom = document.createElement(type);
    ObjectMap(arr, ( value, key ) => {
        if(!value && value !== 0 ) return
        if(key === '$data') {
            dom.$data = value
            return;
        }
        if(key === '$innerHTML') {
            dom.innerHTML = value
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
        if ( typeof value === 'string' || typeof value === 'number' ) {
            return setAttribute(dom, key, value )
        }
        
        if (value.domtree !== undefined ) {
            value.attrtree.push( function ( newVal ) {
                setAttribute(dom, key, value.supplement( newVal ) )
            })
            return setAttribute(dom, key, value.supplement( value.value ) )
        }

        if ( value instanceof Array ) {
            value.map( v => {
               if ( v.domtree !== undefined ) {
                    v.attrtree.push( function ( newVal ) {
                        setAttribute(dom, key, v.supplement( newVal, value ) )
                    })
                    return setAttribute(dom, key, v.supplement( v.value, value ) )
                }
            })
        }
    })
    addChild(dom, ...childs)
    return dom
}

const dom = new DomPrototype(({attrs, child, nodeName}) => creatElement(nodeName ,attrs, child))

export default dom

export {
    replaceDom,
    setAttribute
}