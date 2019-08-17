/**
 * 把所有类型的数据都对象化
 * 添加 get, set, wacth, render 方法
 */

// const data = initData('ss')
// dom.div({
//     class: JoinData( data, '  a' )
// },
//     data.render( v => {
//         return dom.div({},'sdf')
//     })
// )


function addPorto(obj, key, val) {
    Object.defineProperty(obj, key, {
        enumerable: false,
        configurable: false,
        writable: false,
        value: val
    })
}

function objectAny( any ) {
    if ( typeof any === 'string' ) any = new String(any)
    else if ( any instanceof Boolean ) any = new Boolean(any)
    else if ( typeof any === 'number' ) any = new Number(any)
    console.log([any],any instanceof String)
    return any
}

function initData( any ) {
    any = objectAny( any )
    const data = { 
        renderAtt:[], 
        render: fn => data.renderAtt.push(fn),
        get () {
            let a = ''
            this.renderAtt.map( v => {
                a += v(any)
            })         
            return a
        },
        set( newAny ) {
            any = newAny
        }
    }
    addPorto( any, 'Observable', data )
    return any
}

window.initData = initData