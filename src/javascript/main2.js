
import dom from './ZDom/newDomEidt'

import observable from './ZDom/observable'

import Obs from './ZDom/Obs'

const [ $, obs ] = observable( {
    // num: 1,
    // b:{
    //     a:2
    // },
    g: [
        {a:'123'},
        // {a:'123231'}
    ],
    // old: true
} )


const data = new Obs([new Obs({a:new Obs(23)}),new Obs(3)])
console.log (
        $.g,
        'sdffffffff',
        data[0]
    )

setTimeout(()=>{
    // console.log( Object.keys(date) )
    // date.get.a.set(dom.b({},'321312'))
    // date.get.b.set('ggg')
    // obs.b.a = ('pppppp')
    // console.log (
    //     $
    // )
    // obs.old = false
    // obs.g.add([1233,444,2,3123,{a:'dddd'}])
    // obs.g = ['ff','ggg', 'jjshsh']
    // obs.g.add(['0000','sdf'])
    
    
    // data.get[1].set( '00001' )
    setTimeout(()=>{

// data.get[0].get.a.set(1233213)
        console.log ( 
            obs.g,'sdffffff-----'
        )
        obs.g[0] = {a:'sssss'}
        // setTimeout(()=>{
        //     console.log ( 
        //         obs.g[0] = '123213'
        //     )
        // },2000)
    },2000)

},0)

function cccc( {checked} = {}) {
    obs.old = checked
    console.log( obs.old )
}

function Index() {
    // console.log (  $.b.a )
    return (
        dom.div({},
            // dom.h2({},$.b.a),
            // // dom.h2({},date.map( v => dom.p({class: ['jj-',v.b]},v.a))),
            // dom.h1({class: ['show-', $.old] }, 
            //     $.old.map( v => v?'ddd':'saaaa'), 
            //     $.num.map( v => dom.p({},v))
            // ),
            // dom.input({type:"checkbox", checked: $.old, '@change': cccc}),
            $.g.map( v => v.get.a.map( v => dom.p({}, v.a ))),
            // data.map( v => dom.p({}, v.get.a || v ))
        )
    )
}

document.getElementById('app').appendChild(Index())