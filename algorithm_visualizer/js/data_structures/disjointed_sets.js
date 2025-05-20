// --- Constants ---
const nodeSize = 50;
let nodeGap = 20; // Adjusted dynamically based on screen size
const levelHeight = 90;

let parent = [];
let size = [];

// Create a new disjoint set
function createDisjointSet() {
  const n = parseInt(document.getElementById('array-size').value);
  if (isNaN(n) || n <= 0 || n > 20) {
    alert("Array size must be between 1 and 20.");
    return;
  }
  parent = Array.from({ length: n }, (_, i) => i);
  size = Array(n).fill(1);
  renderSet();
  rebuildVisualForest(parent);
  document.getElementById('array-size').value = '';
}

// Find with optional path compression
function find(x) {
  if (parent[x] !== x) {
    const root = find(parent[x]);
    if (document.getElementById('use-compression').checked) {
      parent[x] = root;
    }
    return root;
  }
  return x;
}

// Union two sets with optional union by size
function unionSets() {
  const x = parseInt(document.getElementById('element-x').value);
  const y = parseInt(document.getElementById('element-y').value);
  if (isNaN(x) || isNaN(y) || x >= parent.length || y >= parent.length) return;

  let rootX = find(x);
  let rootY = find(y);
  if (rootX === rootY) return;

  if (document.getElementById('use-size').checked) {
    if (size[rootX] < size[rootY]) [rootX, rootY] = [rootY, rootX];
    parent[rootY] = rootX;
    size[rootX] += size[rootY];
  } else {
    parent[rootY] = rootX;
  }

  renderSet();
  rebuildVisualForest(parent);

  document.getElementById('element-x').value = '';
  document.getElementById('element-y').value = '';
}

// Return the path from a node to its root
function findPath(x) {
  let path = [x];
  while (parent[x] !== x) {
    x = parent[x];
    path.push(x);
  }
  return path;
}

// Handle find operation with optional path compression and animations
function findSet() {
  const x = parseInt(document.getElementById('element-find').value);
  if (isNaN(x) || x >= parent.length) return;

  const path = findPath(x);
  animatePath(path);
  animateTreePath(path);

  if (document.getElementById('use-compression').checked) {
    const root = path[path.length - 1];
    for (let i = 0; i < path.length - 1; i++) {
      parent[path[i]] = root;
    }
  }

  const delay = path.length * 500 + 500;
  setTimeout(() => {
    renderSet();
    rebuildVisualForest(parent);
  }, delay);

  document.getElementById('element-find').value = '';
}

// Reset the disjoint set
function resetDisjointSet() {
  parent = [];
  size = [];
  renderSet();
  rebuildVisualForest(parent);
}

// Highlight the path in the array (yellow for all, green for the representative)
function animatePath(path) {
  const cells = document.querySelectorAll('.ds-cell');
  path.forEach((index, i) => {
    setTimeout(() => {
      const cell = cells[index];
      if (!cell) return;
      const isLast = i === path.length - 1;
      cell.style.backgroundColor = isLast ? '#c8e6c9' : '#ffe082';
      cell.style.borderColor = isLast ? '#2e7d32' : '#ff9800';
    }, i * 500);
  });
}

// Render the disjoint set array
function renderSet() {
  const container = document.getElementById('ds-array');
  const indices = document.getElementById('ds-indices');
  container.innerHTML = '';
  indices.innerHTML = '';
  parent.forEach((p, i) => {
    const cell = document.createElement('div');
    cell.className = 'ds-cell';
    cell.innerText = p;
    container.appendChild(cell);

    const index = document.createElement('div');
    index.className = 'ds-index';
    index.innerText = i;
    indices.appendChild(index);
  });
}

// Calculate tree layout positions recursively
function calculateTreePositions(tree, rootId, depth = 0, xOffset = 0) {
  const node = tree[rootId];
  if (!node) return 0;

  node.depth = depth;
  node.children = node.children || [];

  let totalWidth = 0;
  let childX = xOffset;
  node.children.forEach((childId) => {
    const childWidth = calculateTreePositions(tree, childId, depth + 1, childX);
    childX += childWidth + nodeGap;
    totalWidth += childWidth + nodeGap;
  });

  if (totalWidth === 0) totalWidth = nodeSize;
  node.x = xOffset + totalWidth / 2 - nodeSize / 2;
  node.y = depth * levelHeight;

  return totalWidth;
}

