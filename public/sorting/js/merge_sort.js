import { updateBars, getSpeed } from "./main_sort.js";

export async function mergeSort(array) {
    await mergeSortHelper(array, 0, array.length - 1);
    updateBars(array, Array(array.length).fill("green")); // Mark sorted
}

async function mergeSortHelper(array, left, right) {
    if (left >= right) return;

    const mid = Math.floor((left + right) / 2);
    await mergeSortHelper(array, left, mid);
    await mergeSortHelper(array, mid + 1, right);
    await merge(array, left, mid, right);
}

async function merge(array, left, mid, right) {
    let leftArr = array.slice(left, mid + 1);
    let rightArr = array.slice(mid + 1, right + 1);
    let i = 0, j = 0, k = left;

    while (i < leftArr.length && j < rightArr.length) {
        updateBars(array, getColorArray(array.length, k, k + 1, "red"));
        await delayAnimation();

        if (leftArr[i] <= rightArr[j]) {
            array[k] = leftArr[i];
            i++;
        } else {
            array[k] = rightArr[j];
            j++;
        }
        k++;
    }

    while (i < leftArr.length) {
        array[k] = leftArr[i];
        i++; k++;
    }

    while (j < rightArr.length) {
        array[k] = rightArr[j];
        j++; k++;
    }

    updateBars(array, getColorArray(array.length, left, right, "yellow"));
    await delayAnimation();
}

function getColorArray(size, active1, active2, color) {
    let colors = new Array(size).fill("#3498db"); // Default blue
    if (active1 !== -1) colors[active1] = color;
    if (active2 !== -1) colors[active2] = color;
    return colors;
}

function delayAnimation() {
    return new Promise(resolve => setTimeout(resolve, getSpeed()));
}
