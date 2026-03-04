// BUSCADOR DE RECURSOS

document.getElementById("searchResources").addEventListener("keyup",function(){

let term=this.value.toLowerCase()

document.querySelectorAll(".card").forEach(card=>{

card.style.display=card.innerText.toLowerCase().includes(term)?"block":"none"

})

})


// CONTADOR DE PALABRAS

document.getElementById("textInput").addEventListener("input",function(){

let text=this.value

let words=text.trim().split(/\s+/).filter(Boolean)

document.getElementById("words").innerText=words.length

document.getElementById("characters").innerText=text.length

document.getElementById("charactersNoSpaces").innerText=text.replace(/\s/g,'').length

})


// LIMPIAR TEXTO

function cleanText(){

let text=document.getElementById("cleanInput").value

text=text.replace(/\s+/g," ")

document.getElementById("cleanOutput").value=text

}


// BUSQUEDAS

function searchWR(){

let q=document.getElementById("dictionarySearch").value

window.open("https://www.wordreference.com/es/en/translation.asp?spen="+q)

}

function searchLinguee(){

let q=document.getElementById("dictionarySearch").value

window.open("https://www.linguee.com/english-spanish/search?source=english&query="+q)

}

function searchDeepl(){

let q=document.getElementById("dictionarySearch").value

window.open("https://www.deepl.com/translator#en/es/"+q)

}

function searchReverso(){

let q=document.getElementById("dictionarySearch").value

window.open("https://context.reverso.net/translation/english-spanish/"+q)

}


// CONVERTIR NUMEROS SIMPLE

function convertNumber(){

let map={
one:1,two:2,three:3,four:4,five:5,six:6,seven:7,eight:8,nine:9,ten:10
}

let text=document.getElementById("numberInput").value.toLowerCase()

document.getElementById("numberResult").innerText=map[text]||"No reconocido"

}


// CONVERTIR FECHA

function convertDate(){

let input=document.getElementById("dateInput").value

let d=new Date(input)

if(!isNaN(d)){

let months=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"]

let result=d.getDate()+" de "+months[d.getMonth()]+" de "+d.getFullYear()

document.getElementById("dateResult").innerText=result

}

}


// CALCULADORA

function calculateBudget(){

let price=parseFloat(document.getElementById("pricePerWord").value)

let words=parseFloat(document.getElementById("wordCount").value)

let total=price*words

document.getElementById("budgetResult").innerText="Total: "+total.toFixed(2)+" €"

}


// DARK MODE

document.getElementById("toggleDark").onclick=function(){

document.body.classList.toggle("dark")

}
