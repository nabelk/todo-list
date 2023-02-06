export default function Storage() {
    const checkLocalStorage = (arr) => {
        if (localStorage.getItem('arr')) {
            console.log('theres a storage');
            JSON.parse(localStorage.getItem('arr')).forEach((item) => {
                arr.push(item);
            });
            console.table(localStorage.getItem('arr'));
        } else {
            console.log('no local storage');
            console.log(localStorage.getItem('arr'));
        }
    };

    const updateLocalStorage = (arr) => {
        localStorage.setItem('arr', JSON.stringify(arr));
        if (arr.length === 0) {
            localStorage.removeItem('arr');
        }
    };

    return { checkLocalStorage, updateLocalStorage };
}
