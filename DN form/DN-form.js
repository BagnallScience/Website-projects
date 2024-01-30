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
    const cardValue = card.value.replace(/\s/g, ''); // Remove spaces from the card number
    if (!luhnAlgorithm(cardValue) || !isValidCardNumber(cardValue)) {
        messages.push("Invalid credit card number. Please use only numbers and spaces, and ensure the value is greater than 0.");
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
        const mailtoLink = 'mailto:test@dn-uk.com'
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
    // Remove spaces from the card number
    cardNumber = cardNumber.replace(/\s/g, '');

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

// Check if the card number is greater than 0
function isValidCardNumber(cardNumber) {
    return parseInt(cardNumber, 10) > 0;
}

function validateName() {
    const nameParts = name.value.trim().split(' ');
    const hasFirstAndLastName = nameParts.length >= 2;
    const containsInitials = nameParts.some(part => part.length === 1);
    const isValid = hasFirstAndLastName && !containsInitials;

    updateFieldStatus(name, isValid);
    displayErrorMessage(isValid ? '' : 'Please enter both your first and last name without using initials.');
}

function validateEmail() {
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
    updateFieldStatus(email, isValid);
    displayErrorMessage(isValid ? '' : 'Please enter a valid Email address.');
}

function validateCard() {
    const cardValue = card.value.trim();
    const isValid = cardValue !== '' && luhnAlgorithm(cardValue) && isValidCardNumber(cardValue);
    updateFieldStatus(card, isValid);
    displayErrorMessage(isValid ? '' : 'Please enter a valid credit card number.');
}

function updateFieldStatus(field, isValid) {
    if (isValid) {
        field.classList.remove('invalid');
        field.classList.add('valid');
        field.style.backgroundColor = 'rgb(137, 200, 46)';
    } else {
        field.classList.remove('valid');
        field.classList.add('invalid');
        field.style.backgroundColor = 'rgb(231, 0, 100)';
    }
}

function displayErrorMessage(message) {
    const errorElement = document.getElementById('errorElement');
    errorElement.innerText = message;

    // Toggle the 'active' class based on whether there are error messages
    errorElement.classList.toggle('active', message.trim() !== '');
}