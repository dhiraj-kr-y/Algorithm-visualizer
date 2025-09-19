import { linearSearch } from "./linear_search.js";
import { binarySearch } from "./binary_search.js";

// Select DOM Elements
const svgContainer = d3.select("#ArrayBox");
const arrayContainer = document.getElementById("ArrayContent");
const startButton = document.getElementById("start");
const refreshButton = document.getElementById("refresh");
const algoSelect = document.getElementById("algo");
const countSlider = document.getElementById("count");
const speedSlider = document.getElementById("speed");
const searchKeyInput = document.getElementById("searchKey");

// Global Variables
let n = parseInt(countSlider.value);
let width = svgContainer.node().getBoundingClientRect().width - 20;
let height = 400;
let speed = getSpeed();
let data = generateRandomArray(n);

// Set SVG Dimensions
svgContainer
    .attr("width", width)
    .attr("height", height)
    .style("border", "2px solid black");

// Generate Random Array
function generateRandomArray(size) {
    return Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 10);
}

// Render Bars Using D3.js
function renderBars(array, highlightIndex = -1, highlightColor = "#3498db") {
    svgContainer.selectAll("*").remove();
    const barWidth = width / array.length - 2;

    svgContainer.selectAll("rect")
        .data(array)
        .enter()
        .append("rect")
        .attr("x", (d, i) => i * (barWidth + 2))
        .attr("y", d => height - d * 3)
        .attr("width", barWidth)
        .attr("height", d => d * 3)
        .attr("fill", (d, i) => (i === highlightIndex ? highlightColor : "#3498db"));

    renderArrayText(array);
}

// Render Array Elements as Text
function renderArrayText(array) {
    arrayContainer.innerText = "Array: [" + array.join(", ") + "]";
}

// Update Bars During Search
export function updateBars(array, highlightIndex, color = "green", persist = false) {
    svgContainer.selectAll("rect")
        .data(array)
        .transition()
        .duration(Math.max(50, getSpeed() / (array.length / 5)))
        .attr("fill", (d, i) => (i === highlightIndex ? color : persist ? "green" : "#3498db"));

    renderArrayText(array);
}

// Get Speed for Animation
export function getSpeed() {
    return 5000 - parseInt(speedSlider.value);
}

// Initialize Graph on Page Load
setTimeout(() => renderBars(data), 100);

// Searching Button Event Listener
startButton.addEventListener("click", async () => {
    let selectedAlgo = algoSelect.value;
    let searchKey = parseInt(searchKeyInput.value);

    if (isNaN(searchKey)) {
        alert("Please enter a valid number to search!");
        return;
    }

    // Disable start button to prevent spam clicks
    startButton.disabled = true;
    startButton.style.opacity = "0.6";

    renderArrayText(data);

    if (selectedAlgo === "linear") {
        await linearSearch(data, searchKey);
    } else if (selectedAlgo === "binary") {
        data.sort((a, b) => a - b);
        renderBars(data);
        await binarySearch(data, searchKey);
    }

    setTimeout(() => {
        startButton.disabled = false;
        startButton.style.opacity = "1";
    }, 500);
});

// Refresh Button Event Listener
refreshButton.addEventListener("click", () => {
    data = generateRandomArray(n);
    renderBars(data);
});

// Update Graph on Slider Change
countSlider.addEventListener("input", () => {
    n = parseInt(countSlider.value);
    data = generateRandomArray(n);
    renderBars(data);
});

speedSlider.addEventListener("input", () => {
    speed = getSpeed();
});
