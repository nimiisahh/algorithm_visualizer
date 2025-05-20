// Selection Visualizer – finds the k-th smallest element using partitioning (like QuickSort)

// DOM elements
const container = document.getElementById("array-container");
const explanationBox = document.getElementById("live-explanation");
const sizeSlider = document.getElementById("array_size");
const sizeDisplay = document.getElementById("array_size_display");
const kInput = document.getElementById("k-input");
const comparisonDisplay = document.getElementById("comparison-display");

// Globals
let array = [];
let boxRefs = [];
let isSorting = false;
const BOX_SIZE = 60;
const BASE_TOP = 150;
const DEPTH_SPACING = 60;

// Generates a random array and draws it
function generateArray(size) {
  array = [];
  for (let i = 0; i < size; i++) {
    array.push(Math.floor(Math.random() * 90 + 10));
  }
  drawArray(array);
}

// Draws the array centered in the container
function drawArray(arr) {
  container.innerHTML = "";
  boxRefs = [];
  const containerWidth = container.clientWidth;
  const totalWidth = array.length * (BOX_SIZE + 5);
  const startX = Math.max((containerWidth - totalWidth) / 2, 10);
  const spacing = BOX_SIZE + 5;

  arr.forEach((value, i) => {
    const wrapper = document.createElement("div");
    wrapper.className = "array-box-wrapper";
    wrapper.style.left = `${startX + i * spacing}px`;
    wrapper.style.top = `${BASE_TOP}px`;

    const box = document.createElement("div");
    box.className = "array-box";
    box.innerText = value;

    wrapper.appendChild(box);
    container.appendChild(wrapper);
    boxRefs.push(wrapper);
  });
}

// Displays current explanation message
function updateExplanation(text) {
  explanationBox.innerText = text;
}

// Waits for given ms (used for animation pacing)
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Marks a box visually as pivot
function markPivot(index) {
  const box = boxRefs[index].firstChild;
  box.classList.add("pivot-global");
  box.setAttribute("data-label", "pivot");
}

// Clears pivot marking
function clearPivot(index) {
  const box = boxRefs[index].firstChild;
  box.classList.remove("pivot-global");
  box.removeAttribute("data-label");
}

// Moves a range of elements vertically based on recursion depth
function moveToDepth(left, right, depth) {
  const top = BASE_TOP + depth * DEPTH_SPACING;
  for (let i = left; i <= right; i++) {
    boxRefs[i].style.top = `${top}px`;
  }
}

// Swaps two elements visually and in data
async function animateSwap(i, j) {
  const boxA = boxRefs[i];
  const boxB = boxRefs[j];
  const leftA = parseFloat(boxA.style.left);
  const leftB = parseFloat(boxB.style.left);

  boxA.style.left = `${leftB}px`;
  boxB.style.left = `${leftA}px`;
  await sleep(800);

  [array[i], array[j]] = [array[j], array[i]];
  [boxRefs[i], boxRefs[j]] = [boxRefs[j], boxRefs[i]];
}

// Performs partitioning with pivot, returns its final index
async function partition(left, right, depth) {
  let pivot = array[left];
  markPivot(left);
  moveToDepth(left, right, depth);
  let i = left + 1, j = right;
  updateExplanation(`Partitioning with pivot = ${pivot}`);
  await sleep(800);

  while (i <= j) {
    while (i <= j && array[i] <= pivot) i++;
    while (i <= j && array[j] > pivot) j--;
    if (i < j) {
      await animateSwap(i, j);
      await sleep(800);
    }
  }

  await animateSwap(left, j);
  await sleep(800);
  clearPivot(j);
  return j;
}

// QuickSelect algorithm with visual recursion and explanation
async function quickSelect(left, right, k, depth = 0) {
  if (left <= right) {
    const pivotIndex = await partition(left, right, depth);
    const rank = pivotIndex - left + 1;
    updateExplanation(`Pivot at index ${pivotIndex}, rank = ${rank}`);
    await sleep(800);

    if (rank === k) {
      updateExplanation(`Found the correct element: ${array[pivotIndex]} (the ${kInput.value}-th smallest)`);
      boxRefs[pivotIndex].firstChild.style.backgroundColor = "lightgreen";
      moveToDepth(left, right, 0); // move back up
      confetti();
      isSorting = false;
      return;
    } else if (k < rank) {
      await quickSelect(left, pivotIndex - 1, k, depth + 1);
    } else {
      await quickSelect(pivotIndex + 1, right, k - rank, depth + 1);
    }

    moveToDepth(left, right, 0); // reset depth when backtracking
  }
}

// Bind slider to update size label
sizeSlider.addEventListener("input", e => {
  sizeDisplay.innerText = e.target.value;
});

// Generate new array on button click
document.getElementById("generate-btn").addEventListener("click", () => {
  isSorting = false;
  updateExplanation("");
  comparisonDisplay.innerText = "";
  generateArray(parseInt(sizeSlider.value));
});

// Start QuickSelect when clicking the start button
document.getElementById("start-btn").addEventListener("click", async () => {
  if (isSorting) return;
  const k = parseInt(kInput.value);
  const currentLength = array.length;
  if (k < 1 || k > currentLength) {
    updateExplanation(`Invalid k: must be between 1 and ${currentLength}`);
    return;
  }
  isSorting = true;
  await quickSelect(0, array.length - 1, k);
});

// Toggle algorithm info display
document.getElementById("toggle-info-btn").addEventListener("click", () => {
  const info = document.getElementById("algorithm-info");
  info.style.display = info.style.display === "none" ? "block" : "none";
});

// Generate initial array on load
window.onload = () => {
  generateArray(parseInt(sizeSlider.value));
};
