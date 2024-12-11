// function to aet a cokie
function setCookie(name, value, days) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = `${name}=${value || ""}${expires}; path=/`;
}

// Trackk login attemps
let loginAttempts = 0;

document.querySelector("#submit").addEventListener("click", async (event) => {
  event.preventDefault();

  let username = document.querySelector("#username").value.trim();
  let email = document.querySelector("#email").value.trim();
  let password = document.querySelector("#password").value;

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  const usernameRegex = /^[a-zA-Z0-9_-]{5,15}$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d@$!%*?&]{8,16}$/;

  let errorContainer = document.querySelector("#errorMessages");

  if (!errorContainer) {
    errorContainer = document.createElement("div");
    errorContainer.id = "errorMessages";
    document.querySelector("#submit").parentElement.appendChild(errorContainer);
  } else {
    errorContainer.innerHTML = "";
  }

  let errors = [];
  let isFormValid = true;

  if (!emailRegex.test(email)) {
    errors.push("Please enter a valid email address.");
    isFormValid = false;
  }

  if (!usernameRegex.test(username)) {
    errors.push("Username must be 5-15 characters long and only contain letters, numbers, underscores, or hyphens.");
    isFormValid = false;
  }

  if (!passwordRegex.test(password)) {
    errors.push("Password must meet complexity requirements.");
    isFormValid = false;
  }

  if (!isFormValid) {
    errors.forEach((error) => {
      let errorMsg = document.createElement("p");
      errorMsg.style.color = "red";
      errorMsg.style.font = "monospace";
      errorMsg.textContent = error;
      errorContainer.appendChild(errorMsg);
    });
    return;
  }

  try {
    const response = await fetch("http://localhost:4002/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Login successful!");
      loginAttempts = 0;

      // store username and suredi
      sessionStorage.setItem("username", data.username);
      sessionStorage.setItem("userId", data.userId);

      setCookie("username", data.username, 7);

      window.location.href = "succesregister.html";
    } else {
      loginAttempts++;

      if (loginAttempts >= 3) {
        let purpleMsg = document.createElement("p");
        purpleMsg.style.color = "#9b59b6";
        purpleMsg.style.font = "monospace";
        purpleMsg.style.cursor = "pointer";
        purpleMsg.textContent = "Too many failed attempts. Would you like to register instead? Click here.";
        purpleMsg.addEventListener("click", function() {
          window.location.href = "index.html"; 
        });
        errorContainer.appendChild(purpleMsg);
      }

      let errorMsg = document.createElement("p");
      errorMsg.style.color = "red";
      errorMsg.style.font = "monospace";
      errorMsg.textContent = data.error || "Invalid credentials.";
      errorContainer.appendChild(errorMsg);
    }
  } catch (error) {
    console.error("Error:", error);
    loginAttempts++;

    if (loginAttempts >= 3) {
      let purpleMsg = document.createElement("p");
      purpleMsg.style.color = "#9b59b6";
      purpleMsg.style.font = "monospace";
      purpleMsg.style.cursor = "pointer";
      purpleMsg.textContent = "Too many failed attempts. Would you like to register instead? Click here.";
      purpleMsg.addEventListener("click", function() {
        window.location.href = "register.html";
      });
      errorContainer.appendChild(purpleMsg);
    }

    let errorMsg = document.createElement("p");
    errorMsg.style.color = "red";
    errorMsg.style.font = "monospace";
    errorMsg.textContent = "An error occurred. Please try again later.";
    errorContainer.appendChild(errorMsg);
  }
});
