import { bubbleSort } from "./bubble_sort.js";
import { heapSort } from "./heap_sort.js";
import { quickSort } from "./quick_sort.js";
import { insertionSort } from "./insertion_sort.js";
import { selectionSort } from "./selection_sort.js";
import { mergeSort } from "./merge_sort.js";

// Select DOM Elements
const svgContainer = d3.select("#ArrayBox");
const arrayContainer = document.getElementById("arrayContainer"); // New
const startButton = document.getElementById("start");
const refreshButton = document.getElementById("refresh");
const algoSelect = document.getElementById("algo");
const countSlider = document.getElementById("count");
const speedSlider = document.getElementById("speed");

// Global Variables
let n = parseInt(countSlider.value);
let width = svgContainer.node().getBoundingClientRect().width - 20;
let height = 400;
let speed = 5000 - parseInt(speedSlider.value);
let data = generateRandomArray(n);

// Set SVG Dimensions
svgContainer
    .attr("width", width)
    .attr("height", height)
    .style("border", "2px solid black");

// Generate Random Array
function generateRandomArray(size) {
    let arr = Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 10);
    console.log("Generated Array:", arr);
    return arr;
}

// Render Bars Using D3.js
function renderBars(array) {
    svgContainer.selectAll("*").remove();

    if (!array.length) {
        console.warn("Empty array, nothing to render.");
        return;
    }

    const barWidth = width / array.length;

    svgContainer.selectAll("rect")
        .data(array)
        .enter()
        .append("rect")
        .attr("x", (d, i) => i * barWidth)
        .attr("y", d => height - d * 3) // Adjusted scaling factor
        .attr("width", barWidth - 2)
        .attr("height", d => d * 3)
        .attr("fill", "#3498db");

    renderArrayText(array); // Update array text below bars
}

// Render Array Elements as Text
function renderArrayText(array) {
    arrayContainer.innerHTML = ""; // Clear previous values

    array.forEach(value => {
        let span = document.createElement("span");
        span.textContent = value;
        span.style.padding = "5px";
        span.style.margin = "3px";
        span.style.borderRadius = "4px";
        span.style.background = "#ecf0f1";
        span.style.color = "#2c3e50";
        span.style.fontWeight = "bold";
        span.style.display = "inline-block";
        arrayContainer.appendChild(span);
    });
}

// Update Bars During Sorting
export function updateBars(array, colors = []) {
    svgContainer.selectAll("rect")
        .data(array)
        .transition()
        .duration(Math.max(50, getSpeed() / (array.length / 5)))
        .attr("y", d => height - d * 3)
        .attr("height", d => d * 3)
        .attr("fill", (d, i) => colors[i] || "#3498db");

    renderArrayText(array); // Update displayed array during sorting
}

// Get Speed for Animation
export function getSpeed() {
    return 5000 - parseInt(speedSlider.value);
}

// Initialize Graph
setTimeout(() => {
    renderBars(data);
}, 100);

// Sorting Button Event Listener
startButton.addEventListener("click", async () => {
    console.log("Sorting started...");
    let selectedAlgo = algoSelect.value;

    renderArrayText(data); // Display array before sorting

    if (selectedAlgo === "bubble") {
        await bubbleSort(data.slice());
    } else if (selectedAlgo === "heap") {
        await heapSort(data.slice());
    } else if (selectedAlgo === "merge") {
        await mergeSort(data.slice());
    } else if (selectedAlgo === "quick") {
        await quickSort(data.slice());
    } else if (selectedAlgo === "insertion") {
        await insertionSort(data.slice());
    } else if (selectedAlgo === "selection") {
        await selectionSort(data.slice());
    }

    renderArrayText(data); // Display array after sorting
    console.log("Sorting complete.");
    renderBars(sortedArray);
    renderArrayText(sortedArray);
});

// Refresh Button
refreshButton.addEventListener("click", () => {
    console.log("Refreshed array.");
    data = generateRandomArray(n);
    setTimeout(() => renderBars(data), 100);
});

// Update on Slider Change
countSlider.addEventListener("input", () => {
    n = parseInt(countSlider.value);
    console.log("New array size:", n);
    data = generateRandomArray(n);
    setTimeout(() => renderBars(data), 100);
});

speedSlider.addEventListener("input", () => {
    speed = getSpeed();
    console.log("New speed:", speed);
});
