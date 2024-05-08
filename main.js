const htmlElements = {
    result: document.getElementById('result'),
    copyBtn: document.getElementById('copy'),
    passCopied: document.getElementById('password-copied'),
    spanRangeValue: document.getElementById('length-value'),
    selectedLength: document.getElementById('length'),
    form: document.getElementById('settings'),
    checkboxUppercase: document.getElementById('uppercase'),
    checkboxLowercase: document.getElementById('lowercase'),
    checkboxNumbers: document.getElementById('numbers'),
    checkboxSymbols: document.getElementById('symbols'),
    errorMessage: document.getElementById('error-message'),
    strengthName: document.getElementById('strength-name'),
    strengthBarsContainer: document.getElementById('strength-bars'),
    bars: Array.from(document.querySelectorAll('.bar'))
}
const texts = {
    passCopied: 'copied',
    errorTooShort: "The password can't have 0 characters",
    errorNoCheckboxes: "Please select at least one set of characters"
}

htmlElements.spanRangeValue.innerText = htmlElements.selectedLength.value;

// fix for custom range input (the filled background to the left of the thumb)
htmlElements.selectedLength.oninput = function() {
    var value = (this.value-this.min)/(this.max-this.min)*100;
    this.style.background = 'linear-gradient(to right, var(--accent-color1) 0%, var(--accent-color1) ' + value + '%, var(--background-color2) ' + value + '%, var(--background-color2) 100%)';
    htmlElements.spanRangeValue.innerText = htmlElements.selectedLength.value;
  };

const chars = {
    lowersCase: "abcdefghijklmnopqrstuvwxyz",
    upperCase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    numbers: "1234567890",
    symbols: "!§$%&?=#+*-_^"
}

let selectedCharSet = "";

let password = "";

const generatePassword = (passLength) => {

    selectedCharSet = "";

    selectedCharSet += htmlElements.checkboxUppercase.checked ? chars.upperCase : "";
    selectedCharSet += htmlElements.checkboxLowercase.checked ? chars.lowersCase : "";
    selectedCharSet += htmlElements.checkboxNumbers.checked ? chars.numbers : "";
    selectedCharSet += htmlElements.checkboxSymbols.checked ? chars.symbols : "";

    password = "";

    // Generate random password !! Pseudo-Random !!
    for(let i=0; i<passLength; i++){
        let index = Math.round(Math.random() * (selectedCharSet.length - 1));
        password += selectedCharSet[index];
    }
    htmlElements.result.innerText = password;
    htmlElements.result.setAttribute("aria-label", `The generated password is: ${password}`)
    htmlElements.result.focus();
}

const validate = (passLength, allCheckedCheckboxes)=> {

    htmlElements.errorMessage.innerText = "";
    htmlElements.passCopied.innerText = "";
    
    if(allCheckedCheckboxes < 1){
        htmlElements.errorMessage.innerText = texts.errorNoCheckboxes;
        return false;
    } else if(passLength < 1) {
        htmlElements.errorMessage.innerText = texts.errorTooShort;
        return false;
    }
    return true;
}

const weaknessCheck = (passLength, allCheckedCheckboxes) => {
    let score = Math.round((allCheckedCheckboxes + passLength / 5 ) / 2);
    if(passLength<4){score = 1};

    let scoreName = "";
    let scoreClass = ""
    switch(score){
        case 1:
            scoreName="too weak";
            scoreClass = "tooweak";
        break;
        case 2:
            scoreName="weak";
            scoreClass = "weak";
        break;
        case 3:
            scoreName="medium";
            scoreClass = "medium";
        break;
        case 4:
            scoreName="strong";
            scoreClass = "strong";
    }
    htmlElements.strengthName.innerText = scoreName;

    htmlElements.strengthBarsContainer.className = scoreClass;

    htmlElements.bars.forEach((bar) => {
        if(bar.classList.contains('full')){
            bar.classList.remove('full')
        }
    })
    
    for(let i=0; i<score; i++){
        htmlElements.bars[i].classList.add('full');
    }
}

// Listening to changes on inputs
htmlElements.form.addEventListener('input', () => {
    htmlElements.result.innerText = "";
    let passLength = htmlElements.selectedLength.value;
    let allCheckedCheckboxes = Array.from(document.querySelectorAll(`input[type="checkbox"]:checked`)).length;
    validate(passLength, allCheckedCheckboxes);
    weaknessCheck(passLength, allCheckedCheckboxes);
})

htmlElements.form.addEventListener('submit', (event) => {
    event.preventDefault();

    let passLength = htmlElements.selectedLength.value; 
    let allCheckedCheckboxes = Array.from(document.querySelectorAll(`input[type="checkbox"]:checked`)).length;
    if(validate(passLength, allCheckedCheckboxes)){
        generatePassword(passLength);
    } else {
        htmlElements.result.innerText = "";
    };
    
})

// Copy the password
htmlElements.copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(htmlElements.result.innerText);
    htmlElements.passCopied.innerText = texts.passCopied;
})