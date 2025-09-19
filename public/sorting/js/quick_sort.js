import { updateBars, getSpeed } from "./main_sort.js";

export async function quickSort(array) {
    await quickSortHelper(array, 0, array.length - 1);
    updateBars(array, Array(array.length).fill("green")); // Mark the entire array as sorted
}

async function quickSortHelper(array, low, high) {
    if (low < high) {
        let pivotIndex = await partition(array, low, high);
        await quickSortHelper(array, low, pivotIndex - 1);
        await quickSortHelper(array, pivotIndex + 1, high);
    }
}

async function partition(array, low, high) {
    let pivot = array[high];
    let i = low - 1;
    
    for (let j = low; j < high; j++) {
        // Highlight pivot and current elements
        updateBars(array, getColorArray(array.length, j, high, "red"));
        await delayAnimation();
        
        if (array[j] < pivot) {
            i++;
            [array[i], array[j]] = [array[j], array[i]];
            updateBars(array, getColorArray(array.length, i, j, "yellow"));
            await delayAnimation();
        }
    }
    
    // Swap pivot into correct position
    [array[i + 1], array[high]] = [array[high], array[i + 1]];
    updateBars(array, getColorArray(array.length, i + 1, high, "green"));
    await delayAnimation();
    
    return i + 1;
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
