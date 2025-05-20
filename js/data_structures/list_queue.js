let head = null;
let tail = null;
let size = 0;

function enqueue() {
  

  const input = document.getElementById("queue-value");
  const value = input.value.trim();

  if (value === "") return;
  const newNode = {
    value: value,
    next: null
  };

  if (tail === null) {
    head = newNode;
    tail = newNode;
  } else {
    tail.next = newNode;
    tail = newNode;
  }

  size++;
  input.value = "";
  updateInfo();
  renderQueue();
  updateNullBoxVisibility();

}

function dequeue() {
  if (head === null) return;


  head = head.next;
  size--;

  if (size === 0) {
    tail = null;
  }

  updateInfo();
  renderQueue();
  updateNullBoxVisibility();

}

function resetQueue() {
  head = null;
  tail = null;
  size = 0;

  updateInfo();
  renderQueue();
}

function updateInfo() {
  document.getElementById("queue-size").textContent = size;
  document.getElementById("front-value").textContent = head ? head.value : "None";
}

function renderQueue() {
    
    const container = document.getElementById("queue-container");
    container.innerHTML = "";
  
    let current = head;
  
    while (current !== null) {
      const slot = document.createElement("div");
      slot.classList.add("queue-slot", "filled");
      slot.textContent = current.value;
  
      if (current === head) {
        slot.classList.add("front");
      }
  
      if (current === tail) {
        slot.classList.add("rear");
      }
  
      container.appendChild(slot);
  
        const arrow = document.createElement("div");
        arrow.classList.add("arrow-right");
        container.appendChild(arrow);
      
  
      current = current.next;
    }
  
    const nullBox = document.createElement("div");
    nullBox.id = "null-box";
    nullBox.textContent = "NULL";
    container.appendChild(nullBox);
  }
  
  
  function updateNullBoxVisibility() {
    const nullBox = document.getElementById('null-box');
    const queueContainer = document.getElementById('queue-container');
    const slots = queueContainer.querySelectorAll('.queue-slot');
  
    if ( slots.length === 0) {
      nullBox.style.display = 'none'; 
    } else {
      nullBox.style.display = 'flex';
    }
  }
  