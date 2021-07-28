import _ from "lodash";

// eslint-disable-next-line no-unused-vars
const Form = (() =>
{
	// eslint-disable-next-line no-control-regex
	const emailRegExp = /((?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\]))/;
	const passwordRegExp = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z])(?=.*[!@#$%^&*()]).{8,}$/gm;
	
	const _form = document.querySelector("form");
	
	const _typedInputs = _.filter(document.querySelectorAll("input"), input => input.hasAttribute("required") && input.type !== "radio" && input.type !== "checkbox");
	const _radios = document.querySelectorAll("input#ZSW");
	const _checkboxes = document.querySelectorAll("input[name='aspect']");
	
	let tempValid;

	_form.addEventListener("submit", (e) =>
	{
		if (!CheckForm()) e.preventDefault();
		else alert("Up top, bruv");
	});

	// On clicking out of input box check if it's valid or not
	_typedInputs.forEach(input => input.addEventListener("focusout", () => CheckInput(input)));

	// On changing the radio or checkbox selection check if it's valid or not
	[..._radios, ..._checkboxes].forEach(element => element.addEventListener("input", () => CheckInput(element)));

	const CheckInput = input =>
	{
		switch (input.id)
		{
			case "name":
				if (!input.checkValidity()) ThrowError(input);
				else ClearError(input);
				break;

			case "email":
				if (!input.checkValidity() || !input.value.match(emailRegExp)) ThrowError(input);
				else ClearError(input);
				break;

			case "password":
				if (!input.checkValidity() || !input.value.match(passwordRegExp)) ThrowError(input);
				else ClearError(input);
				break;

			case "c-password":
				if (!input.checkValidity() || input.value !== document.querySelector("#password").value) ThrowError(input);
				else ClearError(input);
				break;

			case "age":
				if (!input.checkValidity()) ThrowError(input);
				else ClearError(input);
				break;

			case "ZSW":
				if (!_.find(_radios, radio => radio.checked)) ThrowError(_radios[0]);
				else ClearError(_radios[0]);
				break;

			case "Technicality":
			case "Musicality":
			case "Bass-Stuff":
				if (!_.find(_checkboxes, radio => radio.checked)) ThrowError(_checkboxes[0]);
				else ClearError(_checkboxes[0]);
				break;

			default:
				break;
		}
	};

	const CheckForm = () =>
	{
		// Sets validity to true by default and changes it only if an input is invalid and returns it
		let _valid = true;

		_typedInputs.forEach(input =>
		{
			if (!tempValid) _valid = false;
			CheckInput(input);
		});

		(() =>
		{
			if (!_.find(_radios, radio => radio.checked)) ThrowError(_radios[0]);
			else ClearError(_radios[0]);

			if (!tempValid) _valid = false;
		})();

		(() =>
		{
			if (!_.find(_checkboxes, radio => radio.checked)) ThrowError(_checkboxes[0]);
			else ClearError(_checkboxes[0]);

			if (!tempValid) _valid = false;
		})();

		return _valid;
	};

	const ThrowError = input =>
	{
		tempValid = false;

		let _error = input.parentElement.querySelector("span.error");
		// For radios
		if (_error == null) _error = input.parentElement.parentElement.querySelector("span.error");
		// For Checkboxes
		if (_error == null) _error = input.parentElement.parentElement.parentElement.querySelector("span.error");
		_error.classList.add("active");

		switch (input.id)
		{
			case "name":
				if (input.validity.valueMissing) _error.textContent = "Enter a name please?";
				else if (input.validity.tooShort && !input.validity.valueMissing) _error.textContent = `Mate, there is no name that has ${input.value.length} letters`;
				break;

			case "email":
				if (input.validity.valueMissing) _error.textContent = "Stop being a lazy prick and enter an email, cunt.";
				else if (!input.value.match(emailRegExp)) _error.textContent = "Enter a valid email, homie";
				break;

			case "password":
				if (input.validity.valueMissing) _error.textContent = "ENTER A PASSWORD FFS";
				//Checks for uppercase|lowercase|number|symbol|length in the password
				else if (!input.value.match(/(?=.*[A-Z])/gm)) _error.textContent = "It has to have an uppercase letter";
				else if (!input.value.match(/(?=.*[a-z])/gm)) _error.textContent = "It has to have a lowercase letter";
				else if (!input.value.match(/(?=.*\d)/gm)) _error.textContent = "It has to have a number";
				else if (!input.value.match(/(?=.*[!@#$%^&*()])/gm)) _error.textContent = "It has to have a special character";
				else if (input.value.length < 8) _error.textContent = "Minimum of 8 characters";
				break;

			case "c-password":
				if (input.validity.valueMissing) _error.textContent = "Enter the same password to confirm";
				else if (input.value !== document.querySelector("#password").value) _error.textContent = "That ain't the same password tho";
				break;

			case "age":
				if (input.validity.valueMissing) _error.textContent = "Enter your age. Don't be shy ya beda";
				else if (input.validity.rangeUnderflow) _error.textContent = "Drink the milk and go to bed, it's past your bedtime";
				else if (input.validity.rangeOverflow) _error.textContent = "Ent 3ay4 azay yasta?";
				break;

			case "ZSW":
				_error.textContent = "Choose one";
				break;

			case "Technicality":
			case "Musicality":
			case "Bass-Stuff":
				_error.textContent = "Choose anything ffs, you can't be that bad";
				break;

			default:
				console.log("error");
		}
	};

	const ClearError = input =>
	{
		tempValid = true;
		let _error = input.parentElement.querySelector("span.error");
		if (_error == null) _error = input.parentElement.parentElement.querySelector("span.error");
		if (_error == null) _error = input.parentElement.parentElement.parentElement.querySelector("span.error");

		_error.textContent = "";
		_error.parentElement.querySelector("span.error").classList.remove("active");
	};
})();
