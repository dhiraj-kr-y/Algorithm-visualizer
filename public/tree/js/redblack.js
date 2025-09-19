function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function resetHighlights() {
    d3.selectAll("circle").transition().duration(300)
        .attr("fill", function () {
            return this.getAttribute("data-color") || "black";
        })
        .attr("r", 18);
}

function animateNode(value, color = "yellow") {
    const nodes = d3.selectAll("text").filter(function () {
        return +d3.select(this).text() === value;
    });

    nodes.each(function (_, i, list) {
        const text = d3.select(list[i]);
        const circle = d3.select(text.node().previousSibling);

        circle
            .transition().duration(300)
            .attr("fill", color)
            .attr("r", 22)
            .transition().duration(300)
            .attr("r", 18);
    });
}

async function searchNode(node, target) {
    if (!node) return false;
    animateNode(node.value, "orange");
    await sleep(600);
    if (node.value === target) {
        animateNode(node.value, "green");
        await sleep(600);
        return true;
    } else if (target < node.value) {
        return await searchNode(node.left, target);
    } else {
        return await searchNode(node.right, target);
    }
}

async function inorderTraversal(node) {
    if (!node) return;
    await inorderTraversal(node.left);
    animateNode(node.value, "deepskyblue");
    await sleep(600);
    await inorderTraversal(node.right);
}

async function preorderTraversal(node) {
    if (!node) return;
    animateNode(node.value, "violet");
    await sleep(600);
    await preorderTraversal(node.left);
    await preorderTraversal(node.right);
}

async function postorderTraversal(node) {
    if (!node) return;
    await postorderTraversal(node.left);
    await postorderTraversal(node.right);
    animateNode(node.value, "gold");
    await sleep(600);
}

// ------------ Red-Black Tree Operations ------------
function isRed(node) {
    return node && node.color === "RED";
}

function rotateLeft(h) {
    let x = h.right;
    h.right = x.left;
    x.left = h;
    x.color = h.color;
    h.color = "RED";
    return x;
}

function rotateRight(h) {
    let x = h.left;
    h.left = x.right;
    x.right = h;
    x.color = h.color;
    h.color = "RED";
    return x;
}

function flipColors(h) {
    h.color = "RED";
    if (h.left) h.left.color = "BLACK";
    if (h.right) h.right.color = "BLACK";
}

function fixUp(h) {
    if (isRed(h.right) && !isRed(h.left)) h = rotateLeft(h);
    if (isRed(h.left) && isRed(h.left.left)) h = rotateRight(h);
    if (isRed(h.left) && isRed(h.right)) flipColors(h);
    return h;
}

function moveRedLeft(h) {
    flipColors(h);
    if (isRed(h.right?.left)) {
        h.right = rotateRight(h.right);
        h = rotateLeft(h);
        flipColors(h);
    }
    return h;
}

function moveRedRight(h) {
    flipColors(h);
    if (isRed(h.left?.left)) {
        h = rotateRight(h);
        flipColors(h);
    }
    return h;
}

function minNode(h) {
    while (h.left) h = h.left;
    return h;
}

function deleteMin(h) {
    if (!h.left) return null;
    if (!isRed(h.left) && !isRed(h.left.left)) {
        h = moveRedLeft(h);
    }
    h.left = deleteMin(h.left);
    return fixUp(h);
}

function insertRecursive(h, value) {
    if (!h) return { value, left: null, right: null, color: "RED" };

    if (value < h.value) h.left = insertRecursive(h.left, value);
    else if (value > h.value) h.right = insertRecursive(h.right, value);
    // no duplicates allowed

    return fixUp(h);
}

function deleteRecursive(h, value) {
    if (!h) return null;

    if (value < h.value) {
        if (h.left && !isRed(h.left) && !isRed(h.left.left)) {
            h = moveRedLeft(h);
        }
        h.left = deleteRecursive(h.left, value);
    } else {
        if (isRed(h.left)) {
            h = rotateRight(h);
        }
        if (value === h.value && !h.right) {
            return null;
        }
        if (h.right && !isRed(h.right) && !isRed(h.right.left)) {
            h = moveRedRight(h);
        }
        if (value === h.value) {
            const min = minNode(h.right);
            h.value = min.value;
            h.right = deleteMin(h.right);
        } else {
            h.right = deleteRecursive(h.right, value);
        }
    }
    return fixUp(h);
}

