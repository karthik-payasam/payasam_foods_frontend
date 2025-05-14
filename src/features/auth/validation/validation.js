const validation = ({ first_name, last_name, phone_number, email, password, confirmPassword }) => {
    let errors = {};

    if (!first_name) {
        errors.first_name = "First name is required.";
    }

    if (!last_name) {
        errors.last_name = "Last name is required.";
    }

    if (!phone_number) {
        errors.phone_number = "Phone number is required.";
    } else if (!/^\d{10}$/.test(phone_number)) {
        errors.phone_number = "Phone number must be a 10-digit number.";
    }

    if (!email) {
        errors.email = "Email is required.";
    } else if (!/^[A-Za-z0-9._%+-]+@[A-Za-z.-]+\.[A-Za-z]{2,}$/.test(email)) {
        errors.email = "Enter a valid email address.";
    }

    if (!password) {
        errors.password = "Password is required.";
    } else if (!/(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*]{10,}$/.test(password)) {
        errors.password = "Password must be at least 10 characters long, include an uppercase letter, a number, and a special character.";
    }

    if (!confirmPassword) {
        errors.confirmPassword = "Confirm password is required.";
    } else if (password !== confirmPassword) {
        errors.confirmPassword = "Passwords and ConfirmPassword do not match.";
    }

    return errors;
};
const order_user_validation = ({ country, firstname, lastname, address, appartment, city, state, pincode, phonenumber, user_id }) => {
    let errors = {};

    if (!country) {
        errors.country = "country is required.";
    }

    if (!lastname) {
        errors.lastname = "Last name is required.";
    }
    if (!address) {
        errors.address = "address is required.";
    }

    if (!city) {
        errors.city = "city is required.";
    }

    if (!state) {
        errors.state = "state is required.";
    }

    if (!pincode) {
        errors.pincode = "pincode is required.";
    }


    if (!phonenumber) {
        errors.phonenumber = "Phone number is required.";
    } else if (!/^\d{10}$/.test(phonenumber)) {
        errors.phonenumber = "Phone number must be a 10-digit number.";
    }
    return errors;
}

export { validation, order_user_validation };
