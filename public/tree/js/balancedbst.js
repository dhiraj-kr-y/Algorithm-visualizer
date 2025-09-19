// balancedbst.js

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
        await sleep(6000);
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

async function animateInsertion(value) {
    const width = 1050;
    const tempNode = d3.select("#TreeContainer").append("g")
        .attr("transform", `translate(${width / 2}, 40)`);

    tempNode.append("circle")
        .attr("r", 0)
        .attr("fill", "green")
        .transition().duration(500).attr("r", 18);

    tempNode.append("text")
        .text(value)
        .attr("fill", "white")
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .style("opacity", 0)
        .transition().duration(500).style("opacity", 1);

    await sleep(1000);
    tempNode.transition().duration(500).style("opacity", 0).remove();
}

async function animateDeletion(value) {
    const nodeToDelete = d3.selectAll("text").filter(function () {
        return +d3.select(this).text() === value;
    }).node();

    if (!nodeToDelete) return;
    const circle = d3.select(nodeToDelete.previousSibling);

    circle.transition().duration(500).attr("r", 0).style("opacity", 0);
    d3.select(nodeToDelete).transition().duration(500).style("opacity", 0).remove();
    await sleep(500);
}

function insertAndRebalance(values, value) {
    let newValues = [...values, value];
    newValues.sort((a, b) => a - b);
    return newValues;
}

function deleteAndRebalance(values, value) {
    let newValues = values.filter(v => v !== value);
    newValues.sort((a, b) => a - b);
    return newValues;
}

function buildBalancedBST(values, start, end) {
    if (start > end) return null;
    let mid = Math.floor((start + end) / 2);
    return {
        value: values[mid],
        left: buildBalancedBST(values, start, mid - 1),
        right: buildBalancedBST(values, mid + 1, end),
        color: "BLACK"
    };
}

function extractValues(node, list = []) {
    if (!node) return list;
    extractValues(node.left, list);
    list.push(node.value);
    extractValues(node.right, list);
    return list;
}

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
        .attr("fill", "black")
        .attr("data-color", "black");

    node.append("text")
        .attr("dy", 5)
        .attr("text-anchor", "middle")
        .attr("fill", "white")
        .text(d => d.data.value);
}

let balancedValues = [];

export async function run(tree, value = null) {
    resetHighlights();
    const operation = document.getElementById("operation").value;
    let updatedTree = tree;

    if (tree && balancedValues.length === 0) {
        balancedValues = extractValues(tree);
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
        await animateInsertion(value);
        balancedValues = insertAndRebalance(balancedValues, value);
        updatedTree = buildBalancedBST(balancedValues, 0, balancedValues.length - 1);
        clearTree();
        if (updatedTree) drawTree(updatedTree);
    } else if (operation === "delete" && value !== null) {
        await animateDeletion(value);
        balancedValues = deleteAndRebalance(balancedValues, value);
        updatedTree = buildBalancedBST(balancedValues, 0, balancedValues.length - 1);
        clearTree();
        if (updatedTree) drawTree(updatedTree);
    }

    return updatedTree;
}
