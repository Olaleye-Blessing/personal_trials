const quotePara = document.querySelector('blockquote p');
const quoteAuth = document.querySelector('small');
const btnQuote = document.querySelector('button');


let allQuotes;

let firstTime = 0;

async function getQuote() {
    let response = await fetch("https://type.fit/api/quotes");
    allQuotes = await response.json();
}

async function updadteQuote() {
    let randomNumber = Math.floor(Math.random() * 1645);
    await getQuote();
    let quote = allQuotes[randomNumber];
    quotePara.textContent = quote.text;
    quoteAuth.textContent = quote.author ? quote.author : "Unknown";
}

window.addEventListener('load', updadteQuote);

let timerId = setTimeout(async function slideQuote() {
    if (firstTime == 0) {
        await getQuote(); // wait for the quotes to be ready
        firstTime += 1;
    }
    updadteQuote();
    timerId = setTimeout(slideQuote, 10000);
}, 0);

btnQuote.onclick = function (event) {
    clearTimeout(timerId);
    updadteQuote();
    timerId = setTimeout(async function slideQuote() {
        updadteQuote();
        timerId = setTimeout(slideQuote, 10000);
    }, 3000);
}