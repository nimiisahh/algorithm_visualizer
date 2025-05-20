// Stack data and its maximum capacity
let stack = [];
let capacity = 0;

/**
 * Initializes the stack with a given capacity.
 * Clears any previous values.
 */
function initStack() {
  const input = document.getElementById("stack-capacity");
  capacity = parseInt(input.value);
  stack = [];
  renderStack();
}

/**
 * Pushes a number onto the stack if it’s valid and not full.
 */
function push() {
  const valStr = document.getElementById("stack-value").value;
  const val = Number(valStr);
  
  if (valStr.trim() === "" || isNaN(val)) {
    alert("Please enter a valid number.");
    return;
  }

  if (stack.length >= capacity) {
    alert("Stack Overflow!");
    return;
  }

  stack.push(val);
  renderStack("push"); // with animation
  document.getElementById("stack-value").value = ''; 
}

/**
 * Removes the top element from the stack if it’s not empty.
 */
function pop() {
  if (stack.length === 0) {
    alert("Stack Underflow!");
    return;
  }

  stack.pop();
  renderStack();
}

/**
 * Clears the entire stack.
 */
function resetStack() {
  stack = [];
  renderStack();
}

/**
 * Renders the current stack visually.
 * If `actionType` is 'push', apply fade-in animation to top element.
 */
function renderStack(actionType = "") {
  const container = document.getElementById("stack-container");
  container.innerHTML = "";

  for (let i = capacity - 1; i >= 0; i--) {
    const slot = document.createElement("div");
    slot.className = "stack-slot";

    if (i < stack.length) {
      slot.classList.add("filled");
      if (i === stack.length - 1 && actionType === "push") {
        slot.classList.add("fade-in");
      }
      if (i === stack.length - 1) {
        slot.classList.add("top");
      }
      slot.innerText = stack[i];
    }

    const index = document.createElement("div");
    index.className = "index-label";
    index.innerText = i;
    slot.appendChild(index);
    container.appendChild(slot);
  }

  document.getElementById("stack-size").innerText = stack.length;
  document.getElementById("top-value").innerText = stack.length > 0 ? stack[stack.length - 1] : "None";
}

/**
 * Highlights the top element of the stack briefly and shows a message with its value.
 */
function getTop() {
  if (!stack || stack.length === 0) {
    showStackMessage("The stack is empty.");
    return;
  }

  // Remove previous highlights
  document.querySelectorAll(".stack-slot").forEach(slot => {
    slot.classList.remove("peek-highlight");
  });

  const topIndex = stack.length - 1;
  const topValue = stack[topIndex];

  const slots = document.querySelectorAll(".stack-slot");
  const visualIndex = slots.length - 1 - topIndex; // reverse index to match DOM order

  if (slots[visualIndex]) {
    const topSlot = slots[visualIndex];
    topSlot.classList.add("peek-highlight");

    // Automatically remove highlight after 2.5 seconds
    setTimeout(() => {
      topSlot.classList.remove("peek-highlight");
    }, 2500);
  }

  showStackMessage(`Top of stack: ${topValue}`);
}

/**
 * Displays a temporary message below the stack for 3 seconds.
 */
function showStackMessage(message) {
  const msgBox = document.getElementById("stack-message");
  msgBox.textContent = message;
  msgBox.style.display = "block";

  setTimeout(() => {
    msgBox.style.display = "none";
  }, 3000);
}
