//checks whether any highlight is present or not in the active screen
export default function highlightTester() {
    const highlightCollectioon = document.getElementsByClassName('highlightDiv')
    if (highlightCollectioon.length) {
        return true;
    }
    else {
        return false;
    }
}
