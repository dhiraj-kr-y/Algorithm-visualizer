import { run as bstRun } from "./bst.js";
import { run as avlRun } from "./avl.js";
import { run as rbRun } from "./redblack.js";
import { run as balancedRun } from "./balancedbst.js";

let currentTree = null; // Define currentTree here

// Generate unique random values
function getRandomValues(count, min = 1, max = 100) {
    let values = new Set();
    while (values.size < count) {
        values.add(Math.floor(Math.random() * (max - min + 1)) + min);
    }
    return Array.from(values);
}

// BST Insertion
function insertBST(root, value) {
    if (!root) return { value, left: null, right: null, color: "BLACK" };
    if (value < root.value) root.left = insertBST(root.left, value);
    else root.right = insertBST(root.right, value);
    return root;
}

// AVL Tree Insertion
function insertAVL(root, value) {
    function height(node) {
        return node ? node.height : 0;
    }

    function balanceFactor(node) {
        return node ? height(node.left) - height(node.right) : 0;
    }

    function rotateRight(y) {
        let x = y.left;
        y.left = x.right;
        x.right = y;
        y.height = Math.max(height(y.left), height(y.right)) + 1;
        x.height = Math.max(height(x.left), height(x.right)) + 1;
        return x;
    }

    function rotateLeft(x) {
        let y = x.right;
        x.right = y.left;
        y.left = x;
        x.height = Math.max(height(x.left), height(x.right)) + 1;
        y.height = Math.max(height(y.left), height(y.right)) + 1;
        return x;
    }

    if (!root) return { value, left: null, right: null, height: 1, color: "BLACK" };

    if (value < root.value) root.left = insertAVL(root.left, value);
    else root.right = insertAVL(root.right, value);

    root.height = Math.max(height(root.left), height(root.right)) + 1;
    let balance = balanceFactor(root);

    if (balance > 1 && value < root.left.value) return rotateRight(root);
    if (balance < -1 && value > root.right.value) return rotateLeft(root);
    if (balance > 1 && value > root.left.value) {
        root.left = rotateLeft(root.left);
        return rotateRight(root);
    }
    if (balance < -1 && value < root.right.value) {
        root.right = rotateRight(root.right);
        return rotateLeft(root);
    }

    return root;
}

// Red-Black Tree Insertion (simplified)
function insertRedBlack(root, value) {
    function balance(node) {
        if (!node) return node;

        if (node.left && node.left.color === "RED" && node.right && node.right.color === "RED") {
            node.color = "RED";
            node.left.color = node.right.color = "BLACK";
        }

        if (node.right && node.right.color === "RED" && (!node.left || node.left.color !== "RED")) {
            node = rotateLeft(node);
        }
        if (node.left && node.left.color === "RED" && node.left.left && node.left.left.color === "RED") {
            node = rotateRight(node);
        }

        return node;
    }

    function rotateLeft(node) {
        let rightChild = node.right;
        node.right = rightChild.left;
        rightChild.left = node;
        rightChild.color = node.color;
        node.color = "RED";
        return rightChild;
    }

    function rotateRight(node) {
        let leftChild = node.left;
        node.left = leftChild.right;
        leftChild.right = node;
        leftChild.color = node.color;
        node.color = "RED";
        return leftChild;
    }

    if (!root) return { value, left: null, right: null, color: "RED" };

    if (value < root.value) root.left = insertRedBlack(root.left, value);
    else root.right = insertRedBlack(root.right, value);

    return balance(root);
}

// Balanced BST from sorted array
function sortedArrayToBST(values, start, end) {
    if (start > end) return null;
    let mid = Math.floor((start + end) / 2);
    let node = {
        value: values[mid],
        left: sortedArrayToBST(values, start, mid - 1),
        right: sortedArrayToBST(values, mid + 1, end),
        color: "BLACK"
    };
    return node;
}

// Generate tree based on selected algorithm
function generateTree(type, nodes = 10) {
    let values = getRandomValues(nodes);

    if (type === "bst") {
        return values.reduce((root, val) => insertBST(root, val), null);
    } else if (type === "avl") {
        return values.reduce((root, val) => insertAVL(root, val), null);
    } else if (type === "redblack") {
        return values.reduce((root, val) => insertRedBlack(root, val), null);
    } else if (type === "balanced") {
        values.sort((a, b) => a - b);
        return sortedArrayToBST(values, 0, values.length - 1);
    }
}

// Draw tree using D3.js
function drawTree(tree) {
    d3.select("#TreeContainer").html("");
    const width = 1050, height = 500;
    const svg = d3.select("#TreeContainer").append("svg").attr("width", width).attr("height", height);

    function drawNode(node, x, y, depth, spacing) {
        if (!node) return;
        let gap = spacing / 2;

        if (node.left) {
            svg.append("line").attr("x1", x).attr("y1", y).attr("x2", x - gap).attr("y2", y + 60)
                .attr("stroke", "black").style("stroke-width", 1);
            drawNode(node.left, x - gap, y + 60, depth + 1, gap);
        }

        if (node.right) {
            svg.append("line").attr("x1", x).attr("y1", y).attr("x2", x + gap).attr("y2", y + 60)
                .attr("stroke", "black").style("stroke-width", 1);
            drawNode(node.right, x + gap, y + 60, depth + 1, gap);
        }

        svg.append("circle").attr("cx", x).attr("cy", y).attr("r", 0)
            .attr("fill", node.color === "RED" ? "red" : "black")
            .transition().duration(500).attr("r", 18);

        svg.append("text").attr("x", x - 10).attr("y", y + 5)
            .attr("fill", "white").text(node.value).style("opacity", 0)
            .transition().duration(500).style("opacity", 1);
    }

    drawNode(tree, width / 2, 40, 0, width / 2);
}

function loadTreeAlgorithm() {
    let algorithm = document.getElementById("treeType").value;
    
    // Reset redBlackValues before generating a new tree
    if (algorithm === "redblack") {
        import("./redblack.js").then(module => {
            module.resetRedBlackValues(); // Call reset function
        });
    }

    currentTree = generateTree(algorithm); // Store the generated tree
    drawTree(currentTree);

    if (algorithm === "bst") bstRun(currentTree);
    else if (algorithm === "avl") avlRun(currentTree);
    else if (algorithm === "redblack") rbRun(currentTree);
    else if (algorithm === "balanced") balancedRun(currentTree);
}

document.getElementById("refresh").addEventListener("click", loadTreeAlgorithm);

document.getElementById("start").addEventListener("click", async () => {
    const operation = document.getElementById("operation").value;
    const inputVal = parseInt(document.getElementById("nodeValue").value);

    if (!currentTree) {
        alert("Please generate a tree first by clicking RELOAD.");
        return;
    }

    let updatedTree;
    const treeType = document.getElementById("treeType").value;

    if (treeType === "bst") {
        updatedTree = await bstRun(currentTree, inputVal);
    } else if (treeType === "avl") {
        updatedTree = await avlRun(currentTree, inputVal);
    } else if (treeType === "redblack") {
        updatedTree = await rbRun(currentTree, inputVal);
    } else if (treeType === "balanced") {
        updatedTree = await balancedRun(currentTree, inputVal);
    }

    if (updatedTree) {
        currentTree = updatedTree;
        drawTree(currentTree);
    }
});

// Call loadTreeAlgorithm on initial load
window.addEventListener('load', loadTreeAlgorithm);