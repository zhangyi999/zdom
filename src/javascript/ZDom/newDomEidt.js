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
        const addElement = creatDocumentFragment(newArray);
        const indexEl = oldRepalce[0];
        prant = (oldRepalce[0] || {}).parentElement || prant
        oldRepalce.unshift( ...Array.from( addElement.childNodes ) );
        prant.insertBefore( addElement, indexEl );
        return oldRepalce;
    },
    ( prant, oldRepalce, newArray ) => {
        // 从尾部增加
        const addElement = creatDocumentFragment(newArray);
        const newPr = oldRepalce.concat( Array.from( addElement.childNodes ));
        prant = (oldRepalce[0] || {}).parentElement || prant
        addElemens(prant, addElement,oldRepalce[oldRepalce.length -1] )
        return newPr
    },
    ( prant, oldRepalce ) => {
        // 删除
        oldRepalce.map (  v => {
            v.ondie?v.ondie():'';
            v.remove();
        })
        return undefined;
    },
    ( prant, oldRepalce, newArray ) => {
        // 替换
        // console.log ( [oldRepalce], newArray, 'newArraynewArraynewArray' )
        const addElement = creatDocumentFragment(newArray);
        const oldDom = oldRepalce[0]
        prant = (oldRepalce[0] || {}).parentElement || prant
        const len = oldRepalce.length
        for ( let i = 1; i < len; i ++ ) {
            oldRepalce[i].ondie?oldRepalce[i].ondie():'';
            oldRepalce[i].remove();
        }
        oldRepalce = Array.from( addElement.childNodes )
        oldDom.ondie?oldDom.ondie():''
        // prant.replaceChild(addElement, oldDom)
        oldDom.replaceWith(addElement)
        return oldRepalce;
    }
]


// domtree: 0 | 从头部增加，1 | 从尾部增加， 2 | 删除，3 | 替换  
function replaceDom( type, prant, oldDom, obs, newValue, renders ) {
    // console.log (obs, newValue,'newValuenewValuenewValue1-----' )
    // 仅考虑单层数组，对象 直接渲染，不用遍历
    
    // const kk = obs.render( newValue, renders )
    const fragment = type === 3 ? obs.render( newValue, renders ) : document.createDocumentFragment()
    // debugger
    if ( type === 0 || type === 1 ) {
        const len = Object.keys(obs).length
        // debugger
        newValue.map( (v, i) => {
            i = len+i - 1
            addChild ( fragment, obs[i].render( obs[i], renders.map( v => (v1,i1) => v(v1, i) )) )
            let oldDom = Array.from( fragment.childNodes )
            obs[i].domtree.push((type, newValue) => {
                // bug 老节点
                // console.log ( obs, newValue, ' obsobsobs' )
                oldDom = replaceDom( type, fragment, oldDom, obs[len+i], newValue, renders )
            })
        })
    }
    // debugger
    return ArrayElement[type]( prant, oldDom, fragment, newValue )
}



function addObsDom( prant, obs ) {
    // 仅考虑单层数组，对象 直接渲染，不用遍历
    const fragment = document.createDocumentFragment()
    const renders = [...obs.renders]
    obs.renders.length = 0
    if ( obs.__get instanceof Array ) {
        obs.__get.map( (v, i) => {
            const fragment1 = document.createDocumentFragment()
            addChild ( fragment1, obs[i].render( obs[i], renders ))
            let oldDom = Array.from( fragment1.childNodes )
            obs[i].domtree.push((type, newValue) => {
                // bug 老节点
                // console.log ( obs, newValue, ' obsobsobs' )
                oldDom = replaceDom( type, fragment1, oldDom, obs[i], newValue, renders )
            })
            fragment.appendChild( fragment1 )
        })
    } else addChild ( fragment, obs.render( obs, renders ))
    let oldDom = Array.from( fragment.childNodes )
    prant.appendChild( fragment )
    // console.log( obs , fragment, 'obsobsobsobsobsobsobsobs' )
    // debugger
    obs.domtree.push((type, newValue) => {
        // bug 老节点
        // console.log ( obs, newValue, ' obsobsobs' )
        oldDom = replaceDom( type, prant, oldDom, obs, newValue, renders )
    })
    
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

function supplementArray( arr, arrRender ) {
    let supplement = ''
    arr.map( (v = '', i ) => {
        supplement += v instanceof Obs ? v.render(v.__get, arrRender[i]) :v
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
            const render = [...value.renders]
            value.attrtree.push( function ( type ) {
                setAttribute(dom, key, value.render(value.__get, render) )
            })
            value.renders.length = 0
            return setAttribute(dom, key, value.render(value.__get, render) );
        }

        if ( value instanceof Array ) {
            value = value.flat(Infinity);
            const arrRender = {}
            value.map( (v,i) => {
                if ( v instanceof Obs ) {
                    arrRender[i] = [...v.renders]
                    v.attrtree.push( function ( type ) {
                        if ( type === 2 ) return dom.remove()
                        setAttribute(dom, key, supplementArray( value, arrRender ))
                    })
                    v.renders.length = 0
                }
            })
            return setAttribute( dom, key, supplementArray( value, arrRender ) )
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