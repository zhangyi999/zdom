const fs = require('fs')

const exampless_path = __dirname + '/Template/'
const filePath ={
    p : __dirname + '/src/javascript/Page/',
    c : __dirname + '/src/javascript/Commponent/',
    pc : __dirname + '/src/javascript/PageCommponent/'
} 

const examples_js = name => (
`import dom,{ Commponent, Obs } from '../../ZDom'

// import './index.css'

function ${name} (...child) {
    const $ = new Obs({
        d : 'a'
    })
    return dom.div({class:'p_${name}'}, child)
}

export default Commponent(${name})
`
);



// 找到模板
function getExamples(  name, type = 'p_path' ) {
    if( name === undefined ) throw 'need file name'
    const p_path = filePath[type]
    const fl = p_path+name
    if (!fs.existsSync(fl)) {
        fs.mkdirSync(fl);
        fs.writeFile(fl+'/index.js', examples_js(name),'utf8', e => {
            console.log ( 'created page in ', fl )
        });
    } else {
        console.log ( ' error: page created ' )
    }
}

module.exports = getExamples