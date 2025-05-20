class TreeNode {
    constructor(value, x, y, id, parentId = null) {
      this.value = value;
      this.left = null;
      this.right = null;
      this.x = x;
      this.y = y;
      this.id = id;
      this.parentId = parentId;
    }
  }
  
  let root = null;
  let nodeId = 0;
  const spacingX = 40;
  const spacingY = 80;
  let messageTimeout;

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  // Highlight currently visited node
  async function highlightNode(id, notFound = false) {
    const node = document.querySelector(`.tree-node[data-id="${id}"]`);
    if (node) {
      node.classList.add('active');
      await sleep(700);
      node.classList.remove('active');
  
      if (notFound) {
        node.classList.add('not-found');
        setTimeout(() => node.classList.remove('not-found'), 1000);
      }
    }
  }
  
  
  // Highlight inserted node
  function highlightInserted(id) {
    const node = document.querySelector(`.tree-node[data-id="${id}"]`);
    if (node) {
      node.classList.add('inserted');
      setTimeout(() => node.classList.remove('inserted'), 1500);
    }
  }
  
  // Insert value into BST with animation
  async function insertValue() {
    const input = document.getElementById('bst-value');
    const value = parseInt(input.value);
    if (isNaN(value)) return;
  
    if (!root) {
      root = new TreeNode(value, window.innerWidth / 2 - 25, 20, ++nodeId);
      renderTree();
      highlightInserted(root.id);
      showMessage(`✅ Inserted: ${value}`, 'success');
    } else {
      if (valueExists(root, value)) {
        await animatedSearch(root, value); 
        showMessage(`⚠️ Value ${value} already exists`, 'error');
        input.value = '';
        return;
      }
  
      await animatedInsert(root, value, root.x, root.y, 200, null);
      showMessage(`✅ Inserted: ${value}`, 'success');
    }
  
    input.value = '';
    drawLines();
  }
  
  
  // Recursive insert with animation
  async function animatedInsert(node, value, x, y, offset, parentId) {
    await highlightNode(node.id);
  
    if (value < node.value) {
      if (!node.left) {
        node.left = new TreeNode(value, x - offset, y + spacingY, ++nodeId, node.id);
        renderTree();
        drawLines();
        highlightInserted(node.left.id);
      } else {
        await animatedInsert(node.left, value, x - offset, y + spacingY, offset / 1.8, node.id);
      }
    } else if (value > node.value) {
      if (!node.right) {
        node.right = new TreeNode(value, x + offset, y + spacingY, ++nodeId, node.id);
        renderTree();
        drawLines();
        highlightInserted(node.right.id);
      } else {
        await animatedInsert(node.right, value, x + offset, y + spacingY, offset / 1.8, node.id);
      }
    }
  }
  
  // Draw nodes
  function renderTree() {
    const container = document.getElementById('tree-container');
    container.querySelectorAll('.tree-node').forEach(n => n.remove());
  
    function createNodeElement(node, parentId = null) {
      const div = document.createElement('div');
      div.className = 'tree-node';
      div.textContent = node.value;
      div.style.left = `${node.x}px`;
      div.style.top = `${node.y}px`;
      div.setAttribute('data-id', node.id);
      if (parentId !== null) {
        div.setAttribute('data-parent', parentId);
      }
      container.appendChild(div);
  
      if (node.left) createNodeElement(node.left, node.id);
      if (node.right) createNodeElement(node.right, node.id);
    }
  
    if (root) createNodeElement(root);
  }
  
  
  // Draw lines using SVG
  function drawLines() {
    const svg = document.getElementById("connection-lines");
    svg.innerHTML = "";
  
    const nodes = document.querySelectorAll(".tree-node");
  
    nodes.forEach(node => {
      const parentId = node.getAttribute("data-parent");
      if (!parentId) return;
  
      const parent = document.querySelector(`.tree-node[data-id="${parentId}"]`);
      if (!parent) return;
  
      const nodeRect = node.getBoundingClientRect();
      const parentRect = parent.getBoundingClientRect();
      const containerRect = document.getElementById("tree-container").getBoundingClientRect();
  
      const x1 = parentRect.left + parentRect.width / 2 - containerRect.left;
      const y1 = parentRect.top + parentRect.height / 2 - containerRect.top;
      const x2 = nodeRect.left + nodeRect.width / 2 - containerRect.left;
      const y2 = nodeRect.top + nodeRect.height / 2 - containerRect.top;
  
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", x1);
      line.setAttribute("y1", y1);
      line.setAttribute("x2", x2);
      line.setAttribute("y2", y2);
      line.setAttribute("stroke", "#8d6e63");
      line.setAttribute("stroke-width", "2");
  
      svg.appendChild(line);
    });
  }
  
  // Reset tree
  function resetTree() {
    root = null;
    document.getElementById('tree-container').innerHTML = '<svg id="connection-lines"></svg>';
    nodeId = 0;
    document.getElementById('traversal-title').textContent =
    "Traversal Output";
  
  document.getElementById('traversal-output').textContent =" ";
  
  }
  // Performs animated search for a value in the BST
