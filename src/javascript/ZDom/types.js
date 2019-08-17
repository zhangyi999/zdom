function checkTypes( data ) {
    return Object.prototype.toString.call(data).replace(/object|\[|\]| /g,'')
}

export default checkTypes