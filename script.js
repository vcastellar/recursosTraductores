// BUSCADOR DE RECURSOS

document.getElementById("searchResources").addEventListener("keyup", function () {
  const term = this.value.toLowerCase().trim();

  document.querySelectorAll(".card").forEach((card) => {
    card.style.display = card.innerText.toLowerCase().includes(term) ? "block" : "none";
  });
});

// CONTADOR DE PALABRAS

document.getElementById("textInput").addEventListener("input", function () {
  const text = this.value;
  const words = text.trim().split(/\s+/).filter(Boolean);

  document.getElementById("words").innerText = words.length;
  document.getElementById("characters").innerText = text.length;
  document.getElementById("charactersNoSpaces").innerText = text.replace(/\s/g, "").length;
});

// LIMPIAR TEXTO

function cleanText() {
  let text = document.getElementById("cleanInput").value;
  text = text.replace(/\s+/g, " ").trim();
  document.getElementById("cleanOutput").value = text;
}

// BUSQUEDAS

function getSearchQuery() {
  return encodeURIComponent(document.getElementById("dictionarySearch").value.trim());
}

function searchWR() {
  const q = getSearchQuery();
  if (!q) return;
  window.open(`https://www.wordreference.com/es/en/translation.asp?spen=${q}`, "_blank");
}

function searchLinguee() {
  const q = getSearchQuery();
  if (!q) return;
  window.open(`https://www.linguee.com/english-spanish/search?source=english&query=${q}`, "_blank");
}

function searchDeepl() {
  const q = getSearchQuery();
  if (!q) return;
  window.open(`https://www.deepl.com/translator#en/es/${q}`, "_blank");
}

function searchReverso() {
  const q = getSearchQuery();
  if (!q) return;
  window.open(`https://context.reverso.net/translation/english-spanish/${q}`, "_blank");
}

// CONVERTIR NUMEROS SIMPLE

function convertNumber() {
  const map = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
    ten: 10
  };

  const text = document.getElementById("numberInput").value.toLowerCase().trim();
  document.getElementById("numberResult").innerText = map[text] ?? "No reconocido";
}

// CONVERTIR FECHA

function convertDate() {
  const input = document.getElementById("dateInput").value;
  const d = new Date(input);

  if (!isNaN(d)) {
    const months = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
    const result = `${d.getDate()} de ${months[d.getMonth()]} de ${d.getFullYear()}`;
    document.getElementById("dateResult").innerText = result;
  } else {
    document.getElementById("dateResult").innerText = "Fecha no válida";
  }
}

// CALCULADORA

function calculateBudget() {
  const price = parseFloat(document.getElementById("pricePerWord").value);
  const words = parseFloat(document.getElementById("wordCount").value);

  if (isNaN(price) || isNaN(words)) {
    document.getElementById("budgetResult").innerText = "Completa ambos campos con números válidos";
    return;
  }

  const total = price * words;
  document.getElementById("budgetResult").innerText = `Total: ${total.toFixed(2)} €`;
}

// DARK MODE

document.getElementById("toggleDark").onclick = function () {
  document.body.classList.toggle("dark");
};
