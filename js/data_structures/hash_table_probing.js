// Closed Hash Table with Open Addressing (Linear, Quadratic, Double Hashing)

let table = [];
let tableSize = 0;

// Initializes the table with the given size
function initTable() {
  const sizeInput = document.getElementById("table-size");
  tableSize = parseInt(sizeInput.value);
  if (isNaN(tableSize) || tableSize <= 0) return;

  table = new Array(tableSize).fill(null);
  updateHashFunctionText();
  renderTable();
}

// Returns the selected probing method from the dropdown
function getProbingMethod() {
  return document.getElementById("probing-method").value;
}

// Called when the probing method changes: resets the table
function onProbingMethodChange() {
  resetTable();
}

document.getElementById("probing-method").addEventListener("change", onProbingMethodChange);

// Primary hash function
function primaryHash(key) {
  return key % tableSize;
}

// Secondary hash function used in double hashing
function secondaryHash(key) {
  return 1 + (key % (tableSize - 1));
}

// Inserts a value into the table using the selected probing method
async function insertValue() {
  const value = parseInt(document.getElementById("value-input").value);
  if (isNaN(value)) return;

  const method = getProbingMethod();
  let hash = primaryHash(value);
  let i = 0;
  let index = hash;

  updateHashCalculationText(method, value, hash, i);

  // Probe until an empty or deleted cell is found
  while (table[index] !== null && table[index] !== "DEL" && table[index] !== value && i < tableSize) {
    await animateProbe(index);
    i++;
    if (method === "linear") {
      index = (hash + i) % tableSize;
    } else if (method === "quadratic") {
      index = (hash + i * i) % tableSize;
    } else if (method === "double") {
      const step = secondaryHash(value);
      index = (hash + i * step) % tableSize;
    }
    updateHashCalculationText(method, value, hash, i);
  }

  if (i === tableSize) {
    showMessage("Hash table is full!", false);
    return;
  }

  table[index] = value;
  renderTable();
  highlightTemporary(index, 'temp-found');
  showMessage(`Inserted ${value} at index ${index}`, true);
  document.getElementById("value-input").value = "";
}

// Updates the live calculation text box with the current probing formula
function updateHashCalculationText(method, value, hash, i) {
  let calculationText = `Hash(${value}) = ${value} % ${tableSize} = ${hash}`;
  if (method === "linear") {
    calculationText += ` + ${i} = ${(hash + i) % tableSize}`;
  } else if (method === "quadratic") {
    calculationText += ` + ${i}^2 = ${(hash + i * i) % tableSize}`;
  } else if (method === "double") {
    const step = secondaryHash(value);
    calculationText += ` + ${i} * ${step} = ${(hash + i * step) % tableSize}`;
  }
  document.getElementById("hash-calculation-text").textContent = calculationText;
}

// Updates the hash function formula text based on the selected probing method
function updateHashFunctionText() {
  const method = document.getElementById("probing-method").value;
  const hashText = document.getElementById("hash-calculation-text");
  const secondaryHashText = document.getElementById("hash-function-text");

  switch (method) {
    case "linear":
      hashText.textContent = `Hash(key) = (key + i) % ${tableSize}`;
      secondaryHashText.textContent = `Hash(key) = (key + i) % ${tableSize}`;
      break;
    case "quadratic":
      hashText.textContent = `Hash(key) = (key + i^2) % ${tableSize}`;
      secondaryHashText.textContent = `Hash(key) = (key + i^2) % ${tableSize}`;
      break;
    case "double":
      hashText.textContent = `Hash(key) = (key + i * hash2(key)) % ${tableSize}`;
      secondaryHashText.textContent = `Hash(key) = (key + i * hash2(key)) % ${tableSize}`;
      break;
    default:
      hashText.textContent = `Hash(key) = key % ${tableSize}`;
      secondaryHashText.textContent = `Hash(key) = (key + i) % ${tableSize}`;
  }
}

// Temporarily highlights a cell at a given index with a class (e.g. 'probe', 'temp-found')
function highlightTemporary(index, className) {
  const container = document.getElementById("hash-table");
  const cell = container.children[index];
  if (!cell) return;

  cell.classList.add(className);
  setTimeout(() => {
    cell.classList.remove(className);
  }, 1000);
}

// Animation for probing step
function animateProbe(index) {
  return new Promise(resolve => {
    const container = document.getElementById("hash-table");
    const cell = container.children[index];
    if (!cell) return resolve();

    cell.classList.add("probe");
    setTimeout(() => {
      cell.classList.remove("probe");
      resolve();
    }, 800);
  });
}

 // Searches for a value in the hash table using the selected probing method.
