let deleteDiv = document.querySelector(".delete-dealer")
let bgBlock = document.querySelector(".background-block")
let chargeDiv = document.querySelector(".charge-dealer")
let tableBody = document.querySelector("tbody")

async function deleteDealer(bool,id = "",name = "") {
    if(bool == false){
        bgBlock.style.display = "none"
        deleteDiv.style.display = "none"
        var new_element = button.cloneNode(true);
        button.parentNode.replaceChild(new_element, button);
        button = new_element
        return;
    }
    let message = document.querySelector(".delete-dealer .message")
    let button = document.querySelector(".delete-dealer button")
    message.innerHTML = `are you sure you want to delete ${name} ?`
    button.addEventListener("click",async ()=>{
        await deleteIt(id)
        bgBlock.style.display = "none"
        deleteDiv.style.display = "none"
        var new_element = button.cloneNode(true);
        button.parentNode.replaceChild(new_element, button);
        button = new_element
    })
    bgBlock.style.display = "block"
    deleteDiv.style.display = "grid"
}


async function deleteIt(id){
    await fetch('/admin/deleteDealer', {
            method: 'POST', 
            body: JSON.stringify({id}), 
            headers: {'Content-type': 'application/json; charset=UTF-8'}
        })
    displayTable()
}

function chargeDealer(bool,id,name) {
    if(bool == false){
        bgBlock.style.display = "none"
        chargeDiv.style.display = "none" 
        var new_element = button.cloneNode(true);
        button.parentNode.replaceChild(new_element, button);
        button = new_element
        return;
    }
    let button = document.querySelector(".charge-dealer button")
    button.addEventListener("click",async ()=>{
        let value = document.querySelector(".charge-dealer #amount").value
        await chargeIt(id,value)
        bgBlock.style.display = "none"
        chargeDiv.style.display = "none" 
        var new_element = button.cloneNode(true);
        button.parentNode.replaceChild(new_element, button);
        button = new_element
    })
    bgBlock.style.display = "block"
    chargeDiv.style.display = "grid"
}

async function chargeIt(id,balance){
    await fetch('/admin/chargeDealer', {
            method: 'POST', 
            body: JSON.stringify({id,balance}), 
            headers: {'Content-type': 'application/json; charset=UTF-8'}
        })
    displayTable()
}


async function getDealers(){
    let data = await fetch("/admin/getAllDealers",{
                    method:"post",
                    headers: { 'Content-Type': 'application/json' },
                })
    let allDealers = await data.json()
    return allDealers
}

async function displayTable(){
    makeTable(await getDealers())
}

function makeTable(allDealers){
    tableBody.innerHTML = ""
    allDealers.forEach((element,i) => {
        
        tableBody.innerHTML += `
        <tr>
            <th scope="row">${i+1}</th>
            <td>${element.username}</td>
            <td>${element.password}</td>
            <td>${element.balance}</td>
            <td class="bg-danger pointer text-white" onclick="deleteDealer(true,'${element._id}','${element.username}')">Delete</td>
            <td class="bg-primary pointer text-white" onclick="chargeDealer(true,'${element._id}','${element.username}')">Charge</td>
        </tr>`
    });
}

displayTable()

async function search(data){
    if(data.trim() == ""){
        return displayTable()
    }
    data = data.toLowerCase()
    let result = await getDealers()
    let file = []
    result.forEach(element =>{
        let left = element.username.slice(0,data.length)
        if(left == data){
            file.push(element)
        }
    })
    makeTable(file)
}

