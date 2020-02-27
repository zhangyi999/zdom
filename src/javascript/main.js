
// import dom,{Obs, Commponent} from './ZDom'

import './init.css'

import Index from './Page/Index'

import Router from './Router'

Router.init(document.getElementById('app'), true)

Router.addPage({
    url: 'index',
    dom: Index
})