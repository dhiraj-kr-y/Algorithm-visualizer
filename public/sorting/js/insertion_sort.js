import { updateBars, getSpeed } from "./main_sort.js";

export async function insertionSort(array) {
    let n = array.length;
    
    for (let i = 1; i < n; i++) {
        let key = array[i];
        let j = i - 1;
        
        // Highlight the key element being inserted
        updateBars(array, getColorArray(n, i, -1, "red"));
        await delayAnimation();

        while (j >= 0 && array[j] > key) {
            array[j + 1] = array[j];
            updateBars(array, getColorArray(n, j, j + 1, "yellow"));
            await delayAnimation();
            j--;
        }
        
        array[j + 1] = key;
        updateBars(array, getColorArray(n, j + 1, -1, "green"));
        await delayAnimation();
    }

    // Mark entire array as sorted
    updateBars(array, Array(n).fill("green"));
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
