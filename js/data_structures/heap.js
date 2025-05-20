// Core heap data
let heap = [];
let isMinHeap = true;
let maxSize = 15;
let heapInitialized = false;

// Map DOM nodes to heap indices
const nodeMap = new Map();

// Initialize a new heap
function initHeap() {
  const sizeInput = document.getElementById('heap-size').value.trim();
  const size = parseInt(sizeInput);
  isMinHeap = document.getElementById('heap-type').value === 'min';
  maxSize = size;
  heap = [];
  nodeMap.clear();

  const container = document.getElementById('heap-container');
  container.innerHTML = '';

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("id", "heap-lines");
  svg.style.position = "absolute";
  svg.style.width = "100%";
  svg.style.height = "100%";
  svg.style.zIndex = "0";
  container.appendChild(svg);

  drawHeapArray(maxSize);

  document.getElementById('heap-size').value = "";
  heapInitialized = true;
}

// Sleep helper for animations
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Insert a value into the heap
async function insertHeap() {
  if (!heapInitialized) {
    alert("Please create the heap before inserting values.");
    return;
  }

  const value = parseInt(document.getElementById('heap-value').value);
  if (isNaN(value) || heap.length >= maxSize) return;

  if (heap.includes(value)) {
    alert("This value is already in the heap.");
    return;
  }
  
  document.getElementById('heap-value').value = "";
  const index = heap.length;
  heap.push(value);
  updateHeapArrayCell(index, value);

  const node = document.createElement('div');
  node.className = 'heap-node';
  node.textContent = value;
  node.dataset.index = index;
  document.getElementById('heap-container').appendChild(node);
  nodeMap.set(index, node);

  updateAllNodePositions();
  await sleep(100);
  await heapifyUpAnimated(index);
}

// Restore heap property upwards
async function heapifyUpAnimated(index) {
  if (index === 0) return;

  const parentIndex = Math.floor((index - 1) / 2);
  const shouldSwap = isMinHeap
    ? heap[index] < heap[parentIndex]
    : heap[index] > heap[parentIndex];

  if (shouldSwap) {
    await animateSwap(index, parentIndex);
    [heap[index], heap[parentIndex]] = [heap[parentIndex], heap[index]];
    updateNodeContent(index);
    updateNodeContent(parentIndex);
    await heapifyUpAnimated(parentIndex);
  }
}

// Update text content of a node
function updateNodeContent(index) {
  const node = nodeMap.get(index);
  if (node) node.textContent = heap[index];
}

// Update all node positions and redraw lines
function updateAllNodePositions() {
  heap.forEach((_, i) => moveNodeToPosition(i));
  setTimeout(drawLines, 20);
}

// Position a node based on its index
function moveNodeToPosition(i) {
  const level = Math.floor(Math.log2(i + 1));
  const maxNodes = 2 ** level;
  const posInLevel = i - (2 ** level - 1);
  const xPercent = ((posInLevel + 1) / (maxNodes + 1)) * 100;

  const node = nodeMap.get(i);
  if (node) {
    node.style.position = 'absolute';
    node.style.top = `${level * 100}px`;
    node.style.left = `calc(${xPercent}% - 25px)`;
  }
}

// Animate swap between two nodes and array cells
async function animateSwap(i, j) {
  const nodeA = nodeMap.get(i);
  const nodeB = nodeMap.get(j);
  if (!nodeA || !nodeB) return;

  nodeA.classList.add("highlight");
  nodeB.classList.add("highlight");

  const tempTop = nodeA.style.top;
  const tempLeft = nodeA.style.left;
  nodeA.style.top = nodeB.style.top;
  nodeA.style.left = nodeB.style.left;
  nodeB.style.top = tempTop;
  nodeB.style.left = tempLeft;

  await sleep(1000);

  nodeA.classList.remove("highlight");
  nodeB.classList.remove("highlight");

  nodeMap.set(i, nodeB);
  nodeMap.set(j, nodeA);

  // Swap array cell contents visually
  const cellA = document.getElementById(`heap-cell-${i}`);
  const cellB = document.getElementById(`heap-cell-${j}`);
  if (cellA && cellB) {
    const temp = cellA.textContent;
    cellA.textContent = cellB.textContent;
    cellB.textContent = temp;

    cellA.style.backgroundColor = "#ffcdd2";
    cellB.style.backgroundColor = "#ffcdd2";

    setTimeout(() => {
      cellA.style.backgroundColor = "#fff8f0";
      cellB.style.backgroundColor = "#fff8f0";
    }, 500);
  }
}

// Draw lines between parent and children nodes
function drawLines() {
  const svg = document.getElementById("heap-lines");
  if (!svg) return;
  svg.innerHTML = "";

  heap.forEach((_, i) => {
    if (i === 0) return;
    const parentIndex = Math.floor((i - 1) / 2);

    const childNode = nodeMap.get(i);
    const parentNode = nodeMap.get(parentIndex);
    if (!childNode || !parentNode) return;

    const childRect = childNode.getBoundingClientRect();
    const parentRect = parentNode.getBoundingClientRect();
    const containerRect = document.getElementById('heap-container').getBoundingClientRect();

    const x1 = parentRect.left + 25 - containerRect.left;
    const y1 = parentRect.top + 25 - containerRect.top;
    const x2 = childRect.left + 25 - containerRect.left;
    const y2 = childRect.top + 25 - containerRect.top;

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
    line.setAttribute("stroke", "#e53935");
    line.setAttribute("stroke-width", "2");

    svg.appendChild(line);
  });
}



