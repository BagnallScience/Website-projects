const errorElement = document.getElementById('errorElement');
const name = document.getElementById('name');
const email = document.getElementById('email');
const card = document.getElementById('card');
const form = document.getElementById('myForm');

form.addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent the default form submission

    let messages = [];

    // Check if first and last names are provided
    const nameParts = name.value.trim().split(' ');
    if (nameParts.length < 2) {
        messages.push("Invalid name. First and Last names are required");
        validateName(); // Validate and update color
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value.trim())) {
        messages.push("Invalid email address. Please input a valid Email");
        validateEmail(); // Validate and update color
    }

    // Card validation using Luhn's Algorithm
    if (!luhnAlgorithm(card.value.trim())) {
        messages.push("Invalid credit card number. Please use only numbers and spaces.");
        validateCard(); // Validate and update color
    }

    if (messages.length > 0) {
        // Display error messages
        errorElement.innerText = messages.join(', ');

        // Optionally, you can focus on the first invalid field
        // (if you want to provide a better user experience)
        // Example: name.focus();
    } else {
        // Form data is valid, construct the mailto link and submit
        const mailtoLink = 'mailto:jackbagnall0960@gmail.com'
            + '?subject=' + encodeURIComponent('Form Submission')
            + '&body=' + encodeURIComponent(
                'Name: ' + name.value.trim() + '\n' +
                'Email: ' + email.value.trim() + '\n' +
                'Credit Card: ' + card.value.trim()
            );

        // Open the user's default email client
        window.location.href = mailtoLink;
    }
});

// Luhn's Algorithm for credit card validation
function luhnAlgorithm(cardNumber) {
    // Reverse the card number and convert each character to a number
    var reversedDigits = cardNumber.split("").reverse().map(Number);

    // Double the value of every second digit
    for (var i = 1; i < reversedDigits.length; i += 2) {
        reversedDigits[i] *= 2;

        // If the doubled value is greater than 9, subtract 9
        if (reversedDigits[i] > 9) {
            reversedDigits[i] -= 9;
        }
    }

    // Sum all the digits
    var sum = reversedDigits.reduce(function (acc, digit) {
        return acc + digit;
    }, 0);

    // The card number is valid if the sum is a multiple of 10
    return sum % 10 === 0;
}

function validateName() {
    const nameParts = name.value.trim().split(' ');
    const isValid = nameParts.length >= 2;
    updateFieldStatus(name, isValid);
    displayErrorMessage(isValid ? '' : 'First and Last names are required.');
}

function validateEmail() {
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
    updateFieldStatus(email, isValid);
    displayErrorMessage(isValid ? '' : 'Invalid email address.');
}

function validateCard() {
    const cardValue = card.value.trim();
    const isValid = cardValue !== '' && luhnAlgorithm(cardValue);
    updateFieldStatus(card, isValid);
    displayErrorMessage(isValid ? '' : 'Invalid credit card number.');
}

function updateFieldStatus(field, isValid) {
    if (isValid) {
        field.classList.remove('invalid');
        field.classList.add('valid');
        field.style.backgroundColor = 'lightgreen';
    } else {
        field.classList.remove('valid');
        field.classList.add('invalid');
        field.style.backgroundColor = 'lightcoral';
    }
}

function displayErrorMessage(message) {
    const errorElement = document.getElementById('errorElement');
    errorElement.innerText = message;

    // Toggle the 'active' class based on whether there are error messages
    errorElement.classList.toggle('active', message.trim() !== '');
}