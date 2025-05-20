// Element references
const container = document.getElementById("array-container");
const explanationBox = document.getElementById("live-explanation");
const sizeSlider = document.getElementById("array_size");
const sizeDisplay = document.getElementById("array_size_display");
const startBtn = document.getElementById("start-btn");
const generateBtn = document.getElementById("generate-btn");
const bucketRow = document.getElementById("bucket-row");
const toggleInfoBtn = document.getElementById("toggle-info-btn");
const algorithmInfo = document.getElementById("algorithm-info");

// State variables
let array = [];
let boxRefs = [];
const BOX_SIZE = 48;
const NUM_BUCKETS = 10;
let isSorting = false;

// Update array size label when slider changes
sizeSlider.addEventListener("input", () => {
  sizeDisplay.textContent = sizeSlider.value;
});

// Generate a new array when button is clicked
generateBtn.addEventListener("click", () => {
  if (isSorting) isSorting = false;
  generateArray();
});

// Start sorting when button is clicked
startBtn.addEventListener("click", () => {
  if (!isSorting) bucketSort();
});

// Toggle algorithm info visibility
toggleInfoBtn.addEventListener("click", () => {
  if (algorithmInfo.style.display === "none") {
    algorithmInfo.style.display = "block";
    toggleInfoBtn.textContent = "Hide The Algorithm's Info";
  } else {
    algorithmInfo.style.display = "none";
    toggleInfoBtn.textContent = "Show The Algorithm's Info";
  }
});

// Create 10 empty buckets (0-9)
function generateBuckets() {
  bucketRow.innerHTML = "";
  for (let i = 0; i < NUM_BUCKETS; i++) {
    const bucket = document.createElement("div");
    bucket.className = "bucket";
    bucket.dataset.index = i;
    bucket.innerHTML = `
      <div class="bucket-label">${i}</div>
      <div class="bucket-count" id="bucket-${i}">0</div>
    `;
    bucketRow.appendChild(bucket);
  }
}

// Create a new array of random values (0–9) and render to screen
function generateArray() {
  const overlay = document.getElementById("arrow-overlay");
  if (overlay) overlay.innerHTML = "";

  container.innerHTML = "";
  explanationBox.textContent = "";
  array = [];
  boxRefs = [];
  generateBuckets();

  const size = parseInt(sizeSlider.value);
  const totalWidth = size * (BOX_SIZE + 10);
  const offsetX = (container.clientWidth - totalWidth) / 2;

  for (let i = 0; i < size; i++) {
    const value = Math.floor(Math.random() * NUM_BUCKETS);
    array.push(value);

    // Create box element for the number
    const box = document.createElement("div");
    box.className = "array-box-wrapper";
    box.style.left = `${offsetX + i * (BOX_SIZE + 10)}px`;
    box.style.top = `76px`;

    const innerBox = document.createElement("div");
    innerBox.className = "array-box";
    innerBox.textContent = value;

    box.appendChild(innerBox);
    container.appendChild(box);
    boxRefs.push({ wrapper: box, box: innerBox });
  }
}

// Perform bucket sort animation and logic
async function bucketSort() {
    isSorting = true;
    explanationBox.textContent = "Counting occurrences into buckets...";
  
    const count = Array(NUM_BUCKETS).fill(0); // Initialize bucket counters
  
    // Create or clear the arrow overlay layer
    let arrowOverlay = document.getElementById("arrow-overlay");
    if (!arrowOverlay) {
      arrowOverlay = document.createElement("div");
      arrowOverlay.id = "arrow-overlay";
      arrowOverlay.style.position = "fixed";
      arrowOverlay.style.top = 0;
      arrowOverlay.style.left = 0;
      arrowOverlay.style.width = "100%";
      arrowOverlay.style.height = "100%";
      arrowOverlay.style.pointerEvents = "none";
      arrowOverlay.style.zIndex = 500;
      document.body.appendChild(arrowOverlay);
    }
    arrowOverlay.innerHTML = "";
  
    // Loop through the array and update bucket counters
    for (let i = 0; i < array.length; i++) {
      if (!isSorting) return;
  
      const value = array[i];
      count[value]++;
  
      // Draw animated curved arrow from box to bucket
      const arrow = document.createElement("div");
      arrow.style.position = "absolute";
      arrow.style.left = "0";
      arrow.style.top = "0";
      arrow.style.width = "100%";
      arrow.style.height = "100%";
  
      const box = boxRefs[i].wrapper;
      const bucket = document.getElementById(`bucket-${value}`);
      const boxRect = box.getBoundingClientRect();
      const bucketRect = bucket.getBoundingClientRect();
  
      const x1 = boxRect.left + boxRect.width / 2;
      const y1 = boxRect.top + boxRect.height;
      const x2 = bucketRect.left + bucketRect.width / 2;
      const y2 = bucketRect.top;
  
      const cx1 = x1;
      const cy1 = y1 + (y2 - y1) / 2;
      const cx2 = x2;
      const cy2 = y1 + (y2 - y1) / 2;
  
      arrow.innerHTML = `
        <svg width="100%" height="100%">
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#0288d1" />
            </marker>
          </defs>
          <path d="M${x1},${y1} C${cx1},${cy1} ${cx2},${cy2} ${x2},${y2}" stroke="#0288d1" stroke-width="3" fill="none" marker-end="url(#arrowhead)" />
        </svg>
      `;
      arrowOverlay.appendChild(arrow);
  
      // Update the counter and visual feedback
      const counter = document.getElementById(`bucket-${value}`);
      counter.textContent = count[value];
      counter.style.backgroundColor = "#81d4fa";
      await sleep(600);
      if (!isSorting) return;
      counter.style.backgroundColor = "#e0f7fa";
      box.style.opacity = 0.3;
  
      arrow.remove();
    }
  
    // Rebuild the sorted array from the bucket counters
    explanationBox.textContent = "Reconstructing sorted array from buckets...";
    let idx = 0;
    const size = array.length;
    const totalWidth = size * (BOX_SIZE + 10);
    const offsetX = (container.clientWidth - totalWidth) / 2;
  
    for (let i = 0; i < NUM_BUCKETS; i++) {
      for (let j = 0; j < count[i]; j++) {
        if (!isSorting) return;
        array[idx] = i;
        boxRefs[idx].box.textContent = i;
        moveBox(idx, offsetX + idx * (BOX_SIZE + 10), 76);
        boxRefs[idx].wrapper.style.opacity = 1;
        idx++;
        await sleep(500);
      }
    }
  
    explanationBox.textContent = "Done!";
    confetti();
    isSorting = false;
  }
  
  // Move a visual box to a specific position (left/top)
  function moveBox(index, left, top) {
    boxRefs[index].wrapper.style.left = `${left}px`;
    boxRefs[index].wrapper.style.top = `${top}px`;
  }
  
  // Delay helper for animations
  function sleep(ms) {
    return new Promise((res) => setTimeout(res, ms));
  }
  