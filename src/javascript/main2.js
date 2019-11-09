import Obs from './ZDom/Obs'
import dom from './ZDom/newDomEidt'

import {ObjectMapFull, ObjectMap} from './ZDom/public'

import checkTypes from './ZDom/types'

const date = new Obs({a: new Obs(dom.b({},'HH')), b: new Obs(33)})

// function ObjectMapFullFilterObs( obj, call ) {
    
//     if ( obj instanceof Obs ) return ObjectMapFullFilterObs( obj, call )
//     return ObjectMap(obj, (v, k) => {
//         if ( filter && obj instanceof filter ) return call(v, k)
//         if ( checkTypes( v ) === 'Object') return ObjectMapFull(v, call, {filter})
//         if ( checkTypes( v ) === 'Array' ) return v.map( v => ObjectMapFull( v, call , {filter}))
//         return call(v, k)
//     })
// }


const date1 = {
    a:1,
    b:'3',
    c:[
        1,
        {
            i:{
                j:'31'
            }
        }
    ],
    g: {
        // h:21,
        i:{
            j:'31',
            l: {
                a: 1
            }
        }
    }
}


setTimeout(()=>{

    console.log( Object.keys(date) )
    date.get.a.set(dom.b({},'321312'))
    date.get.b.set('ggg')

    // console.log ( 
    //     ObjectMapFull(date, (v, k) => {
    //         return v + 'id' + k
    //     }, {filter:Obs}),
    //     checkTypes(date)
    //  )

},1000)

function Index() {
    console.log ( date )
    return (
        dom.div({},
            dom.h2({},date.map( v => dom.p({class: ['jj-',v.b]},v.a)))
        )
    )
}

document.getElementById('app').appendChild(Index())