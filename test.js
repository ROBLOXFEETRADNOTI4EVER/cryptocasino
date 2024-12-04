document.querySelector("#submit").addEventListener("click", function(event) {
    event.preventDefault(); 
    let username = document.querySelector("#username").value;
    let email = document.querySelector("#email").value;
    let password = document.querySelector("#password").value;
    const usernameRegex = /^[a-zA-Z0-9_-]{5,15}$/;
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d@$!%*?&]{8,}$/; 
    let errorContainer = document.querySelector("#errorMessages");
    if (!errorContainer) {
        errorContainer = document.createElement("div");
        errorContainer.id = "errorMessages";
        document.querySelector("#submit").parentElement.appendChild(errorContainer);
    } else {
        errorContainer.innerHTML = ''; 
    }
    let errors = [];
    if (!usernameRegex.test(username)) {
        errors.push("Username must be 5-15 characters long and contain only letters, numbers, underscores, or hyphens.");
    }
    if (!emailRegex.test(email)) {
        errors.push("Please enter a valid email address.");
    }
    if (!passwordRegex.test(password)) {
        errors.push("Password must be at least 8 characters long, include both letters and numbers, and contain at least one uppercase letter,and one symbol.");
    }
    if (errors.length > 0) {
        errors.forEach(function(error) {
            let errorMsg = document.createElement("p");
            errorMsg.style.color = "red";
            errorMsg.textContent = error;
            errorContainer.appendChild(errorMsg);
        });
    } else {
        alert("Form submitted successfully!");
    }
});