// Draw the static array and index row based on user-defined size
function drawHeapArray(size) {
    const arrayDiv = document.getElementById("heap-array");
    const indexDiv = document.getElementById("heap-indices");
    arrayDiv.innerHTML = "";
    indexDiv.innerHTML = "";
  
    for (let i = 0; i < size; i++) {
      const cell = document.createElement("div");
      cell.className = "heap-cell";
      cell.id = `heap-cell-${i}`;
      arrayDiv.appendChild(cell);
  
      const idx = document.createElement("div");
      idx.className = "heap-index";
      idx.textContent = i;
      indexDiv.appendChild(idx);
    }
  }
  
  // Update a specific cell in the array visualization
  function updateHeapArrayCell(index, value) {
    const cell = document.getElementById(`heap-cell-${index}`);
    if (!cell) return;
    cell.textContent = value;
    cell.style.backgroundColor = "#ffcdd2";
    setTimeout(() => {
      cell.style.backgroundColor = "#fff8f0";
    }, 500);
  }
  
  // Reset the entire heap and clear DOM
  function resetHeap() {
    heap = [];
    nodeMap.clear();
    heapInitialized = false;
  
    const container = document.getElementById('heap-container');
    container.innerHTML = '';
  
    const arrayDiv = document.getElementById("heap-array");
    const indexDiv = document.getElementById("heap-indices");
    if (arrayDiv) arrayDiv.innerHTML = "";
    if (indexDiv) indexDiv.innerHTML = "";
  }
  
  // Heapify down with animation (after root deletion)
  async function heapifyDownAnimated(index) {
    const left = 2 * index + 1;
    const right = 2 * index + 2;
    let target = index;
  
    if (isMinHeap) {
      if (left < heap.length && heap[left] < heap[target]) target = left;
      if (right < heap.length && heap[right] < heap[target]) target = right;
    } else {
      if (left < heap.length && heap[left] > heap[target]) target = left;
      if (right < heap.length && heap[right] > heap[target]) target = right;
    }
  
    if (target !== index) {
      await animateSwap(index, target);
      [heap[index], heap[target]] = [heap[target], heap[index]];
      updateNodeContent(index);
      updateNodeContent(target);
      await heapifyDownAnimated(target);
    }
  }
  
  // Delete the root of the heap and rebalance
  async function deleteRoot() {
    if (!heapInitialized || heap.length === 0) {
      alert("The heap is empty or hasn't been created yet.");
      return;
    }
  
    const rootIndex = 0;
    const lastIndex = heap.length - 1;
  
    // Only one element left – just remove it
    if (lastIndex === 0) {
      const node = nodeMap.get(0);
      if (node) node.remove();
      nodeMap.delete(0);
      heap.pop();
      updateHeapArrayCell(0, "");
      return;
    }
  
    await animateSwap(rootIndex, lastIndex);
  
    const lastNode = nodeMap.get(lastIndex);
    if (lastNode) lastNode.remove();
    nodeMap.delete(lastIndex);
  
    heap[rootIndex] = heap[lastIndex];
    heap.pop();
  
    updateNodeContent(rootIndex);
    updateAllNodePositions();
  
    updateHeapArrayCell(lastIndex, "");
    updateHeapArrayCell(rootIndex, heap[rootIndex]);
  
    await sleep(300);
    await heapifyDownAnimated(rootIndex);
  }

  function peekRoot() {
    if (!heapInitialized || heap.length === 0) {
      logMessage("The heap is empty.");
      return;
    }
  
    const value = heap[0];
    const rootNode = nodeMap.get(0);
    const arrayCell = document.getElementById('heap-cell-0');
  
    if (rootNode) {
      rootNode.classList.add("highlight-peek");
      setTimeout(() => rootNode.classList.remove("highlight-peek"), 1000);
    }
  
    if (arrayCell) {
      arrayCell.classList.add("highlight-peek");
      setTimeout(() => arrayCell.classList.remove("highlight-peek"), 1000);
    }
  
    const label = isMinHeap ? "Min" : "Max";
    showHeapMessage(`${label} is ${value}`);
  }
/**
 * Displays a temporary animated message at the bottom of the screen.
 * Used to provide visual feedback (e.g., insertions, deletions, peek operations).
 *
 * @param {string} text - The message to display.
 */
function showHeapMessage(text) {
    const msg = document.getElementById("heap-message");
    msg.textContent = text;
    msg.style.display = "block";
    msg.style.animation = "none"; // Reset animation to allow re-trigger
    msg.offsetHeight; // Force reflow to restart animation
    msg.style.animation = "fadeInOut 3s ease-in-out";
    setTimeout(() => {
      msg.style.display = "none";
    }, 3000);
  }
  
// Reset heap when switching between Min and Max
document.getElementById('heap-type').addEventListener('change', () => {
    resetHeap();
  });
  
  // On page load – set correct button label
  document.addEventListener("DOMContentLoaded", () => {
    const type = document.getElementById('heap-type').value;
    const deleteBtn = document.getElementById("delete-button");
    deleteBtn.textContent = type === "min" ? "Delete Min" : "Delete Max";
    document.getElementById('peek-button').textContent = type === "min" ? "Get Min" : "Get Max";

  });
  
  // Also update delete button label on type change
  document.getElementById('heap-type').addEventListener('change', () => {
    const type = document.getElementById('heap-type').value;
    const deleteBtn = document.getElementById('delete-button');
    deleteBtn.textContent = type === "min" ? "Delete Min" : "Delete Max";
    document.getElementById('peek-button').textContent = type === "min" ? "Get Min" : "Get Max";

  });
  