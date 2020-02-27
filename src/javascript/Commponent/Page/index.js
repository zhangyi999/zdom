import dom,{ Commponent } from '../../ZDom'

import './index.css'

function Page (...child) {
    return dom.div({class:['p_Page ',this.class] , '@die': this.die}, child)
}

export default Commponent(Page)
