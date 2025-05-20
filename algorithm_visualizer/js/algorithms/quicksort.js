// DOM element references
const container = document.getElementById("array-container");
const explanationBox = document.getElementById("live-explanation");
const sizeSlider = document.getElementById("array_size");
const sizeDisplay = document.getElementById("array_size_display");

// Globals
let array = [];
let boxRefs = [];
const BOX_SIZE = 60;
const BASE_TOP = 150;
const DEPTH_SPACING = 70;
let isSorting = false;

// Generates a new array of random 2-digit numbers
function generateArray(size) {
  array = [];
  for (let i = 0; i < size; i++) {
    array.push(Math.floor(Math.random() * 90 + 10));
  }
  drawArray(array);
}

// Renders the array visually on screen
function drawArray(arr) {
  container.innerHTML = "";
  boxRefs = [];
  const centerOffset = (container.clientWidth - arr.length * BOX_SIZE) / 2;

  arr.forEach((value, i) => {
    const wrapper = document.createElement("div");
    wrapper.className = "array-box-wrapper";
    wrapper.style.left = `${centerOffset + i * BOX_SIZE}px`;
    wrapper.style.top = `${BASE_TOP}px`;

    const box = document.createElement("div");
    box.className = "array-box";
    box.innerText = value;

    wrapper.appendChild(box);
    container.appendChild(wrapper);
    boxRefs.push(wrapper);
  });
}

// Updates the live explanation text
function updateExplanation(text) {
  explanationBox.innerText = text;
}

// Utility function for delays
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Moves a visual box vertically based on recursive depth
function moveToDepth(index, depth) {
  const top = BASE_TOP + depth * DEPTH_SPACING;
  boxRefs[index].style.top = `${top}px`;
}

// Marks the current pivot box
function markPivot(index, depth) {
  const box = boxRefs[index].firstChild;
  box.classList.add("pivot-global", `pivot-level-${depth}`);
  box.setAttribute("data-label", "pivot");
}

// Clears the pivot mark
function clearPivotMark(index, depth) {
  const box = boxRefs[index].firstChild;
  box.classList.remove("pivot-global", `pivot-level-${depth}`);
  box.removeAttribute("data-label");
}

// Animates swapping of two boxes and updates data arrays
async function animateSwap(i, j) {
  if (!isSorting) return;

  const boxA = boxRefs[i];
  const boxB = boxRefs[j];

  const leftA = parseFloat(boxA.style.left);
  const leftB = parseFloat(boxB.style.left);

  // Animate horizontal movement
  boxA.style.left = `${leftB}px`;
  boxB.style.left = `${leftA}px`;

  await sleep(700);
  if (!isSorting) return;

  // Swap data and visual references
  [array[i], array[j]] = [array[j], array[i]];
  [boxRefs[i], boxRefs[j]] = [boxRefs[j], boxRefs[i]];
}

// Partition logic using leftmost pivot
async function partition(arr, left, right, depth) {
  if (!isSorting) return;

  const pivot = array[left];
  let i = left + 1, j = right;

  updateExplanation(`Pivot selected: ${pivot}`);
  await sleep(700);
  if (!isSorting) return;

  while (i <= j) {
    while (i <= j && array[i] <= pivot) i++;
    while (i <= j && array[j] > pivot) j--;

    if (i < j) {
      await animateSwap(i, j);
      if (!isSorting) return;
      updateExplanation(`Swapped ${array[j]} and ${array[i]}`);
      await sleep(700);
      if (!isSorting) return;
    }
  }

  await animateSwap(left, j);
  if (!isSorting) return;
  updateExplanation(`Pivot ${pivot} moved to correct position`);
  await sleep(700);
  if (!isSorting) return;

  if (left < right) {
    markPivot(j, depth);
  }

  return j;
}

// Recursive Quick Sort with visual depth and animations
async function quickSortVisual(arr, left, right, depth = 0, finalDepth = 0) {
  if (!isSorting) return;

  if (left > right) return;

  if (left === right) {
    moveToDepth(left, finalDepth);
    return;
  }

  for (let k = left; k <= right; k++) {
    moveToDepth(k, depth);
  }
  await sleep(700);
  if (!isSorting) return;

  const pivotIndex = await partition(arr, left, right, depth);
  if (!isSorting || pivotIndex === undefined) return;

  await quickSortVisual(arr, left, pivotIndex - 1, depth + 1, finalDepth + 1);
  if (!isSorting) return;

  await quickSortVisual(arr, pivotIndex + 1, right, depth + 1, finalDepth + 1);
  if (!isSorting) return;

  for (let k = left; k <= right; k++) {
    moveToDepth(k, finalDepth);
  }
  await sleep(700);
  if (!isSorting) return;

  if (left < right) {
    clearPivotMark(pivotIndex, depth);
  }

  if (left === 0 && right === arr.length - 1) {
    updateExplanation("Sorting complete!");
    confetti();
  }
}

// Handle array size slider
sizeSlider.addEventListener("input", e => {
  sizeDisplay.innerText = e.target.value;
});

// Generate New Array button
document.getElementById("generate-btn").addEventListener("click", () => {
  isSorting = false;

  updateExplanation("");
  container.innerHTML = "";
  array = [];
  boxRefs = [];

  generateArray(sizeSlider.value);
});

// Start Sorting button
document.getElementById("start-btn").addEventListener("click", async () => {
  if (isSorting) return;

  isSorting = true;
  await quickSortVisual(array, 0, array.length - 1);
  isSorting = false;
});

// Toggle Algorithm Info Panel
document.getElementById("toggle-info-btn").addEventListener("click", () => {
  const info = document.getElementById("algorithm-info");
  info.style.display = info.style.display === "none" ? "block" : "none";
});

// Initialize on load
window.onload = () => {
  isSorting = false;
  generateArray(sizeSlider.value);
};
