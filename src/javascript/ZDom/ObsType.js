const Obs = {
    __get: 'data',
    __set: newValue => {
        this.__get = newValue
        this.domtree.map( v => v(3, newValue) );
        this.attrtree.map( v => v(newValue));
        this.watch.map( v => v(newValue) );
    },
    renders:[],
    domtree:[],
    attrtree:[],
    watch:[]
}
// this.renders = [] 
        // this.domtree = []
        // this.attrtree = []
        // this.watch = []