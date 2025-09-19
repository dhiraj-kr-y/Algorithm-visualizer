import { updateBars, getSpeed } from "./main_search.js";

export async function linearSearch(array, key) {
    let found = false;

    for (let i = 0; i < array.length; i++) {
        // Highlight current element in red (searching)
        updateBars(array, i, "red");
        await delay(getSpeed());

        if (array[i] === key) {
            // If key is found, mark it green
            updateBars(array, i, "green", true);
            playSuccessSound();
            found = true;
            break;
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
