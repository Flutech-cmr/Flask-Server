var CheckLocalStorageForPreviousLogin = function () {
    let storage = window.localStorage;
    if (storage) {
        if (storage.getItem('Flutech_EMP_ID')) {
            return true;
        } else {
            return false;
        }
    } else {
        console.log("Storage Retured False")
        return false;
    }
}

var GetAccessLevelFromLocalStorage=function(){
    let storage = window.localStorage;
    if (storage) {
        if (storage.getItem('Flutech_Access_Level')) {
            return localStorage.getItem('Flutech_Access_Level');
        } else {
            return false;
        }
    } else {
        console.log("Storage Retured False")
        return false;
    }
}
