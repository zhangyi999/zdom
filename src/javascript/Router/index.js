import dom,{ Commponent, addPorto } from '../ZDom'
import './index.css'
import Page from '../Commponent/Page'

const routerList = {}

const ontFindPageDom = () => (
    Page({},
        dom.div({style: 'color: #fff;text-align: center;font-size: 100px;'},'404')
    )
)

const config = {
    body: null,
    initUrl : null,
    animation: null,
    stackPages: false, // 如果启用，则当您进行越来越深的导航时，导航链中的所有先前页面都不会从DOM中删除。例如，如果您有5个步骤（5页）中的某些表格，并且在最后5页上时，则需要访问第一页上的表格，这可能会很有用。
}

function getReq( ) {
    const url = window.location.pathname.substring(1)
    const [, data = ''] = window.location.search.split('?')
    return {
        data,
        url
    }
}

function getData( _path ) {
    const {
        data,
        url
    } = getReq( _path )
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
        addPageDom( Dom )
    } else {
        config.body.lastChild === null ?
            addPageDom( Dom ):
            replacePageDom ( Dom )
    }
    return Dom
}

function pageList() {
    const list = {}
    // 当前页码
    let pages = 0
    return {
        getPage( page ) {
            // 获取 指定页面 的 url
            return list[ page || history.state.page ]
        },
        setPage({url,page}, type = true) { // type = false 为仅设置 路劲列表
            if ( type === true ) {
                // 页码
                pages = page
                if ( list[page] === undefined ) {
                    history.pushState( {url,page} ,null,'/'+ url)
                } else history.replaceState({url,page},null,'/'+ url)
            }
            list[page] = url
            return this
        },
        pages() {
            return pages
        },
        getPevPage() {
            return list[pages - 1]
        }
    }
 }
 const PageList = pageList()

function initPage( ) {
    const init = config.initUrl instanceof Function ? config.initUrl() : ( config.initUrl || 'index' )
    PageList.setPage({url: init,page:1})
    addPage( false )
}

function removePage(  ) {
    let d = 0
    config.body.lastChild.$ondie ? config.body.lastChild.$ondie() : ''
    config.animation !== null ? (
        config.body.lastChild.className += ' '+ animationClass[config.animation].stop,
        d = 300
    ): ''
    setTimeout(() => {
        config.body.lastChild.remove()
    }, d);
    
}


const animationClass = [
    { start: 'p_Router_start', stop: 'p_Router_die'}
]
function addPageDom( Dom ) {
    config.animation !== null ? Dom.className += ' '+ animationClass[config.animation].start : '';
    config.body.appendChild( Dom )
}

function replacePageDom ( Dom ) {
    config.animation !== null ? Dom.className += ' '+ animationClass[config.animation].start : '';
    config.body.replaceChild( Dom, config.body.lastChild)
}

// p_Router_start

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
    window.addEventListener("popstate", function( even ) {
        // 页面跳转逻辑：更新 url -> replaceUrl -> addPage
        if ( even.state === null ) return
        const pages = even.state.page

        // history 里 的 当前页
        const historyPagesUrl = even.state.url

        // 上一页
        const prevPages = PageList.pages()

        // list 里 的 当前页
        const pagesUrl = PageList.getPage( pages )
        if ( prevPages === pages ) return
        // 修改当前 url
        PageList.setPage({url: pagesUrl, page: pages})
        

        if ( prevPages > pages ) {
            // 后退
            config.stackPages === true ? removePage(  ) : ''
            if ( historyPagesUrl !== prevPages ) addPage( false )
        } else if ( prevPages < pages ) {
            // 前进
            addPage( config.stackPages )
        }
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

addPorto( Router, 'init', function ( el, { stackPages = false , animation = null } = {})  {
    config.body = el
    config.stackPages = stackPages
    config.animation = animation
    return this
})

addPorto( Router, 'addPage', function ({ url, dom }) {
    routerList[url] = dom
    return this
})

/**
 * 1. 前进
 * 2. 替换
 * 3. 刷新
 * 4. 后退
 */


 // options:noPushState = true 不改变历史记录跳转
addPorto( Router, 'navigate', function ( url, options = {} ) {
    if ( options.noPushState === true ) {
        PageList.setPage({url,page: history.state.page})
        addPage( false )
    } else {
        PageList.setPage({url,page: history.state.page + 1})
        addPage( config.stackPages )
    }
})

addPorto( Router, 'back', function ( url ) {
    // 虚拟配置后 在去 popstate 事件中调整
    PageList.setPage({ url: url || history.state.url ,page: history.state.page - 1 }, false)
    history.go(-1)
})

addPorto( Router, 'refreshPage', function ( ) {
    addPage( false )
})

addPorto( Router, 'refreshPrvePage', function ( url ) {
    // 虚拟配置后 在去 popstate 事件中调整
    PageList.setPage({ url: url || history.state.url ,page: history.state.page - 1 }, false)
})

export default Router

