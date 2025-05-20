// Radix Sort Visualizer
// Sorts integers by processing digits from least to most significant

// DOM element references
const container = document.getElementById("array-container");
const explanationBox = document.getElementById("live-explanation");
const sizeSlider = document.getElementById("array_size");
const sizeDisplay = document.getElementById("array_size_display");
const startBtn = document.getElementById("start-btn");
const generateBtn = document.getElementById("generate-btn");
const toggleInfoBtn = document.getElementById("toggle-info-btn");
const algorithmInfo = document.getElementById("algorithm-info");

// State and configuration
let array = [];
let boxRefs = [];
const BOX_SIZE = 48;
let isSorting = false;

// Display slider value live
sizeSlider.addEventListener("input", () => {
  sizeDisplay.textContent = sizeSlider.value;
});

// Create a new random array on button click
generateBtn.addEventListener("click", () => {
  if (isSorting) isSorting = false;
  generateArray();
});

// Start the radix sort animation
startBtn.addEventListener("click", () => {
  if (!isSorting) radixSort();
});

// Toggle algorithm explanation
toggleInfoBtn.addEventListener("click", () => {
  if (algorithmInfo.style.display === "none") {
    algorithmInfo.style.display = "block";
    toggleInfoBtn.textContent = "Hide The Algorithm's Info";
  } else {
    algorithmInfo.style.display = "none";
    toggleInfoBtn.textContent = "Show The Algorithm's Info";
  }
});

// Generate random array of up to 3-digit numbers
function generateArray() {
  const overlay = document.getElementById("arrow-overlay");
  if (overlay) overlay.innerHTML = "";
  container.innerHTML = "";
  explanationBox.textContent = "";
  array = [];
  boxRefs = [];

  const size = parseInt(sizeSlider.value);
  for (let i = 0; i < size; i++) {
    const value = Math.floor(Math.random() * 1000);
    array.push(value);
  }
  renderArray(array);
}

// Render the array with optional digit highlighting
function renderArray(arr, exp = null) {
  container.innerHTML = "";
  const totalWidth = arr.length * (BOX_SIZE + 10);
  const offsetX = (container.clientWidth - totalWidth) / 2;
  boxRefs = [];

  for (let i = 0; i < arr.length; i++) {
    const box = document.createElement("div");
    box.className = "array-box-wrapper";
    box.style.left = `${offsetX + i * (BOX_SIZE + 10)}px`;
    box.style.top = `76px`;

    const innerBox = document.createElement("div");
    innerBox.className = "array-box";

    const valueStr = array[i].toString().padStart(3, '0');
    if (exp !== null) {
      const dIndex = 2 - Math.log10(exp); // 0: hundreds, 1: tens, 2: ones
      innerBox.innerHTML = valueStr
        .split("")
        .map((digit, idx) =>
          idx === dIndex
            ? `<span style='background-color:yellow;padding:2px;border-radius:4px;'>${digit}</span>`
            : digit
        )
        .join("");
    } else {
      innerBox.textContent = array[i];
    }

    box.appendChild(innerBox);
    container.appendChild(box);
    boxRefs.push({ wrapper: box, box: innerBox });
  }
}

// Radix Sort main loop
async function radixSort() {
  isSorting = true;
  let max = Math.max(...array);
  let exp = 1;

  while (Math.floor(max / exp) > 0) {
    explanationBox.textContent = `Sorting by digit: ${exp}`;
    await countingSortByDigit(exp);
    exp *= 10;
    if (!isSorting) return;
  }

  explanationBox.textContent = "Done!";
  confetti(); // Optional animation
  isSorting = false;
}

// Stable counting sort used per digit (based on exp)
async function countingSortByDigit(exp) {
  const output = Array(array.length).fill(0);
  const count = Array(10).fill(0);

  // Count digit occurrences
  for (let i = 0; i < array.length; i++) {
    const digit = Math.floor(array[i] / exp) % 10;
    count[digit]++;
  }

  // Accumulate counts
  for (let i = 1; i < 10; i++) {
    count[i] += count[i - 1];
  }

  // Build output array (stable sort)
  for (let i = array.length - 1; i >= 0; i--) {
    const digit = Math.floor(array[i] / exp) % 10;
    output[--count[digit]] = array[i];
  }

  // Copy sorted values back and re-render
  for (let i = 0; i < array.length; i++) {
    array[i] = output[i];
  }
  renderArray(array, exp);
  await sleep(1400);
}

// Delay utility for animations
function sleep(ms) {
  return new Promise((res) => setTimeout(res, ms));
}
