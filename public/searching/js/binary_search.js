import { updateBars, getSpeed } from "./main_search.js";

export async function binarySearch(array, key) {
    let left = 0, right = array.length - 1;
    let found = false;

    while (left <= right) {
        let mid = Math.floor((left + right) / 2);

        // Highlight middle element in red (checking)
        updateBars(array, mid, "red");
        await delay(getSpeed());

        if (array[mid] === key) {
            updateBars(array, mid, "green", true);
            playSuccessSound();
            found = true;
            break;
        } else if (array[mid] < key) {
            for (let i = left; i <= mid; i++) {
                setTimeout(() => updateBars(array, i, "#808080"), i * 50);
            }
            left = mid + 1;
        } else {
            for (let i = mid; i <= right; i++) {
                setTimeout(() => updateBars(array, i, "#808080"), i * 50);
            }
            right = mid - 1;
        }
    }

    setTimeout(() => {
        alert(found ? `Element ${key} found!` : `Element ${key} not found!`);
    }, 500);
}

// Function to create delay for visualization
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Play Success Sound (Optional)
function playSuccessSound() {
    let audio = new Audio("../sounds/success.mp3");
    audio.play();
}
