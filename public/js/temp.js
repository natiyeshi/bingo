// let birthDay = new Date("2002-4-24")
// // let remain = Date.now() - birthDay.getTime() 
// // remain = Math.round((remain / 86400000) / 365)
// // console.log(remain);
// console.log(new Date("2002-4-24").getTime());
// console.log(new Date("2022-12-24").getTime());
// console.log(new Date("2023-1-24").getTime());
// console.log((new Date("2023-3-1").getTime()));

db.collection.update({},{ $pull: 
    { array_field: { field_to_delete: value } } }
    ,{multi:true})
