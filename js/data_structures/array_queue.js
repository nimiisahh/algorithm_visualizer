let queue = [];
let capacity = 0;
let front = 0;
let rear = 0;
let size = 0;

function initQueue() {
  const capInput = document.getElementById("queue-capacity");
  capacity = parseInt(capInput.value);

  if (isNaN(capacity) || capacity <= 0) {
    alert("Please enter a valid positive queue size.");
    return;
  }

  queue = new Array(capacity);
  front = 0;
  rear = 0;
  size = 0;

  renderQueue();
  updateInfo();

}

function enqueue() {
  const valueInput = document.getElementById("queue-value");
  const value = valueInput.value.trim();

  if (value === "") return;

  if (size >= capacity) {
    alert("Queue is full!");
    return;
  }

  queue[rear] = value;
  rear = (rear + 1) % capacity;
  size++;

  valueInput.value = "";
  renderQueue();
  updateInfo();

}

function dequeue() {
  if (size === 0) {
    alert("Queue is empty!");
    return;
  }

  queue[front] = null;
  front = (front + 1) % capacity;
  size--;

  renderQueue();
  updateInfo();

}

function resetQueue() {
  queue = [];
  front = 0;
  rear = 0;
  size = 0;

  renderQueue();
  updateInfo();

}

function updateInfo() {
  document.getElementById("queue-size").textContent = size;
  const frontVal = size > 0 ? queue[front] : "None";
  document.getElementById("front-value").textContent = frontVal;
}
function renderQueue() {
  const container = document.getElementById("queue-container");
  container.innerHTML = "";

  for (let i = 0; i < capacity; i++) {
    const cellWrapper = document.createElement("div");
    cellWrapper.classList.add("queue-cell");

    const slot = document.createElement("div");
    slot.classList.add("queue-slot");

    if (queue[i] !== undefined && queue[i] !== null) {
      slot.textContent = queue[i];
      slot.classList.add("filled");
    }

    if (i === front && size > 0) {
      slot.classList.add("front");
    }

    if (i === (rear + capacity) % capacity && size > 0 && rear !== front) {
      slot.classList.add("rear");
    }

    const indexLabel = document.createElement("div");
    indexLabel.classList.add("index-label");
    indexLabel.textContent = i;

    cellWrapper.appendChild(slot);
    cellWrapper.appendChild(indexLabel);
    container.appendChild(cellWrapper);
  }
}
