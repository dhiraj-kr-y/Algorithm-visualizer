// bst.js

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
        await sleep(600); // Add a delay after highlighting green
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
    await sleep(1000);
    await inorderTraversal(node.right);
}

async function preorderTraversal(node) {
    if (!node) return;
    animateNode(node.value, "violet");
    await sleep(1000);
    await preorderTraversal(node.left);
    await preorderTraversal(node.right);
}

async function postorderTraversal(node) {
    if (!node) return;
    await postorderTraversal(node.left);
    await postorderTraversal(node.right);
    animateNode(node.value, "gold");
    await sleep(1000);
}

async function animateInsertion(value) {
    // 1. Create a temporary node at the root position
    const width = 1050;
    const height = 500;

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

    // 2. Animate the node moving to its correct position (simplified)
    //    In a real scenario, you'd calculate the exact x, y coordinates
    //    based on the tree structure.

    // 3. Fade out the temporary node
    tempNode.transition().duration(500)
        .style("opacity", 0)
        .remove();
}

async function animateDeletion(value) {
    // 1. Find the node to be deleted
    const nodeToDelete = d3.selectAll("text").filter(function () {
        return +d3.select(this).text() === value;
    }).node();

    if (!nodeToDelete) return;

    const circle = d3.select(nodeToDelete.previousSibling);

    // 2. Animate the node fading out
    circle.transition().duration(500)
        .attr("r", 0)
        .style("opacity", 0);

    d3.select(nodeToDelete).transition().duration(500)
        .style("opacity", 0)
        .remove();

    await sleep(500);
}

function insertNode(root, value) {
    if (!root) return { value, left: null, right: null, color: "BLACK" };
    if (value < root.value) root.left = insertNode(root.left, value);
    else if (value > root.value) root.right = insertNode(root.right, value);
    return root;
}

function findMin(node) {
    while (node.left) return node;
    return node;
}

function deleteNode(root, value) {
    if (!root) return null;
    if (value < root.value) {
        root.left = deleteNode(root.left, value);
    } else if (value > root.value) {
        root.right = deleteNode(root.right, value);
    } else {
        if (!root.left) return root.right;
        else if (!root.right) return root.left;

        let temp = findMin(root.right);
        root.value = temp.value;
        root.right = deleteNode(root.right, temp.value);
    }
    return root;
}

export async function run(tree, value = null) {
    resetHighlights();
    const operation = document.getElementById("operation").value;
    let updatedTree = tree;

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
        updatedTree = insertNode(tree, value);
    } else if (operation === "delete" && value !== null) {
        await animateDeletion(value);
        updatedTree = deleteNode(tree, value);
    }
    return updatedTree;
}
