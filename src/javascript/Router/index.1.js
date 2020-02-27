import dom,{ Commponent, addPorto } from '../ZDom'
import './index.css'
import Page from '../Commponent/Page'

const routerList = {}

const ontFindPageDom = (
    Page({},
        dom.div({style: 'color: #fff;text-align: center;font-size: 100px;'},'404')
    )
)

const config = {
    body: null,
    initUrl : null,
    stackPages: true, // 如果启用，则当您进行越来越深的导航时，导航链中的所有先前页面都不会从DOM中删除。例如，如果您有5个步骤（5页）中的某些表格，并且在最后5页上时，则需要访问第一页上的表格，这可能会很有用。
}


/**
 * {
 *  url: 'index',
 *  req,
 *  dom,
 *  stackPages
 * }
 */
let pages = 1
const historyList = []
window.historyList = historyList

function getData( ) {
    const url = window.location.pathname.substring(1)
    const search = window.location.search
    const [, data = ''] = search.split('?')
    const req = {}
    data.split('&').map( v => {
        if ( v === undefined ) return
        const obj = v.split('=') 
        obj[0] !== '' && obj[1] ? req[obj[0]] = obj[1] : ''
    })
    return {
        page: url === ''? 'index': url, 
        req
    }
}



function upDatePage( req, doms ) {
    return doms instanceof Function ? doms(req) : doms instanceof Element ? doms : dom.div({}, doms)
}

function getDomRouter( page, req ) {
    const doms = routerList[page] 
    return upDatePage( req, doms || ontFindPageDom )
}

function getPage( ) {
    const { page, req } = getData( )
    return getDomRouter( page, req )
}

function addPage( stackPages ) {
    const Dom = getPage( )
    if ( stackPages === true ) {
        config.body.appendChild( Dom )
    } else {
        config.body.lastChild === null ?
            config.body.appendChild( Dom ):
            config.body.replaceChild( Dom, config.body.lastChild)
    }
    return Dom
}

// 后退: pageIndex 当前页
function removePage( pageIndex ) {
    const nowPage = historyList[pageIndex-1]
    if ( nowPage.stackPages === true ) {
        nowPage.dom.remove()
    }
}

function initPage( ) {
    const init = config.initUrl instanceof Function ? config.initUrl() : ( config.initUrl || 'index' )
    history.replaceState(1, null, '/'+  init )
    const { page, req } = getData( )
    const stackPages = config.stackPages
    const Dom = addPage( stackPages )

    historyList.push({
        url: page,
        req,
        stackPages,
        dom: stackPages === true ? Dom : ''
    })
}



window.addEventListener( 'load',() => {

    initPage( );
    document.querySelector('body').addEventListener( 'click', function( event ){

        let e = event.target
        while ( e !== null && e.className !== 'link') {
            e = e.parentElement
        }

        if ( e === null ) return 
        
        event.stopImmediatePropagation();
        const url = e.getAttribute('href')
        const stackPages = e.getAttribute('stackPages') || false // 默认替换模式
        Router.navigate( url, {stackPages})
    })
    // let pagesPev = 1
    window.addEventListener("popstate", function(e) {   
        const isNewPage = e.state > historyList.length
        // 前进
        if( pages < e.state ) {
            if ( isNewPage ) {
                const index = historyList.length - 1
                const hist = historyList[index]
                history.replaceState(e.state, null, '/'+  hist.url )
                addPage( false )
            } else {
                
            }
            // addPage( stackPages )
        } else if( pages > e.state ) {
            removePage( pages )
            addPage( false )
        }

        // history.replaceState(index, null, '/'+  hist.url )
        // historyList.length - 1 === index ? '' : setRouter()
        pages = e.state
    });
})
    
 
const Router = Commponent(function( ...child ) {
    return (
        dom.div({ 
            class: 'link' , 
            'href': this.href,
            'stackPages':  this.stackPages
        }, child)
    )
})

addPorto( Router, 'addPage', function ({ url, dom }) {
    routerList[url] = dom
    return this
})

addPorto( Router, 'removePage', function (url) {
    delete routerList[url]
    return this
})

addPorto( Router, 'init', function ( el, stackPages = false )  {
    config.body = el
    config.stackPages = stackPages
})

/**
 * 1. 前进
 * 2. 替换
 * 3. 刷新
 * 4. 后退
 */

// 替换
// function replacePage( pageIndex, newDom ) {
//     const nowPage = historyList[pageIndex]
//     if ( nowPage.stackPages === true ) {
//         config.body.replaceChild(newDom, nowPage.dom)
//     } 
//     // else {
//     //     let i = pageIndex --
//     //     while (historyList[i].stackPages !== true && pageIndex > 0 ) {
//     //         i --
//     //     }
//     //     if ( i === 0 ) {
//     //         config.body.appendChild( newDom )
//     //     } else {
//     //         config.body.insertBefore( newDom, historyList[i+1].dom.nextSibling )
//     //     }
//     // }
//     // historyList[pageIndex].dom = newDom
// }

// options:noPushState = true 不改变历史记录跳转
addPorto( Router, 'navigate', function ( url, options = {} ) {
    if ( options.noPushState === true ) {
        history.replaceState(history.state,null,'/'+ url)
        addPage( false )
        return
    }
    history.pushState( history.state + 1 ,null,'/'+ url)
    const { page, req } = getData( )
    const DOM = addPage( options.stackPages ) 
    historyList.push({
        url: page,
        req,
        dom: options.stackPages === true?DOM:'',
        stackPages: options.stackPages
    })
    pages = history.state
    console.log( pages, 'pages' )
})

addPorto( Router, 'back', function ( url ) {
    if ( pages === 0 ) return
    url ? (
        historyList[pages - 1].url = url
    ): '';
    history.go(-1)
})

addPorto( Router, 'refreshPage', function ( ) {
    const Dom = addPage( false )
    historyList[history.state].stackPages? historyList[history.state].dom = Dom : ''
})

window.Router = Router

export default Router

