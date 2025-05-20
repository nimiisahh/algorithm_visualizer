// Linked list head and tail references
let head = null;
let tail = null;
let isCreated = false;

// Initializes a new empty list and resets UI
function createNewList() {
    const container = document.getElementById("list-container");
    container.innerHTML = "";

    head = null;
    tail = null;
    isCreated = true;

    // Show empty visual node labeled as HEAD
    const wrapper = document.createElement("div");
    wrapper.className = "node-wrapper";

    const emptyNode = document.createElement("div");
    emptyNode.className = "node empty-node";
    emptyNode.textContent = "NULL";
    wrapper.appendChild(emptyNode);

    const label = document.createElement("div");
    label.className = "node-label";
    label.textContent = "HEAD";
    wrapper.appendChild(label);

    container.appendChild(wrapper);

    clearMessage();
    updateMemoryView();
}

// Adds a node with the given value to the end of the list
function addAtEnd() {
    if (!isCreated) {
        showMessage("You need to create a list first");
        return;
    }

    const input = document.getElementById("node-value");
    const value = parseInt(input.value);

    if (isNaN(value)) {
        showMessage("Please enter a valid number.");
        return;
    }

    const newNode = {
        value: value,
        next: null,
        isNew: true,
        addr: generateAddress()
    };

    // If list is empty, set new node as both head and tail
    if (head === null) {
        head = newNode;
        tail = newNode;
    } else {
        tail.next = newNode;
        tail = newNode;
    }

    renderList();
    input.value = "";
    clearMessage();
    updateMemoryView();
}

// Adds a node with the given value to the beginning of the list
function addAtBeginning() {
    if (!isCreated) {
        showMessage("You need to create a list first");
        return;
    }

    const input = document.getElementById("node-value");
    const value = parseInt(input.value);

    if (isNaN(value)) {
        showMessage("Please enter a valid number.");
        return;
    }

    const newNode = {
        value: value,
        next: null,
        isNew: true,
        addr: generateAddress()
    };

    // If list is empty, set new node as both head and tail
    if (head === null) {
        head = newNode;
        tail = newNode;
    } else {
        newNode.next = head;
        head = newNode;
    }

    renderList();
    input.value = "";
    clearMessage();
    updateMemoryView();
}

// Renders the current list structure visually in the DOM
function renderList() {
    const container = document.getElementById("list-container");
    container.innerHTML = "";

    if (!head) return;

    let current = head;
    while (current !== null) {
        const wrapper = document.createElement("div");
        wrapper.className = "node-wrapper";

        const nodeDiv = document.createElement("div");
        nodeDiv.className = "node";
        nodeDiv.textContent = current.value;

        // Apply animation for newly added nodes
        if (current.isNew) {
            nodeDiv.classList.add("new");
            current.isNew = false;
        }

        wrapper.appendChild(nodeDiv);

        // Label HEAD and/or TAIL
        const label = document.createElement("div");
        label.className = "node-label";
        if (current === head) label.textContent = "HEAD";
        if (current === tail) label.textContent += (label.textContent ? " / " : "") + "TAIL";
        wrapper.appendChild(label);

        container.appendChild(wrapper);

        // Show arrow if next node exists
        if (current.next !== null) {
            const arrow = document.createElement("span");
            arrow.className = current.next.isNew ? "arrow animated" : "arrow";
            arrow.textContent = "→";
            container.appendChild(arrow);
        }

        current = current.next;
    }
}

// Displays a message in the message area
function showMessage(text) {
    document.getElementById("message").textContent = text;
}

// Clears the message area
function clearMessage() {
    document.getElementById("message").textContent = "";
}