// ------------ Smooth Animation Functions ------------
async function animateInsertion(value) {
    const width = 1050;
    const startY = 0;
    const endY = 40;

    const tempNode = d3.select("#TreeContainer").append("g")
        .attr("transform", `translate(${width / 2}, ${startY})`)
        .style("opacity", 0);

    const circle = tempNode.append("circle")
        .attr("r", 0)
        .attr("fill", "green");

    const text = tempNode.append("text")
        .text(value)
        .attr("fill", "white")
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .style("opacity", 0);

    tempNode.transition()
        .duration(600)
        .ease(d3.easeCubicOut)
        .attr("transform", `translate(${width / 2}, ${endY})`)
        .style("opacity", 1);

    circle.transition().duration(600).attr("r", 18);
    text.transition().duration(600).style("opacity", 1);

    await sleep(1000);
    tempNode.transition().duration(400).style("opacity", 0).remove();
}

async function animateDeletion(value) {
    const nodeToDelete = d3.selectAll("text").filter(function () {
        return +d3.select(this).text() === value;
    }).node();

    if (!nodeToDelete) return;

    const circle = d3.select(nodeToDelete.previousSibling);
    const text = d3.select(nodeToDelete);

    circle.transition()
        .duration(600)
        .ease(d3.easeCubicIn)
        .attr("r", 0)
        .style("opacity", 0)
        .remove();

    text.transition()
        .duration(600)
        .ease(d3.easeCubicIn)
        .style("opacity", 0)
        .remove();

    await sleep(600);
}

// ------------ Tree Drawing ------------
function clearTree() {
    d3.select("#TreeContainer").selectAll("*").remove();
}

function drawTree(root) {
    if (!root) return;
    const width = 1050, height = 500;
    const svg = d3.select("#TreeContainer")
        .attr("width", width)
        .attr("height", height);

    const g = svg.append("g").attr("transform", "translate(50,50)");
    const treeLayout = d3.tree().size([width - 100, height - 100]);
    const rootNode = d3.hierarchy(root, d => [d.left, d.right].filter(Boolean));
    const treeData = treeLayout(rootNode);

    g.selectAll(".link")
        .data(treeData.links())
        .enter()
        .append("line")
        .attr("class", "link")
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y)
        .attr("stroke", "#ccc")
        .attr("stroke-width", 2);

    const node = g.selectAll(".node")
        .data(treeData.descendants())
        .enter()
        .append("g")
        .attr("class", "node")
        .attr("transform", d => `translate(${d.x},${d.y})`);

    node.append("circle")
        .attr("r", 18)
        .attr("fill", d => d.data.color === "RED" ? "red" : "black")
        .attr("data-color", d => d.data.color === "RED" ? "red" : "black");

    node.append("text")
        .attr("dy", 5)
        .attr("text-anchor", "middle")
        .attr("fill", "white")
        .text(d => d.data.value);
}

// ------------ Tree Management ------------
let redBlackValues = [];

function extractValues(node, list = []) {
    if (!node) return list;
    extractValues(node.left, list);
    list.push(node.value);
    extractValues(node.right, list);
    return list;
}

function rebalanceTree(values) {
    let root = null;
    values.forEach(value => {
        root = insertRecursive(root, value);
    });
    return root;
}

async function insertAndRebalance(tree, value) {
    await animateInsertion(value);
    redBlackValues.push(value);
    let newTree = rebalanceTree(redBlackValues);
    return newTree;
}

async function deleteAndRebalance(tree, value) {
    await animateDeletion(value);
    redBlackValues = redBlackValues.filter(v => v !== value);
    let newTree = rebalanceTree(redBlackValues);
    return newTree;
}

// ------------ Run Function ------------
export async function run(tree, value) {
    resetHighlights();
    const operation = document.getElementById("operation").value;
    let updatedTree = tree;

    if (!tree) {
        redBlackValues = [];
    }

    if (tree && redBlackValues.length === 0) {
        redBlackValues = extractValues(tree);
    }

    if (operation === "search" && value !== null) {
        const found = await searchNode(tree, value);
        if (!found) alert("Value not found in the tree.");
    } else if (operation === "inorder") {
        await inorderTraversal(tree);
    } else if (operation === "preorder") {
        await preorderTraversal(tree);
    } else if (operation === "postorder") {
        await postorderTraversal(tree);
    } else if (operation === "insert" && value !== null) {
        updatedTree = await insertAndRebalance(tree, value);
        clearTree();
        if (updatedTree) drawTree(updatedTree);
    } else if (operation === "delete" && value !== null) {
        updatedTree = await deleteAndRebalance(tree, value);
        clearTree();
        if (updatedTree) drawTree(updatedTree);
    }

    return updatedTree;
}

export function resetRedBlackValues() {
    redBlackValues = [];
}
