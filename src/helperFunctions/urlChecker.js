export const urlChecker = (serachKey, checkWithViews = false) => {
    const currentLocation = window.location.pathname;
    const viewArrays = ['treeview', 'tileview', 'listview', 'nodeview'];
    let isViewPresent = false;
    if (checkWithViews) {
        for (let i in viewArrays) {
            if (currentLocation.includes(viewArrays[i])) isViewPresent = true;
        }
    }
    if (isViewPresent) return false;

    return currentLocation.includes(serachKey);
};