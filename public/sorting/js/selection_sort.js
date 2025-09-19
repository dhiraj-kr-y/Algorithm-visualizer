import { updateBars, getSpeed } from "./main_sort.js";

export async function selectionSort(array) {
    let n = array.length;

    for (let i = 0; i < n - 1; i++) {
        let minIndex = i;

        // Highlight the current element being checked
        updateBars(array, getColorArray(n, minIndex, -1, "red"));
        await delayAnimation();

        for (let j = i + 1; j < n; j++) {
            // Highlight current comparison element
            updateBars(array, getColorArray(n, minIndex, j, "yellow"));
            await delayAnimation();

            if (array[j] < array[minIndex]) {
                minIndex = j;

                // Highlight new minimum found
                updateBars(array, getColorArray(n, minIndex, -1, "red"));
                await delayAnimation();
            }
        }

        if (minIndex !== i) {
            // Swap elements
            [array[i], array[minIndex]] = [array[minIndex], array[i]];

            // Update bars after swap
            updateBars(array, getColorArray(n, i, minIndex, "yellow"));
            await delayAnimation();
        }

        // Mark sorted elements as green
        updateBars(array, getColorArray(n, -1, i, "green"));
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
