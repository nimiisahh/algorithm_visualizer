// Control flags
let isSorting = false;
let stopSorting = false;

// The array and its visual boxes
let array = [];
let boxElements = [];

// Generates a new array of random numbers and resets the display
function generateNewArray() {
  stopSorting = true;
  isSorting = false;

  const size = parseInt(document.getElementById("array_size").value);
  const container = document.getElementById('array-container');
  container.innerHTML = '';
  document.getElementById('comparison-display').textContent = '';
  array = [];

  for (let i = 0; i < size; i++) {
    array.push({ value: Math.floor(Math.random() * 100) + 1 });
  }

  renderArray();
  positionBoxes();
}

// Creates and displays visual boxes for each array element
function renderArray() {
  const container = document.getElementById("array-container");
  container.innerHTML = "";
  boxElements = [];

  array.forEach((item, i) => {
    const wrapper = document.createElement("div");
    wrapper.className = "array-box-wrapper";

    const box = document.createElement("div");
    box.className = "array-box";
    box.textContent = item.value;

    wrapper.appendChild(box);
    container.appendChild(wrapper);
    boxElements.push(wrapper);
  });
}

// Calculates and assigns the (x, y) position for each item
function layoutArray(array) {
  const container = document.getElementById("array-container");
  const containerWidth = container.clientWidth;
  const spacing = Math.min(60, containerWidth / array.length);
  const offsetX = (containerWidth - spacing * array.length) / 2;

  array.forEach((item, i) => {
    item.x = offsetX + i * spacing;
    item.y = container.clientHeight / 2 - 24;
  });

  applyPositionsToDOM(array);
}

// Applies calculated positions to DOM elements
function applyPositionsToDOM(array) {
  array.forEach(({ id, x, y }) => {
    const el = document.getElementById(`array-box-wrapper-${id}`);
    if (el) {
      el.style.position = "absolute";
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
    }
  });
}

// Updates the numeric label next to the array size slider
function updateArraySizeDisplay(value) {
  document.getElementById("array_size_display").textContent = value;
}


// Generate and draw the array
function generateArray(size) {
  stopSorting = true;
  isSorting = false;

  const container = document.getElementById('array-container');

  container.innerHTML = '';
  container.style.maxWidth = `${65 * size}px`;
  document.getElementById('comparison-display').textContent = '';

  array = [];
  boxElements = [];

  for (let i = 0; i < size; i++) {
    array.push(Math.floor(Math.random() * 100) + 1);

    const wrapper = document.createElement('div');
    wrapper.classList.add('array-box-wrapper');

    const box = document.createElement('div');
    box.classList.add('array-box');
    box.textContent = array[i];

    box.style.backgroundColor = 'lightblue';
    box.style.animation = 'none';
    box.style.transform = 'translateY(0)';

    wrapper.appendChild(box);
    container.appendChild(wrapper);
    boxElements.push(wrapper);
  }

  positionBoxes();
}

// Center the boxes horizontally
function positionBoxes() {
  const container = document.getElementById('array-container');
  const boxWidth = 60;
  const totalWidth = boxWidth * boxElements.length;
  const containerWidth = container.offsetWidth;
  const startX = (containerWidth - totalWidth) / 2;
  const centerY = container.clientHeight / 2 - 24; 

  for (let i = 0; i < boxElements.length; i++) {
    const x = startX + i * boxWidth;
    boxElements[i].style.position = "absolute";
    boxElements[i].style.left = `${x}px`;
    boxElements[i].style.top = `${centerY}px`;
  }
}


// Show current comparison
function showComparison(a, b) {
  const display = document.getElementById('comparison-display');
  let symbol = '';

  if (a > b) {
    symbol = '>';
  } else if (a < b) {
    symbol = '<';
  } else {
    symbol = '=';
  }

  display.textContent = `${a} ${symbol} ${b}`;
}

// Start Bubble Sort
async function startBubbleSort() {
  if (isSorting) return;
  isSorting = true;
  stopSorting = false;

  const n = array.length;
  let sortedIndices = [];

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (stopSorting) {
        isSorting = false;
        return;
      }

      highlightBoxes([j, j + 1], sortedIndices);
      showComparison(array[j].value, array[j + 1].value);
      await sleep(700);

      if (array[j].value > array[j + 1].value) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        [boxElements[j], boxElements[j + 1]] = [boxElements[j + 1], boxElements[j]];
        bounceEffect([j, j + 1]);
        positionBoxes();
        await sleep(700);
      }
    }
    sortedIndices.push(n - i - 1);
    highlightBoxes([], sortedIndices);
  }

  showComparison('✓', '✓');
  isSorting = false;
  celebrate();
}

// Highlight active and sorted boxes
function highlightBoxes(activeIndices = [], sortedIndices = []) {
  for (let i = 0; i < boxElements.length; i++) {
    const box = boxElements[i].firstChild;

    if (sortedIndices.includes(i)) {
      box.style.backgroundColor = '#d1ffd6'; 
    } else if (activeIndices.includes(i)) {
      box.style.backgroundColor = '#ff3366'; 
    } else {
      box.style.backgroundColor = '#ffffff';
    }
  }
}


// Sleep function
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Bounce effect on swap
function bounceEffect(indices) {
  for (const index of indices) {
    const box = boxElements[index].firstChild;

    box.style.transform = 'translateY(-20px)';

    setTimeout(() => {
      box.style.transform = 'translateY(0)';
    }, 200);
  }
}

// Celebration animation
function celebrate() {
  for (const wrapper of boxElements) {
    const box = wrapper.firstChild;
    box.style.animation = 'celebrate-bounce 1s infinite';
  }
  startConfetti();
}

// Confetti animation
function startConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const pieces = [];
  const numberOfPieces = 100;
  let animationFrameId;
  let fadingOut = false;

  for (let i = 0; i < numberOfPieces; i++) {
    pieces.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      size: Math.random() * 10 + 5,
      speed: Math.random() * 3 + 2,
      color: `hsl(${Math.random() * 360}, 100%, 50%)`,
      tilt: Math.random() * 10 - 5,
      tiltAngleIncrement: Math.random() * 0.07 + 0.05,
      tiltAngle: 0
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let p of pieces) {
      ctx.beginPath();
      ctx.lineWidth = p.size;
      ctx.strokeStyle = p.color;
      ctx.moveTo(p.x + p.tilt + p.size / 2, p.y);
      ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.size / 2);
      ctx.stroke();
    }

    update();
  }

  function update() {
    for (let p of pieces) {
      p.y += p.speed;
      p.tiltAngle += p.tiltAngleIncrement;
      p.tilt = Math.sin(p.tiltAngle) * 15;

      if (p.y > canvas.height) {
        p.y = 0;
        p.x = Math.random() * canvas.width;
      }
    }

    if (fadingOut) {
      pieces.splice(0, 2);
    }
  }

  function loop() {
    draw();
    if (pieces.length > 0) {
      animationFrameId = requestAnimationFrame(loop);
    } else {
      cancelAnimationFrame(animationFrameId);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  loop();

  setTimeout(() => {
    fadingOut = true;
  }, 5000);
}

function updateArraySizeDisplay(value) {
  document.getElementById('array_size_display').textContent = value;
}

function toggleAlgorithmInfo() {
  const info = document.getElementById("algorithm-info");
  const btn = document.getElementById("toggle-info-btn");

  if (info.style.display === "none") {
    info.style.display = "block";
    btn.textContent = "Hide Algorithm Info";
  } else {
    info.style.display = "none";
    btn.textContent = "Show Algorithm Info";
  }
}

// Load a new array when the page loads
window.onload = generateNewArray

