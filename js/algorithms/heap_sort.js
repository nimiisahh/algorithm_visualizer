// Heap Sort Visualizer Script

let array = [];                   
let nodeElements = [];             
let container;                     
let arrayBarContainer;             
let sortedArraySize = 0;           
let isSorting = false;             

// Generate new random array and reset UI
function generateArray() {
  if (isSorting) stopSorting();
  const size = parseInt(document.getElementById("size").value);
  array = Array.from({ length: size }, () => Math.floor(Math.random() * 100));
  sortedArraySize = 0;
  drawArrayBar();
  clearSortedArray();
  clearHeap();
  initSortedArray(size);
}

// Stop current sort and reset all visual elements
function stopSorting() {
  isSorting = false;
  array = [];
  clearHeap();
  clearSortedArray();
  drawArrayBar();
}

// Update the size label next to the slider
function updateSizeLabel(val) {
  document.getElementById("size-label").innerText = val;
}

// Clear the sorted array display
function clearSortedArray() {
  document.getElementById("sorted-array-boxes").innerHTML = "";
}

// Clear the heap visualization
function clearHeap() {
  document.getElementById("heap-container").innerHTML = "";
}

// Draw the top horizontal array bar with current values
function drawArrayBar() {
  arrayBarContainer = document.getElementById("array-bar");
  arrayBarContainer.innerHTML = "";
  array.forEach(value => {
    const box = document.createElement("div");
    box.className = "sorted-box";
    box.innerText = value;
    arrayBarContainer.appendChild(box);
  });
}

// Initialize empty sorted array boxes
function initSortedArray(size) {
  const sorted = document.getElementById("sorted-array-boxes");
  sorted.innerHTML = "";
  for (let i = 0; i < size; i++) {
    const box = document.createElement("div");
    box.className = "sorted-box";
    box.innerText = "";
    sorted.appendChild(box);
  }
}

// Update a specific sorted box with value and animation
function updateSortedBox(index, value) {
  const sorted = document.getElementById("sorted-array-boxes");
  const box = sorted.children[index];
  if (box) {
    box.innerText = value;
    box.classList.add("fade-in");
    setTimeout(() => box.classList.remove("fade-in"), 400);
  }
}

// Draw the heap tree based on array values
function drawHeap() {
  container = document.getElementById("heap-container");
  container.innerHTML = "";
  nodeElements = [];
  drawEdges(); // Add connecting lines

  const levels = Math.floor(Math.log2(array.length)) + 1;
  array.forEach((value, i) => {
    const node = document.createElement("div");
    node.className = "node";
    node.innerText = value;

    const level = Math.floor(Math.log2(i + 1));
    const maxNodes = 2 ** level;
    const indexInLevel = i - (2 ** level - 1);
    const spacing = 100 / maxNodes;

    node.style.top = `${level * 80}px`;
    node.style.left = `${indexInLevel * spacing + spacing / 2}%`;

    container.appendChild(node);
    nodeElements.push(node);
  });
}

// Draw edges (lines) between parent and child nodes
function drawEdges() {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "100%");
  svg.setAttribute("height", "400px");
  svg.style.position = "absolute";
  svg.style.top = 0;
  svg.style.left = 0;

  const positions = [];
  array.forEach((_, i) => {
    const level = Math.floor(Math.log2(i + 1));
    const maxNodes = 2 ** level;
    const indexInLevel = i - (2 ** level - 1);
    const spacing = 100 / maxNodes;
    const x = indexInLevel * spacing + spacing / 2;
    const y = level * 80 + 25;
    positions.push({ x, y });
  });

  array.forEach((_, i) => {
    const left = 2 * i + 1;
    const right = 2 * i + 2;
    if (left < array.length) svg.appendChild(connectLine(positions[i], positions[left]));
    if (right < array.length) svg.appendChild(connectLine(positions[i], positions[right]));
  });

  container.appendChild(svg);
}

// Create a line (SVG element) between two positions
function connectLine(from, to) {
  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("x1", `${from.x}%`);
  line.setAttribute("y1", `${from.y}`);
  line.setAttribute("x2", `${to.x}%`);
  line.setAttribute("y2", `${to.y}`);
  line.setAttribute("stroke", "#90caf9");
  line.setAttribute("stroke-width", "2");
  return line;
}

// Starts the Heap Sort animation
async function startHeapSort() {
    if (isSorting) return;
    isSorting = true;
    await buildMaxHeap(); // Step 1: Build max heap
  
    let size = array.length;
    for (let end = array.length - 1; end >= 0; end--) {
      if (!isSorting) return;
  
      await highlightSwap(0, end);      // Highlight root swap
      await animateSwap(0, end);        // Animate swap
  
      const removedNode = nodeElements[end];
      if (removedNode) {
        removedNode.classList.add("fade-out"); // Fade out removed max
        await delay(200);
      }
  
      const maxVal = array[end];
      array.pop();                      // Remove max element
      updateSortedBox(end, maxVal);     // Place in sorted section
  
      drawHeap();                       // Redraw heap without max
      drawArrayBar();
      await heapifyDown(0, --size);     // Heapify root again
    }
  
    array = [];
    drawArrayBar();
    isSorting = false;
  }
  
  // Builds max heap from input array
  async function buildMaxHeap() {
    const n = array.length;
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      if (!isSorting) return;
      await highlightNode(i, 'root');
      await heapifyDown(i, n);
      drawHeap();
      await delay(600);
    }
  }
  
  // Restores max-heap property starting from index i
  async function heapifyDown(i, size) {
    if (!isSorting) return;
  
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;
  
    if (left < size && array[left] > array[largest]) largest = left;
    if (right < size && array[right] > array[largest]) largest = right;
  
    if (largest !== i) {
      await highlightSwap(i, largest);
      await animateSwap(i, largest);
      await heapifyDown(largest, size); // Continue down the heap
    }
  }
  
  // Swaps two elements and updates visuals
  function animateSwap(i, j) {
    return new Promise(resolve => {
      [array[i], array[j]] = [array[j], array[i]];
  
      // Swap node texts
      const tempText = nodeElements[i]?.innerText;
      if (nodeElements[i] && nodeElements[j]) {
        nodeElements[i].innerText = nodeElements[j].innerText;
        nodeElements[j].innerText = tempText;
      }
  
      setTimeout(() => {
        drawHeap();
        drawArrayBar();
        resolve();
      }, 600);
    });
  }
  
  // Highlights two nodes being swapped
  async function highlightSwap(i, j) {
    if (!nodeElements[i] || !nodeElements[j]) return;
    nodeElements[i].classList.add("root");
    nodeElements[j].classList.add("swapping");
    await delay(500);
    nodeElements[i].classList.remove("root");
    nodeElements[j].classList.remove("swapping");
  }
  
  // Temporarily highlights a single node
  async function highlightNode(i, cls) {
    if (!nodeElements[i]) return;
    nodeElements[i].classList.add(cls);
    await delay(500);
    nodeElements[i].classList.remove(cls);
  }
  
  // Utility: Waits for given milliseconds
  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  // Toggles algorithm info box on button click
  document.addEventListener("DOMContentLoaded", () => {
    const infoBtn = document.getElementById("toggle-info-btn");
    const infoBox = document.getElementById("algorithm-info");
  
    if (infoBtn && infoBox) {
      infoBtn.addEventListener("click", () => {
        const isHidden = infoBox.style.display === "none";
        infoBox.style.display = isHidden ? "block" : "none";
        infoBtn.innerText = isHidden ? "Hide The Algorithm's Info" : "Show The Algorithm's Info";
      });
    }
  });
  