// Function to set a cookie
function setCookie(name, value, days) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = `${name}=${value || ""}${expires}; path=/`;
}

document.querySelector("#submit").addEventListener("click", async (event) => {
  event.preventDefault();

  let username = document.querySelector("#username").value;
  let email = document.querySelector("#email").value;
  let password = document.querySelector("#password").value;

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  let errorContainer = document.querySelector("#errorMessages");

  // Create error container if it doesn't exist
  if (!errorContainer) {
    errorContainer = document.createElement("div");
    errorContainer.id = "errorMessages";
    document.querySelector("#submit").parentElement.appendChild(errorContainer);
  } else {
    errorContainer.innerHTML = ""; // Clear previous error messages
  }

  let errors = [];
  let isFormValid = true;

  // Validate email format
  if (!emailRegex.test(email)) {
    errors.push("Please enter a valid email address.");
    isFormValid = false;
  }

  // Validate username (ensure it matches the specified regex)
  const usernameRegex = /^[a-zA-Z0-9_-]{5,15}$/;
  if (!usernameRegex.test(username)) {
    errors.push("Username must be 5-15 characters long and only contain letters, numbers, underscores, or hyphens.");
    isFormValid = false;
  }

  // Validate password format (including minimum length, special characters, etc.)
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d@$!%*?&]{8,16}$/;
  if (!passwordRegex.test(password)) {
    errors.push("Password must be 8-16 characters, including both letters and numbers, with at least one uppercase letter and one symbol.");
    isFormValid = false;
  }

  // Display validation errors if the form is invalid
  if (!isFormValid) {
    errors.forEach(function (error) {
      let errorMsg = document.createElement("p");
      errorMsg.style.color = "red";
      errorMsg.style.font = "monospace";
      errorMsg.textContent = error;
      errorContainer.appendChild(errorMsg);
    });
    return; // Stop further processing if the form is invalid
  }

  try {
    // Send login request to the backend
    const response = await fetch("http://localhost:4002/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Login successful!");

      // Store username in sessionStorage
      sessionStorage.setItem("username", data.username);

      // Set a cookie to remember the user for 7 days
      setCookie("username", data.username, 7);

      // Redirect to another page after successful login
      window.location.href = "succesregister.html";
    } else {
      // Handle backend errors and display appropriate messages
      if (data.error) {
        if (data.error.includes("Invalid username or email")) {
          document.querySelector("#username").style.borderColor = "red";
          document.querySelector("#email").style.borderColor = "red";
        } else if (data.error.includes("Invalid password")) {
          document.querySelector("#password").style.borderColor = "red";
        }

        let errorMsg = document.createElement("p");
        errorMsg.style.color = "red";
        errorMsg.style.font = "monospace";
        errorMsg.textContent = data.error || "Invalid credentials.";
        errorContainer.appendChild(errorMsg);
      }
    }
  } catch (error) {
    console.error("Error:", error);
    let errorMsg = document.createElement("p");
    errorMsg.style.color = "red";
    errorMsg.style.font = "monospace";
    errorMsg.textContent = "An error occurred. Please try again later.";
    errorContainer.appendChild(errorMsg);
  }
});
