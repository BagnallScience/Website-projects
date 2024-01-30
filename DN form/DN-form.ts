// TypeScript code

const errorElement: HTMLElement | null = document.getElementById('errorElement');
const name: HTMLInputElement | null = document.getElementById('name') as HTMLInputElement;
const email: HTMLInputElement | null = document.getElementById('email') as HTMLInputElement;
const card: HTMLInputElement | null = document.getElementById('card') as HTMLInputElement;
const form: HTMLFormElement | null = document.getElementById('myForm') as HTMLFormElement;

if (errorElement && name && email && card && form) {
    form.addEventListener('submit', function (e: Event) {
        e.preventDefault(); // Prevent the default form submission

        let messages: string[] = [];

        // Check if first and last names are provided
        const nameParts: string[] = name.value.trim().split(' ');
        if (nameParts.length < 2) {
            messages.push("Invalid name. First and Last names are required");
            validateName(); // Validate and update color
        }

        // Email validation
        const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value.trim())) {
            messages.push("Invalid email address. Please input a valid Email");
            validateEmail(); // Validate and update color
        }

        // Card validation using Luhn's Algorithm
        const cardValue: string = card.value.replace(/\s/g, ''); // Remove spaces from the card number
        if (!luhnAlgorithm(cardValue) || !isValidCardNumber(cardValue)) {
            messages.push("Invalid credit card number. Please use only numbers and spaces, and ensure the value is greater than 0.");
            validateCard(); // Validate and update color
        }

        if (messages.length > 0) {
            // Display error messages
            if (errorElement) {
                errorElement.innerText = messages.join(', ');
            }

            // Optionally, you can focus on the first invalid field
            // (if you want to provide a better user experience)
            // Example: name.focus();
        } else {
            // Form data is valid, construct the mailto link and submit
            const mailtoLink: string = 'mailto:test@dn-uk.com'
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
    function luhnAlgorithm(cardNumber: string): boolean {
        cardNumber = cardNumber.replace(/\s/g, '');
        var reversedDigits: number[] = cardNumber.split("").reverse().map(Number);

        for (var i = 1; i < reversedDigits.length; i += 2) {
            reversedDigits[i] *= 2;

            if (reversedDigits[i] > 9) {
                reversedDigits[i] -= 9;
            }
        }

        var sum: number = reversedDigits.reduce(function (acc, digit) {
            return acc + digit;
        }, 0);

        return sum % 10 === 0;
    }

    function isValidCardNumber(cardNumber: string): boolean {
        return parseInt(cardNumber, 10) > 0;
    }

    function validateName(): void {
        const nameParts: string[] = name.value.trim().split(' ');
        const hasFirstAndLastName: boolean = nameParts.length >= 2;
        const containsInitials: boolean = nameParts.some(part => part.length === 1);
        const isValid: boolean = hasFirstAndLastName && !containsInitials;

        updateFieldStatus(name, isValid);
        displayErrorMessage(isValid ? '' : 'Please enter both your first and last name without using initials.');
    }

    function validateEmail(): void {
        const isValid: boolean = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
        updateFieldStatus(email, isValid);
        displayErrorMessage(isValid ? '' : 'Please enter a valid Email address.');
    }

    function validateCard(): void {
        const cardValue: string = card.value.trim();
        const isValid: boolean = cardValue !== '' && luhnAlgorithm(cardValue) && isValidCardNumber(cardValue);
        updateFieldStatus(card, isValid);
        displayErrorMessage(isValid ? '' : 'Please enter a valid credit card number.');
    }

    function updateFieldStatus(field: HTMLInputElement, isValid: boolean): void {
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

    function displayErrorMessage(message: string): void {
        if (errorElement) {
            errorElement.innerText = message;
        }

        errorElement?.classList.toggle('active', message.trim() !== '');
    }
}