// Apply calculated (x, y) positions to each tree node in the DOM
function applyPositionsToDOM(tree) {
    const offsetY = document.getElementById('ds-array-container').offsetTop +
                    document.getElementById('ds-array-container').offsetHeight + 40;
  
    Object.values(tree).forEach(({ id, x, y }) => {
      const el = document.getElementById(`tree-node-${id}`);
      if (el) {
        el.style.position = 'absolute';
        el.style.left = `${x}px`;
        el.style.top = `${y + offsetY}px`;
      }
    });
  }
  
  // Build and render the forest visualization based on the current parent array
  function rebuildVisualForest(parentArray) {
    const forest = document.getElementById("ds-forest");
    forest.innerHTML = "";
    const tree = {};
  
    // Dynamically determine horizontal spacing
    const screenWidth = forest.offsetWidth;
    const estimatedTreeCount = parentArray.filter((p, i) => i === p).length;
    nodeGap = Math.max(10, Math.floor((screenWidth - estimatedTreeCount * nodeSize) / (estimatedTreeCount + 1)));
  
    // Create tree nodes and store structure
    for (let i = 0; i < parentArray.length; i++) {
      const node = document.createElement("div");
      node.className = "tree-node";
      node.id = `tree-node-${i}`;
      node.innerText = i;
      forest.appendChild(node);
      tree[i] = { id: i, children: [] };
    }
  
    // Assign children to each node
    parentArray.forEach((p, i) => {
      if (i !== p) {
        if (!tree[p].children.includes(i)) {
          tree[p].children.push(i);
        }
      }
    });
  
    // Calculate width of each root tree and total forest width
    let rootWidths = [];
    let totalWidth = 0;
  
    parentArray.forEach((p, i) => {
      if (i === p) {
        const width = calculateTreePositions(tree, i);
        rootWidths.push({ root: i, width });
        totalWidth += width + nodeGap;
      }
    });
  
    // Center the forest on screen
    let currentX = (window.innerWidth - totalWidth + nodeGap) / 2;
  
    rootWidths.forEach(({ root, width }) => {
      calculateTreePositions(tree, root, 0, currentX);
      currentX += width + nodeGap;
    });
  
    applyPositionsToDOM(tree);
    drawConnections();
  }
  
  // Draw lines between each parent and child node using canvas
  function drawConnections() {
    const canvas = document.getElementById('ds-lines');
    const ctx = canvas.getContext('2d');
    const forest = document.getElementById('ds-forest');
  
    canvas.width = document.documentElement.scrollWidth;
    canvas.height = document.documentElement.scrollHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#00796b';
    ctx.lineWidth = 2;
  
    parent.forEach((p, i) => {
      if (i === p) return;
  
      const parentNode = document.getElementById(`tree-node-${p}`);
      const childNode = document.getElementById(`tree-node-${i}`);
      if (!parentNode || !childNode) return;
  
      const parentRect = parentNode.getBoundingClientRect();
      const childRect = childNode.getBoundingClientRect();
  
      const scrollX = window.scrollX;
      const scrollY = window.scrollY;
  
      const startX = parentRect.left + parentRect.width / 2 + scrollX;
      const startY = parentRect.top + parentRect.height / 2 + scrollY;
      const endX = childRect.left + childRect.width / 2 + scrollX;
      const endY = childRect.top + childRect.height / 2 + scrollY;
  
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
    });
  }
  
  // Animate the find path in the tree view
  // All nodes are highlighted yellow, the representative is green
  function animateTreePath(path) {
    path.forEach((id, i) => {
      setTimeout(() => {
        const node = document.getElementById(`tree-node-${id}`);
        if (!node) return;
  
        const isLast = i === path.length - 1;
        node.style.backgroundColor = isLast ? '#c8e6c9' : '#ffe082';
        node.style.borderColor = isLast ? '#2e7d32' : '#ff9800';
      }, i * 500);
    });
  }
  
  // Update connections on screen resize or scroll
  window.addEventListener('resize', drawConnections);
  window.addEventListener('scroll', drawConnections);
  