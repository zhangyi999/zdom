
import dom from './ZDom'

import './init.css'
import Index from './Page/Index'

const head = document.getElementsByTagName('head')[0]

head.appendChild(
    dom.link({ 
        rel: 'stylesheet',
        media: 'all',
        type: 'text/css',
        cssURL: '//at.alicdn.com/t/font_1523230_yhz1njensc.css'
    })
);
document.getElementById('app').appendChild(Index())
