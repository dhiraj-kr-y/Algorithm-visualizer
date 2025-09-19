import { updateBars, getSpeed } from "./main_sort.js";

export async function heapSort(array) {
    let n = array.length;

    // Build max heap
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        await heapify(array, n, i);
    }

    // Extract elements from heap one by one
    for (let i = n - 1; i > 0; i--) {
        // Swap root with last element
        [array[0], array[i]] = [array[i], array[0]];
        
        // Update visualization
        updateBars(array, getColorArray(n, i, 0, "yellow"));
        await delayAnimation();

        // Heapify reduced heap
        await heapify(array, i, 0);

        // Mark sorted element as green
        updateBars(array, getColorArray(n, i, -1, "green"));
        await delayAnimation();
    }

    // Mark entire array as sorted
    updateBars(array, Array(n).fill("green"));
}

// Heapify function
async function heapify(array, n, i) {
    let largest = i;
    let left = 2 * i + 1;
    let right = 2 * i + 2;

    // Compare with left child
    if (left < n && array[left] > array[largest]) {
        largest = left;
    }

    // Compare with right child
    if (right < n && array[right] > array[largest]) {
        largest = right;
    }

    // Swap if needed
    if (largest !== i) {
        [array[i], array[largest]] = [array[largest], array[i]];

        // Update visualization
        updateBars(array, getColorArray(n, i, largest, "red"));
        await delayAnimation();

        // Recursively heapify affected subtree
        await heapify(array, n, largest);
    }
}

// Function to generate a color array for visualization
function getColorArray(size, active1, active2, color) {
    let colors = new Array(size).fill("#3498db"); // Default blue
    if (active1 !== -1) colors[active1] = color;
    if (active2 !== -1) colors[active2] = color;
    return colors;
}

// Delay function for step-by-step animation
function delayAnimation() {
    return new Promise(resolve => setTimeout(resolve, getSpeed()));
}