async function searchValue() {
    const input = document.getElementById('bst-value');
    const value = parseInt(input.value);
    if (isNaN(value) || !root) return;
  
    const found = await animatedSearch(root, value);
    if (found) {
      showMessage(`🔍 Found: ${value}`, 'success');
    } else {
      showMessage(`❌ Not found: ${value}`, 'error');
    }
  
    input.value = '';
  }
  
  // Recursively highlights the search path in the BST and indicates whether the value was found
  async function animatedSearch(node, value) {
    if (!node) return false;
  
    await highlightNode(node.id);
  
    if (value === node.value) {
      markFound(node.id);
      return true;
    } else if (value < node.value) {
      if (!node.left) {
        await highlightNode(node.id, true);
        return false;
      }
      return await animatedSearch(node.left, value);
    } else {
      if (!node.right) {
        await highlightNode(node.id, true);
        return false;
      }
      return await animatedSearch(node.right, value);
    }
  }
  
  // Temporarily marks a node in green to indicate that it was found
  function markFound(id) {
    const node = document.querySelector(`.tree-node[data-id="${id}"]`);
    if (node) {
      node.classList.add('found');
      setTimeout(() => node.classList.remove('found'), 2000);
    }
  }
  
  // Displays a styled message that fades out after a given duration
  function showMessage(msg, type = "info", duration = 3000) {
    const message = document.getElementById('message');
    message.textContent = msg;
  
    // Clear any previous styles
    message.className = '';
    message.classList.add(type, 'show');
  
    // Clear previous timeout if any
    if (messageTimeout) clearTimeout(messageTimeout);
  
    // Auto-hide message
    messageTimeout = setTimeout(() => {
      message.classList.remove('show');
    }, duration);
  }
  
  // Handles deletion of a value from the BST with animation
  async function deleteValue() {
    const input = document.getElementById('bst-value');
    const value = parseInt(input.value);
    if (isNaN(value) || !root) return;
  
    const [newRoot, deleted] = await animatedDelete(root, value);
    root = newRoot;
    recalculatePositions(root);
    renderTree();
    drawLines();
  
    if (deleted) {
      showMessage(`🗑️ Deleted: ${value}`, 'success');
    } else {
      showMessage(`❌ Value ${value} not found`, 'error');
    }
  
    input.value = '';
  }
  
  // Recursively searches and deletes a node with animation; handles 3 BST delete cases
  async function animatedDelete(node, value, parent = null) {
    if (!node) return [null, false];
  
    await highlightNode(node.id);
  
    if (value < node.value) {
      const [newLeft, deleted] = await animatedDelete(node.left, value, node);
      node.left = newLeft;
      return [node, deleted];
    } else if (value > node.value) {
      const [newRight, deleted] = await animatedDelete(node.right, value, node);
      node.right = newRight;
      return [node, deleted];
    } else {
      // Node found – mark for deletion
      markDeleted(node.id);
      await sleep(800);
  
      // Case 1: No children
      if (!node.left && !node.right) {
        return [null, true];
      }
  
      // Case 2: One child
      if (!node.left) return [node.right, true];
      if (!node.right) return [node.left, true];
  
      // Case 3: Two children – replace with inorder successor
      const [successor, newRight] = await findMinWithAnimation(node.right);
      markSuccessor(successor.id);
      await sleep(1000);
  
      node.value = successor.value;
      node.right = newRight;
  
      return [node, true];
    }
  }
  
  // Finds the leftmost (minimum) node in a subtree with animation
  async function findMinWithAnimation(node, parent = null) {
    if (!node.left) {
      return [node, node.right];
    }
  
    await highlightNode(node.id);
    const [minNode, newLeft] = await findMinWithAnimation(node.left, node);
    node.left = newLeft;
    return [minNode, node];
  }
  
  // Highlights a node in red to indicate deletion
  function markDeleted(id) {
    const node = document.querySelector(`.tree-node[data-id="${id}"]`);
    if (node) {
      node.classList.add('deleted');
      setTimeout(() => node.classList.remove('deleted'), 1000);
    }
  }
  
  // Highlights the inorder successor node in green
  function markSuccessor(id) {
    const node = document.querySelector(`.tree-node[data-id="${id}"]`);
    if (node) {
      node.classList.add('successor');
      setTimeout(() => node.classList.remove('successor'), 1500);
    }
  }
  
  // Recalculates positions of all nodes based on tree depth and structure
  function recalculatePositions(node, depth = 0, xCenter = window.innerWidth / 2 - 25, offset = 200) {
    if (!node) return;
  
    node.y = 20 + depth * spacingY;
    node.x = xCenter;
  
    recalculatePositions(node.left, depth + 1, xCenter - offset, offset / 1.8);
    recalculatePositions(node.right, depth + 1, xCenter + offset, offset / 1.8);
  }
  
  // Returns true if a value already exists in the tree (used to prevent duplicates)
  function valueExists(node, value) {
    if (!node) return false;
    if (value === node.value) return true;
    if (value < node.value) return valueExists(node.left, value);
    return valueExists(node.right, value);
  }
  

