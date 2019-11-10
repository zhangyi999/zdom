
import dom,{Obs} from './ZDom'

function addList( ) {
    this.list.push([99,88,33,11,22])
}
 
function Index() {
    const $ = new Obs({
        date: '--',
        list: [1,2,3,4,5,6]
    })
    setInterval(() => {
        $.data.date = new Date().Format('yyyy.MM.dd hh:mm:ss')
    }, 1000);
    return (
        dom.div({},
            dom.h2({},'this is demo'),
            dom.div({}, 
                dom.h4({},'time'),
                dom.p({}, $.date )
            ),
            dom.div({}, 
                dom.h4({},'list'),
                dom.p({}, $.list.map( v => dom.p({}, v)) )
            ),
            dom.a({
                '@click': addList.bind( $ )
            },'加长列表')
        )
    )
}

document.getElementById('app').appendChild(Index())