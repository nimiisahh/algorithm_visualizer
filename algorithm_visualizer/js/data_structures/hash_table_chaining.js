let tableSize = 0;
let table = [];

/**
 * Initializes the hash table with the user-defined size.
 * Clears previous data and updates the hash function display.
 */
function initTable() {
  const input = document.getElementById("table-size");
  tableSize = parseInt(input.value);
  if (isNaN(tableSize) || tableSize <= 0) return;
  input.value = "";
  table = new Array(tableSize).fill(null).map(() => []);
  const box = document.getElementById("hash-function-text");
  box.textContent = `Hash(key) = key % ${tableSize}`;
  updateHashFunction();
  renderTable();
}

/**
 * Hash function that supports negative numbers.
 * Ensures the result is always in the range [0, tableSize - 1].
 */
function hash(value) {
  return ((value % tableSize) + tableSize) % tableSize;
}

/**
 * Displays the step-by-step hash calculation in the explanation box.
 */
function showHashExplanation(key, size) {
  const index = hash(key);
  const box = document.getElementById("hash-explanation");
  box.textContent = `Hash(${key}) = ${key} % ${size}  = ${index}`;
}

/**
 * Updates the hash explanation box with a default placeholder.
 */
function updateHashFunction() {
  const box = document.getElementById("hash-explanation");
  box.textContent = `Hash(?) = ? % ${tableSize}`;
}

/**
 * Shows a temporary message at the bottom of the screen.
 * Can be "success" (green) or "error" (red).
 */
function showMessage(text, type = "success") {
  const msg = document.getElementById("message");
  msg.className = "";
  msg.textContent = text;
  msg.classList.add(type === "error" ? "error" : "success");
  msg.id = "message";
  msg.style.display = "block";
  setTimeout(() => {
    msg.style.display = "none";
  }, 3000);
}

/**
 * Utility to pause execution for animations.
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Inserts a value into the table if not already present.
 * Animates traversal and highlights the index box during operation.
 */
async function insertValue() {
  const input = document.getElementById("value-input");
  const val = parseInt(input.value);
  if (isNaN(val)) return;
  input.value = "";

  showHashExplanation(val, tableSize);
  const index = hash(val);
  const chain = table[index];

  renderTable();
  await sleep(50);

  const indexBox = document.querySelector(`.hash-row:nth-child(${index + 1}) .index-box`);
  if (indexBox) indexBox.classList.add("highlight");

  const nodes = document.querySelectorAll(`.hash-row:nth-child(${index + 1}) .chain-node`);
  for (let i = 0; i < chain.length; i++) {
    const node = nodes[i];
    node.classList.add("highlight");
    await sleep(400);
    if (chain[i] === val) {
      node.classList.remove("highlight");
      node.classList.add("found");
      showMessage(`Value ${val} already exists at index ${index}`, "error");
      if (indexBox) indexBox.classList.remove("highlight");
      return;
    }
    node.classList.remove("highlight");
  }

  table[index].push(val);
  renderTable();
  if (indexBox) indexBox.classList.remove("highlight");
  showMessage(`Value ${val} inserted at index ${index}`, "success");
}

/**
 * Searches for a value in the table and animates the traversal.
 */
async function searchValue() {
  const input = document.getElementById("value-input");
  const val = parseInt(input.value);
  if (isNaN(val)) return;
  input.value = "";

  showHashExplanation(val, tableSize);
  const index = hash(val);
  const chain = table[index];

  renderTable();
  await sleep(50);

  const indexBox = document.querySelector(`.hash-row:nth-child(${index + 1}) .index-box`);
  if (indexBox) indexBox.classList.add("highlight");

  const nodes = document.querySelectorAll(`.hash-row:nth-child(${index + 1}) .chain-node`);
  for (let i = 0; i < chain.length; i++) {
    const node = nodes[i];
    node.classList.add("highlight");
    await sleep(500);
    if (chain[i] === val) {
      node.classList.remove("highlight");
      node.classList.add("found");
      showMessage(`Value ${val} found at index ${index}`, "success");
      if (indexBox) indexBox.classList.remove("highlight");
      return;
    }
    node.classList.remove("highlight");
  }

  if (indexBox) indexBox.classList.remove("highlight");

  if (nodes.length > 0) {
    const last = nodes[nodes.length - 1];
    last.classList.add("not-found");
    showMessage(`Value ${val} not found in table`, "error");
  } else {
    showMessage(`Value ${val} not found – chain is empty`, "error");
  }
}

/**
 * Deletes a value from the table if found.
 * Animates traversal and removes the item if it exists.
 */
async function deleteValue() {
  const input = document.getElementById("value-input");
  const val = parseInt(input.value);
  if (isNaN(val)) return;
  input.value = "";

  showHashExplanation(val, tableSize);
  const index = hash(val);
  const chain = table[index];

  renderTable();
  await sleep(50);

  const indexBox = document.querySelector(`.hash-row:nth-child(${index + 1}) .index-box`);
  if (indexBox) indexBox.classList.add("highlight");

  const nodes = document.querySelectorAll(`.hash-row:nth-child(${index + 1}) .chain-node`);
  for (let i = 0; i < chain.length; i++) {
    const node = nodes[i];
    node.classList.add("highlight");
    await sleep(500);
    if (chain[i] === val) {
      node.classList.remove("highlight");
      node.classList.add("found");
      await sleep(400);
      chain.splice(i, 1);
      renderTable();
      if (indexBox) indexBox.classList.remove("highlight");
      showMessage(`Value ${val} deleted from index ${index}`, "success");
      return;
    }
    node.classList.remove("highlight");
  }

  if (indexBox) indexBox.classList.remove("highlight");

  if (nodes.length > 0) {
    const last = nodes[nodes.length - 1];
    last.classList.add("not-found");
    showMessage(`Value ${val} not found and cannot be deleted`, "error");
  } else {
    showMessage(`Value ${val} not found – chain is empty`, "error");
  }
}

/**
 * Resets the table (clears all values).
 */
function resetTable() {
  table = new Array(tableSize).fill(null).map(() => []);
  renderTable();
  updateHashFunction();
}

/**
 * Renders the full hash table to the screen, including index boxes and chains.
 */
function renderTable() {
  const container = document.getElementById("hash-table");
  container.innerHTML = "";

  for (let i = 0; i < tableSize; i++) {
    const row = document.createElement("div");
    row.className = "hash-row";

    const indexBox = document.createElement("div");
    indexBox.className = "index-box";
    indexBox.textContent = i;
    row.appendChild(indexBox);

    const chainContainer = document.createElement("div");
    chainContainer.className = "chain-container";

    table[i].forEach((val, j, arr) => {
      const node = document.createElement("div");
      node.className = "chain-node";
      node.textContent = val;
      chainContainer.appendChild(node);

      if (j < arr.length - 1) {
        const arrow = document.createElement("div");
        arrow.className = "arrow";
        chainContainer.appendChild(arrow);
      }
    });

    if (table[i].length > 0) {
      const arrowFromIndex = document.createElement("div");
      arrowFromIndex.className = "arrow";
      row.appendChild(arrowFromIndex);
      row.appendChild(chainContainer);
    }

    container.appendChild(row);
  }

  const jsonBox = document.getElementById("hash-json");
  if (jsonBox) {
    jsonBox.textContent = JSON.stringify(table, null, 2);
  }
}
