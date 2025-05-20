let array = [];
let arraySize = 10;
const container = document.getElementById("array-container");
let positions = {}; // original positions for final restoration
const baseTop = 150; // changed from 50 to 150
let isSorting = false;
let cancelSort = false;

function generateNewArray() {
    cancelSort = true; // מסמן לעצור את המיון הנוכחי
    isSorting = false; 
  
    const container = document.getElementById("array-container");
    container.innerHTML = "";
    document.getElementById("comparison-display").textContent = "";
    document.getElementById("status-message").textContent = "";

    arraySize = parseInt(document.getElementById("array_size").value);
    array = Array.from({ length: arraySize }, () => Math.floor(Math.random() * 100));
    renderArray(array);
  }
  
function updateArraySizeDisplay(val) {
    document.getElementById("array_size_display").innerText = val;
    // אל תיצור אוטומטית מערך חדש!
  }
  

function renderArray(arr) {
  container.innerHTML = "";
  positions = {};

  const totalWidth = arr.length * 55;
  const startLeft = (container.clientWidth - totalWidth) / 2;

  arr.forEach((value, index) => {
    const box = document.createElement("div");
    box.classList.add("array-box-wrapper");
    box.style.left = `${startLeft + index * 55}px`;
    box.style.top = `${baseTop}px`;
    box.style.zIndex = 1000;
    box.id = `wrapper-${index}`;

    positions[index] = { left: startLeft + index * 55, top: baseTop, index: index };

    box.innerHTML = `<div class='array-box' id='box-${index}'>${value}</div>`;
    container.appendChild(box);
  });
}

async function startMergeSort() {
    if (isSorting || array.length === 0) return;

    if (isSorted(array)) {
      document.getElementById("status-message").textContent = "The array is already sorted!";
      return;
    }
  
    document.getElementById("status-message").textContent = ""; // מנקה הודעות קודמות
    isSorting = true;
    cancelSort = false;
  
    const items = array.map((v, i) => ({ value: v, originalIndex: i }));
    const result = await visualSplit(items, 0, 0, arraySize - 1, 0);
  
    if (cancelSort) {
      isSorting = false;
      return;
    }
  
    array = result.map(item => item.value);
  
    const finalTop = baseTop;
    const boxWidth = 55;
    const startLeft = (container.clientWidth - arraySize * boxWidth) / 2;
  
    result.forEach((item, idx) => {
      const box = document.getElementById(`wrapper-${item.originalIndex}`);
      if (box) {
        box.style.top = `${finalTop}px`;
        box.style.left = `${startLeft + idx * boxWidth}px`;
        box.style.zIndex = 1000;
      }
    });
  
    await sleep(500);
    triggerConfetti();
    isSorting = false;
    result.forEach((item) => {
        const wrapper = document.getElementById(`wrapper-${item.originalIndex}`);
        if (wrapper) {
          wrapper.classList.add("bounce");
          setTimeout(() => wrapper.classList.remove("bounce"), 1000);
        }
      });
      
  }
  
  

async function visualSplit(arr, depth, leftBound, rightBound, offset) {
    if (cancelSort) return [];

  if (arr.length <= 1) return arr;

  const mid = Math.floor(arr.length / 2);
  const left = arr.slice(0, mid);
  const right = arr.slice(mid);

  const levelHeight = 80;
  const boxWidth = 55;
  const totalWidth = arr.length * boxWidth;
  const startLeft = (container.clientWidth - arraySize * boxWidth) / 2 + offset * boxWidth;

  arr.forEach((item, i) => {
    const box = document.getElementById(`wrapper-${item.originalIndex}`);
    if (box) {
      const targetLeft = startLeft + i * boxWidth;
      box.style.top = `${baseTop + depth * levelHeight}px`;
      box.style.left = `${targetLeft}px`;
      box.style.zIndex = 100 - depth;
      positions[item.originalIndex] = { left: targetLeft, top: baseTop + depth * levelHeight };
    }
  });

  await sleep(700);
  if (cancelSort) return result;

  const sortedLeft = await visualSplit(left, depth + 1, leftBound, leftBound + mid - 1, offset);
  const sortedRight = await visualSplit(right, depth + 1, leftBound + mid, rightBound, offset + mid);

  const merged = await animateMerge(sortedLeft, sortedRight, depth, offset);
  return merged;
}

