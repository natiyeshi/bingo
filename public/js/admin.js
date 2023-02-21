let deleteDiv = document.querySelector(".delete-dealer")
let bgBlock = document.querySelector(".background-block")
let chargeDiv = document.querySelector(".charge-dealer")
function deleteDealer(bool) {
    if(bool == false){
        bgBlock.style.display = "none"
        deleteDiv.style.display = "none" 
        return;
    }
    bgBlock.style.display = "block"
    deleteDiv.style.display = "grid"
}

function chargeDealer(bool) {
    if(bool == false){
        bgBlock.style.display = "none"
        chargeDiv.style.display = "none" 
        return;
    }
    bgBlock.style.display = "block"
    chargeDiv.style.display = "grid"
}
