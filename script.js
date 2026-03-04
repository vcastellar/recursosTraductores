// BUSQUEDA DE RECURSOS

const searchInput = document.getElementById("searchResources");
const resourceCards = document.querySelectorAll(".resources .card");

searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim().toLowerCase();

  resourceCards.forEach((card) => {
    const text = card.innerText.toLowerCase();
    card.style.display = text.includes(query) ? "block" : "none";
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

// LIMPIADOR DE TEXTO AVANZADO

function removeDuplicateLines(text) {
  const lines = text.split(/\r?\n/);
  const seen = new Set();
  return lines.filter((line) => {
    const normalized = line.trim();
    if (!normalized) return true;
    if (seen.has(normalized)) return false;
    seen.add(normalized);
    return true;
  }).join("\n");
}

function stripHtml(text) {
  return text
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ");
}

function cleanText() {
  const inputElement = document.getElementById("cleanInput");
  const outputElement = document.getElementById("cleanOutput");
  const summaryElement = document.getElementById("cleanSummary");

  const options = {
    trimSpaces: document.getElementById("optTrimSpaces").checked,
    normalizeBreaks: document.getElementById("optNormalizeBreaks").checked,
    removeEmptyLines: document.getElementById("optRemoveEmptyLines").checked,
    removeDuplicateLines: document.getElementById("optRemoveDuplicateLines").checked,
    stripHtml: document.getElementById("optStripHtml").checked,
    normalizeUnicode: document.getElementById("optNormalizeUnicode").checked,
    removeDiacritics: document.getElementById("optRemoveDiacritics").checked,
    removeUrls: document.getElementById("optRemoveUrls").checked,
    removeEmails: document.getElementById("optRemoveEmails").checked,
    removeHashtags: document.getElementById("optRemoveHashtags").checked,
    removeEmojis: document.getElementById("optRemoveEmojis").checked,
    keepAlnum: document.getElementById("optKeepAlnum").checked
  };

  let text = inputElement.value;

  if (!text.trim()) {
    outputElement.value = "";
    summaryElement.innerText = "No hay texto para limpiar.";
    return;
  }

  if (options.normalizeUnicode) {
    text = text.normalize("NFKC");
  }

  if (options.stripHtml) {
    text = stripHtml(text);
  }

  if (options.removeUrls) {
    text = text.replace(/https?:\/\/\S+|www\.\S+/gi, " ");
  }

  if (options.removeEmails) {
    text = text.replace(/\b[\w.%+-]+@[\w.-]+\.[A-Za-z]{2,}\b/g, " ");
  }

  if (options.removeHashtags) {
    text = text.replace(/(^|\s)#[\p{L}\p{N}_-]+/gu, " ");
  }

  if (options.removeEmojis) {
    text = text.replace(/[\p{Extended_Pictographic}\uFE0F]/gu, "");
  }

  if (options.removeDiacritics) {
    text = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  const customPatternInput = document.getElementById("customPattern").value.trim();
  if (customPatternInput) {
    try {
      const customRegex = new RegExp(customPatternInput, "gu");
      text = text.replace(customRegex, " ");
      summaryElement.innerText = "Limpieza aplicada con patrón personalizado.";
    } catch {
      summaryElement.innerText = "El patrón regex no es válido. Se ignoró el patrón personalizado.";
    }
  }

  if (options.keepAlnum) {
    text = text.replace(/[^\p{L}\p{N}\s]/gu, " ");
  }

  if (options.removeDuplicateLines) {
    text = removeDuplicateLines(text);
  }

  if (options.removeEmptyLines) {
    text = text
      .split(/\r?\n/)
      .map((line) => line.trimEnd())
      .filter((line) => line.trim() !== "")
      .join("\n");
  }

  if (options.normalizeBreaks) {
    text = text.replace(/\r?\n+/g, " ");
  }

  if (options.trimSpaces) {
    text = text
      .split(/\r?\n/)
      .map((line) => line.trim().replace(/[ \t]{2,}/g, " "))
      .join("\n")
      .replace(/[ \t]{2,}/g, " ")
      .trim();
  }

  outputElement.value = text;

  const beforeChars = inputElement.value.length;
  const afterChars = text.length;
  const diff = beforeChars - afterChars;
  const diffMessage = diff > 0 ? `Se eliminaron ${diff} caracteres.` : "No hubo reducción de caracteres.";

  if (!summaryElement.innerText || !summaryElement.innerText.includes("patrón")) {
    summaryElement.innerText = `Limpieza completada. ${diffMessage}`;
  } else {
    summaryElement.innerText += ` ${diffMessage}`;
  }
}

async function copyCleanText() {
  const output = document.getElementById("cleanOutput").value;
  const summaryElement = document.getElementById("cleanSummary");

  if (!output) {
    summaryElement.innerText = "No hay texto limpio para copiar.";
    return;
  }

  await navigator.clipboard.writeText(output);
  summaryElement.innerText = "Texto limpio copiado al portapapeles.";
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
