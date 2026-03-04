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

const HIDDEN_CHARACTER_DEFINITIONS = [
  { char: "\u00A0", name: "Espacio de no separación (NBSP)" },
  { char: "\u200B", name: "Espacio de ancho cero (ZWSP)" },
  { char: "\u200C", name: "No-unión de ancho cero (ZWNJ)" },
  { char: "\u200D", name: "Unión de ancho cero (ZWJ)" },
  { char: "\u2060", name: "Separador de palabras invisible (WJ)" },
  { char: "\uFEFF", name: "Marca de orden de bytes / no-separación (BOM)" },
  { char: "\u200E", name: "Marca izquierda-a-derecha (LRM)" },
  { char: "\u200F", name: "Marca derecha-a-izquierda (RLM)" },
  { char: "\t", name: "Tabulación" },
  { char: "\r", name: "Retorno de carro" },
  { char: "\n", name: "Salto de línea" }
];

function getReadableChar(char) {
  const code = char.codePointAt(0).toString(16).toUpperCase().padStart(4, "0");
  const escaped = JSON.stringify(char).slice(1, -1);
  return `U+${code} (${escaped})`;
}

function countOccurrences(text, char) {
  return [...text].filter((currentChar) => currentChar === char).length;
}

function detectHiddenChars() {
  const text = document.getElementById("cleanInput").value;
  const panel = document.getElementById("hiddenCharsPanel");
  const list = document.getElementById("hiddenCharsList");
  const summaryElement = document.getElementById("cleanSummary");

  list.innerHTML = "";

  if (!text) {
    panel.hidden = true;
    summaryElement.innerText = "Pega un texto primero para detectar caracteres ocultos.";
    return;
  }

  const foundChars = HIDDEN_CHARACTER_DEFINITIONS
    .map((definition) => ({
      ...definition,
      count: countOccurrences(text, definition.char)
    }))
    .filter((definition) => definition.count > 0);

  if (!foundChars.length) {
    panel.hidden = true;
    summaryElement.innerText = "No se detectaron caracteres ocultos de la lista analizada.";
    return;
  }

  foundChars.forEach((definition, index) => {
    const row = document.createElement("label");
    row.className = "option";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "hidden-char-check";
    checkbox.id = `hiddenChar_${index}`;
    checkbox.dataset.char = definition.char;

    const textNode = document.createTextNode(`${definition.name} · ${getReadableChar(definition.char)} · ${definition.count} coincidencia(s)`);

    row.appendChild(checkbox);
    row.appendChild(textNode);
    list.appendChild(row);
  });

  panel.hidden = false;
  summaryElement.innerText = "Caracteres ocultos detectados. Marca los que quieras eliminar al limpiar.";
}

function removeSelectedHiddenChars(text) {
  const selectedChars = Array.from(document.querySelectorAll(".hidden-char-check:checked"))
    .map((checkbox) => checkbox.dataset.char)
    .filter(Boolean);

  return selectedChars.reduce((result, char) => result.split(char).join(""), text);
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

  text = removeSelectedHiddenChars(text);

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
