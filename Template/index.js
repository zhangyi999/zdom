import dom,{ Commponent, Obs } from '../../ZDom'

// import './index.css'

function name (...child) {
    const $ = new Obs({
        d : 'a'
    })
    return dom.div({class:'p_name'}, child)
}

export default Commponent(name)