

var arr = [
  {title:'50 - 50'},
  {title:'100 - 100'},
  {title:'50 - 65'},
  {title:'100 - 125'}
];


arr.sort((a,b) =>{
    const i = a.title.split("-")
    let isum = 0
    i.forEach((num)=>
    isum += parseInt(num))

    const j = b.title.split("-")
    let jsum = 0
    j.forEach((num)=>
    jsum += parseInt(num))

    return isum - jsum
}
    
)


console.log(arr)