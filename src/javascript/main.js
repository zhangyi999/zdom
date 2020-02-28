
// import dom,{Obs, Commponent} from './ZDom'

import './init.css'

import Index from './Page/Index'

import Router from './Router'

Router.init(
    document.getElementById('app'), 
    {
        animation: 0,
        // stackPages: true
    }
).addPage({
    url: 'index',
    dom: Index
})