const fs = require('fs')

const exampless_path = __dirname + '/Template/'
const filePath ={
    p : __dirname + '/src/javascript/Page/',
    c : __dirname + '/src/javascript/Commponent/',
    pc : __dirname + '/src/javascript/PageCommponent/'
}

const ObsHtml = (
    `
    const $ = new Obs({
        d : 'a'
    })
    `
)

const indexCss = `import './index.css'`

const examples_js = (name, css,isObs) => (
`import dom,{ Commponent, Obs } from '../../ZDom'
${css? indexCss : ''}
function ${name} (...child) {
    ${isObs? ObsHtml : ''}
    return (
        dom.div({class:'p_${name}'}, child)
    )
}

export default Commponent(${name})
`
);



// 找到模板
function getExamples(  name, type = 'p_path', Css, isObs ) {
    if( name === undefined ) throw 'need file name'
    const p_path = filePath[type]
    const fl = p_path+name
    if (!fs.existsSync(fl)) {
        fs.mkdirSync(fl);
        fs.writeFile(fl+'/index.js', examples_js(name, Css, isObs),'utf8', e => {
            if ( Css !== null ) {
                fs.writeFile(fl+'/index.css', `.p_${name}{}`,'utf8', e => {
                    console.log ( 'created page in ', fl )
                })
            } else {
                console.log ( 'created page in ', fl )
            }
            
        });
    } else {
        console.log ( ' error: page created ' )
    }
}

module.exports = getExamples