// Main function to perform animated tree traversal
// type can be 'in', 'pre', or 'post'
async function runTraversal(type) {
    if (!root) return; // No tree to traverse
  
    const result = []; // Stores the traversal order
  
    disableControls(true); // Disable buttons during animation
    await traverseAnimated(root, type, result); // Perform traversal
    disableControls(false); // Re-enable controls
  
    // Update the traversal box with the result
    document.getElementById('traversal-title').textContent =
      getTraversalName(type) + " Traversal";
  
    document.getElementById('traversal-output').textContent =
      result.join(' → ');
  }
  
  // Recursively traverses the tree in the selected order with animation
  async function traverseAnimated(node, type, result) {
    if (!node) return;
  
    // Pre-Order: visit → left → right
    if (type === 'pre') result.push(node.value);
    if (type === 'pre') await highlightTraversal(node.id);
  
    await traverseAnimated(node.left, type, result);
  
    // In-Order: left → visit → right
    if (type === 'in') result.push(node.value);
    if (type === 'in') await highlightTraversal(node.id);
  
    await traverseAnimated(node.right, type, result);
  
    // Post-Order: left → right → visit
    if (type === 'post') result.push(node.value);
    if (type === 'post') await highlightTraversal(node.id);
  }
  
  // Highlights a node briefly during traversal
  async function highlightTraversal(id) {
    const node = document.querySelector(`.tree-node[data-id="${id}"]`);
    if (node) {
      node.classList.add('active');      // Add highlight style
      await sleep(500);                  // Wait for animation
      node.classList.remove('active');   // Remove highlight
    }
  }
  
  // Disables or enables all buttons during animations
  function disableControls(disable) {
    document.querySelectorAll('button').forEach(btn => {
      btn.disabled = disable;
    });
  }
  
  // Returns a formatted name for the traversal type
  function getTraversalName(type) {
    switch (type) {
      case 'in': return 'In-Order';
      case 'pre': return 'Pre-Order';
      case 'post': return 'Post-Order';
      default: return '';
    }
  }
  
  