// If found, highlights the cell; otherwise, briefly marks the last probed cell as not found.
async function searchValue() {
    const value = parseInt(document.getElementById("value-input").value);
    if (isNaN(value)) return;
  
    const method = getProbingMethod();
    let hash = primaryHash(value);
    let i = 0;
    let index = hash;
  
    updateHashCalculationText(method, value, hash, i);
  
    while (table[index] !== null && i < tableSize) {
      await animateProbe(index);
  
      if (table[index] === value) {
        renderTable();
        highlightTemporary(index, 'temp-found');
        document.getElementById("value-input").value = "";
        showMessage(`Found ${value} at index ${index}`, true);
        return;
      }
  
      i++;
      if (method === "linear") {
        index = (hash + i) % tableSize;
      } else if (method === "quadratic") {
        index = (hash + i * i) % tableSize;
      } else if (method === "double") {
        const step = secondaryHash(value);
        index = (hash + i * step) % tableSize;
      }
  
      updateHashCalculationText(method, value, hash, i);
    }
  
    document.getElementById("value-input").value = "";
    renderTable(index, 'not-found');
    showMessage(`${value} not found`, false);
  
    // Remove 'not-found' highlight after delay
    setTimeout(() => {
      const container = document.getElementById("hash-table");
      const cell = container.children[index];
      if (cell) cell.classList.remove("not-found");
    }, 2000);
  }
  
  // Deletes a value from the hash table by marking its cell as "DEL".
  // If the value is not found, displays an error message.
  async function deleteValue() {
    const value = parseInt(document.getElementById("value-input").value);
    if (isNaN(value)) return;
  
    const method = getProbingMethod();
    let hash = primaryHash(value);
    let i = 0;
    let index = hash;
  
    updateHashCalculationText(method, value, hash, i);
  
    while (table[index] !== null && i < tableSize) {
      await animateProbe(index);
  
      if (table[index] === value) {
        table[index] = "DEL";
        renderTable();
        highlightTemporary(index, 'not-found');
        document.getElementById("value-input").value = "";
        showMessage(`Deleted ${value} from index ${index}`, true);
        return;
      }
  
      i++;
      if (method === "linear") {
        index = (hash + i) % tableSize;
      } else if (method === "quadratic") {
        index = (hash + i * i) % tableSize;
      } else if (method === "double") {
        const step = secondaryHash(value);
        index = (hash + i * step) % tableSize;
      }
  
      updateHashCalculationText(method, value, hash, i);
    }
  
    document.getElementById("value-input").value = "";
    showMessage(`${value} not found`, false);
  }
  
  // Resets the entire hash table, clears the display, and resets the hash function display.
  function resetTable() {
    table = [];
    tableSize = 0;
    document.getElementById("hash-table").innerHTML = "";
    document.getElementById("index-row").innerHTML = "";
  
    const method = document.getElementById("probing-method").value;
    const hashText = document.getElementById("hash-function-text");
    const secondaryText = document.getElementById("hash-calculation-text");
  
    switch (method) {
      case "linear":
        hashText.textContent = "Hash(key) = (key + i) % ?";
        secondaryText.textContent = "Hash(key) = (key + i) % tableSize";
        break;
      case "quadratic":
        hashText.textContent = "Hash(key) = (key + i^2) % ?";
        secondaryText.textContent = "Hash(key) = (key + i^2) % tableSize";
        break;
      case "double":
        hashText.textContent = "Hash(key) = (key + i * hash2(key)) % ?";
        secondaryText.textContent = "Hash(key) = (key + i * hash2(key)) % tableSize";
        break;
      default:
        hashText.textContent = "Hash(key) = (key + i) % ?";
        secondaryText.textContent = "Hash(key) = (key + i) % tableSize";
    }
  
    showMessage("Table reset", true);
  }
  
  // Renders the current hash table cells and their values.
  // Optionally highlights a specific cell with a given class.
  function renderTable(highlightIndex = null, state = null) {
    const container = document.getElementById("hash-table");
    const indexRow = document.getElementById("index-row");
    container.innerHTML = "";
    indexRow.innerHTML = "";
  
    for (let i = 0; i < tableSize; i++) {
      const cell = document.createElement("div");
      cell.classList.add("hash-cell");
      if (table[i] !== null) cell.classList.add("filled");
      if (i === highlightIndex && state) cell.classList.add(state);
      cell.textContent = table[i] !== null ? table[i] : "";
      container.appendChild(cell);
  
      const indexLabel = document.createElement("div");
      indexLabel.classList.add("index-label");
      indexLabel.textContent = i;
      indexRow.appendChild(indexLabel);
    }
  }
  
  // Displays a message at the bottom of the screen (success or error).
  function showMessage(message, success = true) {
    const msg = document.getElementById("message");
    msg.innerText = message;
    msg.className = success ? "success" : "error";
    msg.style.display = "block";
  
    setTimeout(() => {
      msg.style.display = "none";
    }, 3000);
  }
  
  // Ensures hash function display is updated when probing method changes
  document.getElementById("probing-method").addEventListener("change", updateHashFunctionText);
  