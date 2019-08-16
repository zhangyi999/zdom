
const arr = []
const len = 100
for ( let i = 0; i < len; i ++ ) {
    arr.push(i)
}

const a = [ v => 2*v , v => v+10, v => v*v ]

!function(){
    console.time('1')
    const b = []
    for ( let i = 0; i < len; i ++ ) {
        const alen = a.length
        let v = i;
        for ( let i1 = 0; i1 < alen; i1++ ) {
            v = a[i1](v)
        }
        b.push(v)
    }
    console.log(b)
    console.timeEnd('1')
}();

!function(){
    console.time('11')
    const b = []
    const alen = a.length
    for ( let i1 = 0; i1 < alen; i1++ ) {
        for ( let i = 0; i < len; i ++ ) {
            b[i] = a[i1](b[i] || i)
        }
    }
    
    console.log(b)
    console.timeEnd('11')
}();
