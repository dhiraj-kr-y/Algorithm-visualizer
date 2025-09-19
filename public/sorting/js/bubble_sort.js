import { updateBars, getSpeed } from "./main_sort.js";

export async function bubbleSort(array) {
    let n = array.length;

    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            // Highlight current elements being compared
            updateBars(array, getColorArray(n, j, j + 1, "red"));
            await delayAnimation();  // Wait before checking

            if (array[j] > array[j + 1]) {
                // Swap values
                [array[j], array[j + 1]] = [array[j + 1], array[j]];

                // Update bars after swap
                updateBars(array, getColorArray(n, j, j + 1, "yellow"));
                await delayAnimation();  // Wait after swap
            }
        }

        // Mark sorted elements as green
        updateBars(array, getColorArray(n, -1, n - i - 1, "green"));
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