async function animateMerge(left, right, depth, offset) {
    if (cancelSort) return [];

  let result = [];
  let i = 0, j = 0;

  const levelHeight = 80;
  const boxWidth = 55;
  const targetTop = `${baseTop + (depth - 1) * levelHeight}px`;
  const startLeft = (container.clientWidth - arraySize * boxWidth) / 2 + offset * boxWidth;

  let currentIndex = 0;
  while (i < left.length && j < right.length) {
    const leftItem = left[i];
    const rightItem = right[j];
    const leftBox = document.getElementById(`wrapper-${leftItem.originalIndex}`);
    const rightBox = document.getElementById(`wrapper-${rightItem.originalIndex}`);

    if (leftBox) leftBox.querySelector(".array-box").style.backgroundColor = "#fdd835";
    if (rightBox) rightBox.querySelector(".array-box").style.backgroundColor = "#fdd835";

    await sleep(400);
    if (cancelSort) return result;

    if (leftItem.value < rightItem.value) {
      result.push(leftItem);
      moveToMergePosition(leftItem.originalIndex, startLeft, currentIndex, targetTop, depth);
      if (leftBox) leftBox.querySelector(".array-box").style.backgroundColor = "#a5d6a7";
      i++;
    } else {
      result.push(rightItem);
      moveToMergePosition(rightItem.originalIndex, startLeft, currentIndex, targetTop, depth);
      if (rightBox) rightBox.querySelector(".array-box").style.backgroundColor = "#a5d6a7";
      j++;
    }
    currentIndex++;
    await sleep(200);
    if (cancelSort) return result;

  }

  while (i < left.length) {
    const item = left[i];
    result.push(item);
    moveToMergePosition(item.originalIndex, startLeft, currentIndex, targetTop, depth);
    const box = document.getElementById(`wrapper-${item.originalIndex}`);
    if (box) box.querySelector(".array-box").style.backgroundColor = "#a5d6a7";
    i++;
    currentIndex++;
    await sleep(200);
    if (cancelSort) return result;

  }

  while (j < right.length) {
    const item = right[j];
    result.push(item);
    moveToMergePosition(item.originalIndex, startLeft, currentIndex, targetTop, depth);
    const box = document.getElementById(`wrapper-${item.originalIndex}`);
    if (box) box.querySelector(".array-box").style.backgroundColor = "#a5d6a7";
    j++;
    currentIndex++;
    await sleep(200);
    if (cancelSort) return result;

  }

  result.forEach((item, idx) => {
    positions[item.originalIndex] = {
      left: startLeft + idx * boxWidth,
      top: parseInt(targetTop),
      index: idx
    };
  });

  return result;
}

function moveToMergePosition(originalIndex, startLeft, index, top, depth) {
  const box = document.getElementById(`wrapper-${originalIndex}`);
  if (box) {
    box.style.left = `${startLeft + index * 55}px`;
    box.style.top = top;
    box.style.zIndex = 100 - depth;
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function toggleAlgorithmInfo() {
  const info = document.getElementById("algorithm-info");
  info.style.display = info.style.display === "none" ? "block" : "none";
}

function triggerConfetti() {
    const duration = 3 * 1000;
    const end = Date.now() + duration;
  
    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
      });
  
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }

  function isSorted(arr) {
    for (let i = 1; i < arr.length; i++) {
      if (arr[i - 1] > arr[i]) return false;
    }
    return true;
  }
  
  window.onload = () => {
    isSorting = false;
    generateNewArray();
  };
  