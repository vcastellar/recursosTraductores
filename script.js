const search = document.getElementById("search")

search.addEventListener("keyup", function() {

let term = search.value.toLowerCase()

let cards = document.querySelectorAll(".card")

cards.forEach(function(card){

let text = card.innerText.toLowerCase()

if(text.includes(term)){

card.style.display="block"

}else{

card.style.display="none"

}

})

})
