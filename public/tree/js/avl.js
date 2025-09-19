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

async function animateInsertion(value) {
    const width = 1050;

    const tempNode = d3.select("#TreeContainer").append("g")
        .attr("class", "temp-insert-node")
        .attr("transform", `translate(${width / 2}, 40)`);

    tempNode.append("circle")
        .attr("r", 0)
        .attr("fill", "green")
        .transition().duration(500)
        .attr("r", 18);

    tempNode.append("text")
        .text(value)
        .attr("fill", "white")
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .style("opacity", 0)
        .transition().duration(500)
        .style("opacity", 1);

    await sleep(1000);

    tempNode.transition().duration(300)
        .style("opacity", 0)
        .remove();

    await sleep(300);
}

async function animateDeletion(value) {
    const nodeToDelete = d3.selectAll("text").filter(function () {
        return +d3.select(this).text() === value;
    }).node();

    if (!nodeToDelete) return;

    const circle = d3.select(nodeToDelete.previousSibling);
    const text = d3.select(nodeToDelete);

    circle.transition().duration(500)
        .attr("r", 0)
        .style("opacity", 0);

    text.transition().duration(500)
        .style("opacity", 0);

    await sleep(500);
}

function insertAVL(root, value) {
    function height(node) {
        return node ? node.height : 0;
    }

    function updateHeight(node) {
        node.height = Math.max(height(node.left), height(node.right)) + 1;
    }

    function rotateRight(y) {
        let x = y.left;
        y.left = x.right;
        x.right = y;
        updateHeight(y);
        updateHeight(x);
        return x;
    }

    function rotateLeft(x) {
        let y = x.right;
        x.right = y.left;
        y.left = x;
        updateHeight(x);
        updateHeight(y);
        return y;
    }

    function balanceFactor(node) {
        return node ? height(node.left) - height(node.right) : 0;
    }

    if (!root) return { value, left: null, right: null, height: 1, color: "black" };

    if (value < root.value) root.left = insertAVL(root.left, value);
    else if (value > root.value) root.right = insertAVL(root.right, value);
    else return root;

    updateHeight(root);
    const balance = balanceFactor(root);

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

function deleteAVL(root, value) {
    function minValueNode(node) {
        while (node.left) node = node.left;
        return node;
    }

    if (!root) return null;

    if (value < root.value) root.left = deleteAVL(root.left, value);
    else if (value > root.value) root.right = deleteAVL(root.right, value);
    else {
        if (!root.left) return root.right;
        else if (!root.right) return root.left;

        let temp = minValueNode(root.right);
        root.value = temp.value;
        root.right = deleteAVL(root.right, temp.value);
    }

    function height(node) {
        return node ? node.height : 0;
    }

    function updateHeight(node) {
        node.height = Math.max(height(node.left), height(node.right)) + 1;
    }

    function rotateRight(y) {
        let x = y.left;
        y.left = x.right;
        x.right = y;
        updateHeight(y);
        updateHeight(x);
        return x;
    }

    function rotateLeft(x) {
        let y = x.right;
        x.right = y.left;
        y.left = x;
        updateHeight(x);
        updateHeight(y);
        return y;
    }

    function balanceFactor(node) {
        return node ? height(node.left) - height(node.right) : 0;
    }

    updateHeight(root);
    const balance = balanceFactor(root);

    if (balance > 1 && balanceFactor(root.left) >= 0) return rotateRight(root);
    if (balance > 1 && balanceFactor(root.left) < 0) {
        root.left = rotateLeft(root.left);
        return rotateRight(root);
    }
    if (balance < -1 && balanceFactor(root.right) <= 0) return rotateLeft(root);
    if (balance < -1 && balanceFactor(root.right) > 0) {
        root.right = rotateRight(root.right);
        return rotateLeft(root);
    }

    return root;
}

// This function must be defined in your project separately
// It should clear the old SVG elements and redraw the updated tree
// Example placeholder:
function drawTree(tree) {
    // your code to visualize the tree using D3
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
        updatedTree = insertAVL(tree, value);
        drawTree(updatedTree);
    } else if (operation === "delete" && value !== null) {
        await animateDeletion(value);
        updatedTree = deleteAVL(tree, value);
        drawTree(updatedTree);
    }

    return updatedTree;
}
