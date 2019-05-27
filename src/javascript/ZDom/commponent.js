import Observable, {replaceStr} from './observable'

function Commponent( ZDomCommponFunction ) {
    return function ( attr, ...chlid ) {
        const props = Observable(attr)
        const dom = ZDomCommponFunction.call(props, chlid);
        props.loaded?setTimeout(()=> props.loaded(),0):''; 
        props.die?dom.ondie = props.die:'';
        return dom
    }
}

export default Commponent 

export {
    replaceStr ,
    Observable
}