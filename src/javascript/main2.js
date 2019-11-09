
import dom from './ZDom/newDomEidt'

import observable from './ZDom/observable'

const [ $, obs ] = observable( {
    num: 1,
    b:{
        a:2
    },
    g: [1,2,3,4,5],
    old: true
} )



setTimeout(()=>{

    // console.log( Object.keys(date) )
    // date.get.a.set(dom.b({},'321312'))
    // date.get.b.set('ggg')
    obs.b.a = ('pppppp')
    console.log (
        $
    )
    obs.old = false
    obs.g.add([1233,444,2,3123,{a:'dddd'}])
    console.log ( 
        obs.g
     )

},2000)

function cccc( {checked} = {}) {
    obs.old = checked
    console.log( obs.old )
}

function Index() {
    console.log (  $.b.a )
    return (
        dom.div({},
            dom.h2({},$.b.a),
            // dom.h2({},date.map( v => dom.p({class: ['jj-',v.b]},v.a))),
            dom.h1({class: ['show-', $.old] }, 
                $.old.map( v => v?'ddd':'saaaa'), 
                $.num.map( v => dom.p({},v))
            ),
            dom.input({type:"checkbox", checked: $.old, '@change': cccc}),
            $.g.map( v => dom.p({}, v.a ? v.a: v) )
        )
    )
}

document.getElementById('app').appendChild(Index())