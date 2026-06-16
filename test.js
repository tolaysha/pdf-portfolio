function flatten(arr) {
    let a;
    let newarr = [];
    let badarray = [];
    for (let item of arr) {
        a = item;
        if ( Array.isArray(item)){
            newarr.push(...flatten(item))
        } else{
            newarr.push(item)
        }
    }
    return newarr
}

console.log(flatten([1, 2, [3, 4, [5]]])); // result: [1,2,3,4,5]