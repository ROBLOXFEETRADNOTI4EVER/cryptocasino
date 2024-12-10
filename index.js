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

  const usernameRegex = /^[a-zA-Z0-9_-]{5,15}$/;
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
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
  if (!usernameRegex.test(username)) {
    errors.push("Username must be 5-15 characters long and only contain letters, numbers, underscores, or hyphens.");
  }
  if (!emailRegex.test(email)) {
    errors.push("Please enter a valid email address.");
  }
  if (!passwordRegex.test(password)) {
    errors.push("Password must be 8-16 characters, including both letters and numbers, with at least one uppercase letter and one symbol.");
  }

  if (errors.length > 0) {
    errors.forEach(function (error) {
      let errorMsg = document.createElement("p");
      errorMsg.style.color = "red";
      errorMsg.style.font = "monospace";
      errorMsg.textContent = error;
      errorContainer.appendChild(errorMsg);
    });
  } else {
    try {
      const response = await fetch("http://localhost:4002/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Registration successful!");
        sessionStorage.setItem("username", username);
        
        // Set a cookie to remember the user
        setCookie("username", username, 7); // Cookie valid for 7 days
        
        window.location.href = "login.html";
      } else {
        alert(data.error || "Registration failed.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
});