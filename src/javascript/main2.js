
import dom from './ZDom/newDomEidt'

// import observable from './ZDom/observable'

import Obs from './ZDom/Obs'

// function Observable( obj, key, callback ) {
//     let old = value
//     Object.defineProperty(obj, key, {
//         enumerable: true, // 可枚举
//         configurable: true, // fales 不能再define
//         get() {
//             return callback( key )
//         },
//         set(newVal) {
//             callback
//         }
//     });
//     return obj
// } 

// function proessArr ( arr ) {
//     const newArr = []
//     arr.map (( v , i ) => {
//          Object.defineProperty(newArr, i, {
//             enumerable: true, // 可枚举
//             configurable: true, // fales 不能再define
//             get() {
//                 return arr[i]
//             },
//             set(newVal) {
//                 arr[i] = newVal
//             }
//         });
//     })
//     return newArr
// }
// const  arr = [1,2,3,4]
// const h = proessArr ( arr )
// console.log ( h[0] )
// setTimeout(()=>{
//     arr.unshift(99)
//     // h[0] = 3
//     console.log ( h[0] ,arr)
// },1000)

// return

// const [ $, obs ] = observable( {
//     // num: 1,
//     // b:{
//     //     a:2
//     // },
//     g: [
//         ['sdf','qweewq'],
//         ['sdfdsf','qweesdfwq']
//         // {a:'123231'}
//     ],
//     // old: true
// } )

// console.log (
//     $.g,
//     obs,
//     '$$$$$$$$$$$$$$$$$$$'
// )
  
const data = new Obs([
    new Obs({
        a:new Obs(23)
    })
])
console.log ( data, 'dafasasd' )
// const data = new Obs({
//     a:new Obs(23)
// })


// console.log (
//         $.g,
//         'sdffffffff',
//         data
//     )

setTimeout(()=>{

                // obs.g[0] = {a:'123-----213'}
                // obs.g = ([{a:'dddd'},{a:'dddd'}])
                // console.log(obs.g , $.g, 'sdf$.g')
//     // console.log( Object.keys(date) )
//     // date.get.a.set(dom.b({},'321312'))
//     // date.get.b.set('ggg')
//     // obs.b.a = ('pppppp')
//     // console.log (
//     //     $
//     // )
//     // obs.old = false
    
//     // obs.g = ['ff','ggg', 'jjshsh']
// //     // obs.g.add(['0000','sdf'])
// //      console.log ( 
// //             data.get[0],'sdffffff-----'
// //         )
// //     // data.get[0].get.a.set('fsdsdfsdf')
// //     // data.get[1].set( '00001' )

// //         data.get[0].set({a:new Obs('fdfffff')})
// //     setTimeout(()=>{

// // // data.get[0].get.a.set(1233213)
// //        console.log ( 
// //             data,'sdffffff-----'
// //         )
// //         // console.log ( data.get[0].get )
// //         data.get[0].get.a.set('fsdf')
// obs.g[0] = {a:'fdfds'}
//         setTimeout(()=>{
//             obs.g.add([{a:'dd1dd'},{a:'dddd'}])
//         //     // console.log ( 
//         //     //     // obs.g[0].a = '123--11---213'
//         //     // )
            // setTimeout(()=>{

            //     obs.g[0].a = 'd323123ddd'
            //     console.log ( 
            //     obs.g[0],
            //     $.g
            //         // obs.g[2].a = '123--11---213',
            //         // obs.g[0] = {a:'fdfds'}
            //     )
            // },1000)
//         },2000)
//     },4000)

},1000)

// function cccc( {checked} = {}) {
//     obs.old = checked
//     console.log( obs.old )
// }

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
            // $.g.map( v => {
            //     console.log(v,'vvvv' )
            //     return dom.p({}, v.map( v => dom.b({},v)))
            // }),
            data.map( v => {
                console.log ( v,'vvv' )
                return dom.p({}, v.a || v )
            })
        )
    )
}

document.getElementById('app').appendChild(Index())