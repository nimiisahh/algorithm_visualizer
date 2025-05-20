// Stack variables
let head = null;
let size = 0;

// Push a value onto the stack
function push() {
  const input = document.getElementById("stack-value");
  const value = input.value.trim();
  if (value === "") return;

  const newNode = { value: value, next: head };
  head = newNode;
  size++;

  input.value = "";
  updateInfo();
  renderStack();
}

// Pop the top value from the stack
function pop() {
  if (head === null) return;

  head = head.next;
  size--;

  updateInfo();
  renderStack();
}

// Reset the entire stack
function resetStack() {
  head = null;
  size = 0;

  updateInfo();
  renderStack();
}

// Update stack size and top value info
function updateInfo() {
  document.getElementById("stack-size").textContent = size;
  document.getElementById("top-value").textContent = head ? head.value : "None";
}

// Render the current stack visually
function renderStack() {
  const container = document.getElementById("stack-container");
  container.innerHTML = "";

  let current = head;
  let index = 0;

  while (current !== null) {
    const slot = document.createElement("div");
    slot.classList.add("stack-slot", "filled");
    if (index === 0) slot.classList.add("top");
    slot.textContent = current.value;
    container.appendChild(slot);

    if (current !== null) {
      const arrow = document.createElement("div");
      arrow.classList.add("arrow-down");
      container.appendChild(arrow);
    }

    current = current.next;
    index++;
  }
}

// Show top value with animation and highlight
function getTop() {
  const stackContainer = document.getElementById("stack-container");
  const topSlot = stackContainer.firstElementChild;

  if (!topSlot || !topSlot.classList.contains("filled")) {
    showMessage("Stack is empty!", false);
    document.getElementById("top-value").innerText = "None";
    return;
  }

  const value = topSlot.innerText;
  document.getElementById("top-value").innerText = value;

  // Remove previous highlights
  stackContainer.querySelectorAll(".stack-slot").forEach(slot => {
    slot.classList.remove("top-highlight");
  });

  // Highlight the top slot temporarily
  topSlot.classList.add("top-highlight");
  setTimeout(() => {
    topSlot.classList.remove("top-highlight");
  }, 1500);

  showMessage(`Top value is ${value}`, true);
}

// Display a styled success or error message
function showMessage(message, success = true) {
  const msg = document.getElementById("message");
  msg.innerText = message;
  msg.className = success ? "success" : "error";
  msg.style.display = "block";

  setTimeout(() => {
    msg.style.display = "none";
  }, 3000);
}
