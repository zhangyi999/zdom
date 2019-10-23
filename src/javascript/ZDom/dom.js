function createDomTreeByPrototype(el) {
    function Dom(callBack) {
        this.callBack = callBack
    }
    const elObje = {}
    el.map( v  => {
        elObje[v] = {
            get() {
                return function(attrs = {}, ...children) {
                    return this.callBack({ attrs:attrs, child:children || '', nodeName:v })
                }
            }
        }
    })
    //函数即对象
    Object.defineProperties(Dom.prototype,elObje)
    return Dom
}

//继承模式，可以搞
const el = 'article,button,nav,ruby,rt,rp,optgroup,svg,path,embed,object,frame,iframe,textarea,tbody,thead,hr,select,option,table,tr,th,dl,td,dd,div,li,ul,p,a,b,span,h1,h2,h3,h4,h5,h6,h7,s,i,input,img,form,canvas,section,main,footer,header,link,label,br'.split(',')
const DomPrototype = createDomTreeByPrototype(el)

export default DomPrototype;