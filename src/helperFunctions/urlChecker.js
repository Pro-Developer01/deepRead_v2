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
export const urlViewFilter = () => {
    const currentLocation = window.location.pathname.split('/');
    const viewArrays = ['treeview', 'tileview', 'listview', 'nodeview'];
    let result = []
    for (let i in viewArrays) {
        if (window.location.pathname.includes(viewArrays[i])) {
            result = currentLocation.filter((item) => item !== viewArrays[i])
        }
    }
    if (result.length) {
        return result.join('/')
    }
    return window.location.pathname
};