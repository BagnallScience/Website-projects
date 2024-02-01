document.addEventListener('DOMContentLoaded', function () {
    const errorElement = document.getElementById('errorElement');
    const inputName = document.getElementById('name');
    const email = document.getElementById('email');
    const card = document.getElementById('card');
    const form = document.getElementById('myForm');

    if (errorElement && inputName && email && card && form) {
        // Add event listener for form submission
        form.addEventListener('submit', function h(e) {
            e.preventDefault(); // Prevent the default form submission
            let messages = [];

            // Check if first and last names are provided
            const nameParts = inputName.value.trim().split(' ');
            if (nameParts.length < 2) {
                messages.push("Invalid name. First and Last names are required");
                validateName({ target: inputName }); // Pass inputName to the function using event object
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email.value.trim())) {
                messages.push("Invalid email address. Please input a valid Email");
                validateEmail({ target: email }); // Pass email to the function using event object
            }

            // Card validation using Luhn's Algorithm
            const cardValue = card.value.replace(/\s/g, ''); // Remove spaces from the card number
            if (!luhnAlgorithm(cardValue) || !isValidCardNumber(cardValue)) {
                messages.push("Invalid credit card number. Please use only numbers and spaces, and ensure the value is greater than 0.");
                validateCard({ target: card }); // Pass card to the function using event object
            }

            if (messages.length > 0) {
                // Display error messages
                if (errorElement) {
                    errorElement.innerText = messages.join(', ');
                }
            } else {
                // Form data is valid, construct the mailto link and submit
                const mailtoLink = 'mailto:test@dn-uk.com' +
                    '?subject=' + encodeURIComponent('Form Submission') +
                    '&body=' + encodeURIComponent('Name: ' + inputName.value.trim() + '\n' +
                        'Email: ' + email.value.trim() + '\n' +
                        'Credit Card: ' + card.value.trim());
                // Open the user's default email client
                window.location.href = mailtoLink;
            }
        });

        // Add event listener for inputName blur
        inputName.addEventListener('blur', function (event) {
            validateName(event);
        });

        // Add event listener for email blur
        email.addEventListener('blur', function (event) {
            validateEmail(event);
        });

        // Add event listener for card blur
        card.addEventListener('blur', function (event) {
            validateCard(event);
        });

        // Luhn's Algorithm for credit card validation
        function luhnAlgorithm(cardNumber) {
            cardNumber = cardNumber.replace(/\s/g, '');
            var reversedDigits = cardNumber.split("").reverse().map(Number);
            for (var i = 1; i < reversedDigits.length; i += 2) {
                reversedDigits[i] *= 2;
                if (reversedDigits[i] > 9) {
                    reversedDigits[i] -= 9;
                }
            }
            var sum = reversedDigits.reduce(function (acc, digit) {
                return acc + digit;
            }, 0);
            return sum % 10 === 0;
        }

        function isValidCardNumber(cardNumber) {
            return parseInt(cardNumber, 10) > 0;
        }

        function validateName(event) {
            const nameParts = event.target.value.trim().split(' ');
            const hasFirstAndLastName = nameParts.length >= 2;
            const containsInitials = nameParts.some(part => part.length === 1);
            const isValid = hasFirstAndLastName && !containsInitials;
            updateFieldStatus(event.target, isValid);
            displayErrorMessage(isValid ? '' : 'Please enter both your first and last name without using initials.');
        }

        function validateEmail(event) {
            const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(event.target.value.trim());
            updateFieldStatus(event.target, isValid);
            displayErrorMessage(isValid ? '' : 'Please enter a valid Email address.');
        }

        function validateCard(event) {
            const cardValue = event.target.value.trim();
            const isValid = cardValue !== '' && luhnAlgorithm(cardValue) && isValidCardNumber(cardValue);
            updateFieldStatus(event.target, isValid);
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
            if (errorElement) {
                errorElement.innerText = message;
            }
            errorElement === null || errorElement === void 0 ? void 0 : errorElement.classList.toggle('active', message.trim() !== '');
        }
    }
});