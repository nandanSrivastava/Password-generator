const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numberCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const Symbols = '`~!@#$%^*()_-+={[]};:",<.>?/';
let password = "";
let passwordLength = 10;
let checkCount = 0;

handleSlider();
setIndicator("#ccc");

// set password length
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
}

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    // shadow add 
}

function getRandominteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomnumber() {
    return getRandominteger(0, 9);
}

function getLowercase() {
    return String.fromCharCode(getRandominteger(97, 123));
}

function getUpperercase() {
    return String.fromCharCode(getRandominteger(65, 91));
}

function generateSymbol() {
    const randNum = getRandominteger(0, Symbols.length);
    return Symbols.charAt(randNum);
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numberCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 9) {
        setIndicator("#0f0");
    } else if ((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 7) {
        setIndicator("#ff0");
    } else {
        setIndicator("#f00");
    }
}

async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    } catch (e) {
        copyMsg.innerText = "failed";
    }
    copyMsg.classList.add("active");
    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}

function shufflePassword(array) {
    // fishers yates method
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if (checkbox.checked) {
            checkCount++;
        }
    });

    // special condition
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
});

inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
});

copyBtn.addEventListener('click', () => {
    if (passwordDisplay.value) {
        copyContent();
    }
});

generateBtn.addEventListener('click', () => {
    if (checkCount == 0)
        return;

    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    console.log("starting the journey");
    password = "";
    let funcArr = [];

    if (uppercaseCheck.checked) {
        funcArr.push(getUpperercase);
    }

    if (lowercaseCheck.checked) {
        funcArr.push(getLowercase);
    }

    if (numberCheck.checked) {
        funcArr.push(generateRandomnumber);
    }

    if (symbolsCheck.checked) {
        funcArr.push(generateSymbol);
    }

    // compulsory
    for (let i = 0; i < funcArr.length; i++) {
        password += funcArr[i]();
    }

    // remaining
    for (let i = 0; i < passwordLength - funcArr.length; i++) {
        let randomIndex = getRandominteger(0, funcArr.length);
        password += funcArr[randomIndex]();
    }

    // shuffle the password
    password = shufflePassword(Array.from(password));

    // show in UI
    passwordDisplay.value = password;
    calcStrength();
});

