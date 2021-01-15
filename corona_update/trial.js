// spread operator
let numbers = [1, 3, 5, 6, 9];

let max = Math.max(...numbers);
console.log(max);

// destructing

let [a, b, c, d] = numbers;

console.log(a);

function data(first, last, ...others) {
    for (let i = 0; i <= others.length; i++) {
        console.log(others[i]);
    }
}

data('You', 'Me', 26, 'SS1', 'Nigeria');