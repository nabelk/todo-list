export default function Storage() {
    const checkLocalStorage = (arr, storage) => {
        if (localStorage.getItem(storage)) {
            console.log('theres a storage');
            JSON.parse(localStorage.getItem(storage)).forEach((item) => {
                arr.push(item);
            });
        } else {
            console.log('no local storage');
        }
    };

    const updateLocalStorage = (arr, storage) => {
        localStorage.setItem(storage, JSON.stringify(arr));
        if (arr.length === 0) {
            localStorage.removeItem(storage);
        }
    };

    return { checkLocalStorage, updateLocalStorage };
}