// Deletes a node by its value, with traversal and animation
async function deleteByValue() {
    if (!isCreated) {
        showMessage("You need to create a list first");
        return;
    }

    const input = document.getElementById("node-value");
    const value = parseInt(input.value);

    if (isNaN(value)) {
        showMessage("Please enter a valid number.");
        return;
    }

    let current = head;
    let prev = null;
    let found = false;
    let i = 0;

    // Traverse the list while highlighting each node
    while (current !== null) {
        await highlightNode(current.value, i);

        if (current.value === value) {
            found = true;
            break;
        }

        prev = current;
        current = current.next;
        i++;
    }

    if (!found) {
        showMessage("Value not found in the list.");
        return;
    }

    // Animate node removal
    await fadeOutNode(current.value);

    // Update pointers to remove the node
    if (current === head) {
        head = head.next;
        if (current === tail) tail = null;
    } else {
        prev.next = current.next;
        if (current === tail) tail = prev;
    }

    renderList();
    input.value = "";
    clearMessage();
    updateMemoryView();
}

// Renders a visual representation of an empty list (NULL)
function renderEmptyListVisual() {
    const container = document.getElementById("list-container");
    container.innerHTML = "";

    const wrapper = document.createElement("div");
    wrapper.className = "node-wrapper";

    const emptyNode = document.createElement("div");
    emptyNode.className = "node empty-node";
    emptyNode.textContent = "NULL";
    wrapper.appendChild(emptyNode);

    const label = document.createElement("div");
    label.className = "node-label";
    label.textContent = "HEAD";
    wrapper.appendChild(label);

    container.appendChild(wrapper);
}

// Clears the entire list with fade-out animations, one node at a time
function clearList() {
    if (!head) {
        showMessage("List is already empty.");
        return;
    }

    function deleteNextNode(index = 0) {
        const nodeWrappers = document.querySelectorAll(".node-wrapper");
        const arrows = document.querySelectorAll(".arrow");

        if (index >= nodeWrappers.length) {
            head = null;
            tail = null;
            renderEmptyListVisual();
            updateMemoryView();
            return;
        }

        const wrapper = nodeWrappers[index];
        if (wrapper) {
            wrapper.classList.add("fade-out");

            if (index > 0 && arrows[index - 1]) {
                arrows[index - 1].classList.add("fade-out");
            }

            setTimeout(() => {
                head = head?.next || null;
                deleteNextNode(index + 1);
            }, 400);
        }
    }

    deleteNextNode();
}

// Generates a simulated memory address for visual purposes
function generateAddress() {
    return '0x' + Math.floor(Math.random() * 0xFFF + 1).toString(16).padStart(3, '0');
}

// Updates the memory panel showing node addresses and link structure
function updateMemoryView() {
    const memoryBox = document.getElementById("memory-view");
    let output = '';
    let current = head;

    while (current !== null) {
        const addr = current.addr || "0x???";
        const nextAddr = current.next ? current.next.addr || "0x???" : "NULL";
        output += `Node ${addr}: value = ${current.value}, next → ${nextAddr}\n`;
        current = current.next;
    }

    if (head) {
        output += `\nHEAD: ${head.addr}\nTAIL: ${tail?.addr || "NULL"}\n`;
    } else {
        output = "List is empty.\n";
    }

    memoryBox.textContent = output;
}

// Toggles the memory panel visibility
function toggleMemoryView() {
    const memoryBox = document.getElementById("memory-box");
    memoryBox.classList.toggle("hidden");
}

// Utility function to pause execution for animation timing
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Highlights a node by index with a temporary visual effect
async function highlightNode(value, index) {
    const container = document.getElementById("list-container");
    const wrappers = Array.from(container.querySelectorAll(".node-wrapper"));

    const nodeDiv = wrappers[index].querySelector(".node");

    nodeDiv.classList.add("highlight");
    await sleep(500);
    nodeDiv.classList.remove("highlight");
}

// Applies a fade-out animation to a node before removing it from the DOM
async function fadeOutNode(value) {
    const container = document.getElementById("list-container");
    const wrappers = container.querySelectorAll(".node-wrapper");

    for (let wrapper of wrappers) {
        const nodeDiv = wrapper.querySelector(".node");
        if (parseInt(nodeDiv.textContent) === value) {
            wrapper.classList.add("fade-out");
            await sleep(400);
            wrapper.remove();
            break;
        }
    }
}
