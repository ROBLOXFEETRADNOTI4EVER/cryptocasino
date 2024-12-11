// funtion to set a cookie
function setCookie(name, value, days) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = `${name}=${value || ""}${expires}; path=/`;
}

// track sregistartion atempts
let registerAttempts = 0;

document.querySelector("#submit").addEventListener("click", async (event) => {
  event.preventDefault();

  let username = document.querySelector("#username").value.trim();
  let email = document.querySelector("#email").value.trim();
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
        
        // setting a cokuee to remebr user for 7 days
        setCookie("username", username, 7);
        
        window.location.href = "login.html";
      } else {
        // registatton failed atemp
        registerAttempts++;
        
        // If 3 or more msg show purprle nigga on top
        if (registerAttempts >= 3) {
          let purpleMsg = document.createElement("p");
          purpleMsg.style.color = "#9b59b6";
          purpleMsg.style.font = "monospace";
          purpleMsg.style.cursor = "pointer";
          purpleMsg.textContent = "Too many failed registration attempts. Would you like to login instead? Click here.";
          purpleMsg.addEventListener("click", function() {
            window.location.href = "login.html";
          });
          errorContainer.appendChild(purpleMsg);
        }

        // showing the red errr msg under the purple clcible msg
        let errorMsg = document.createElement("p");
        errorMsg.style.color = "red";
        errorMsg.style.font = "monospace";
        errorMsg.textContent = data.error || "Registration failed.";
        errorContainer.appendChild(errorMsg);
      }
    } catch (error) {
      console.error("Error:", error);
      // this also countds as a failed attmept
      registerAttempts++;

      if (registerAttempts >= 3) {
        let purpleMsg = document.createElement("p");
        purpleMsg.style.color = "#9b59b6";
        purpleMsg.style.font = "monospace";
        purpleMsg.style.cursor = "pointer";
        purpleMsg.textContent = "Too many failed attempts. Would you like to login instead? Click here.";
        purpleMsg.addEventListener("click", function() {
          window.location.href = "login.html";
        });
        errorContainer.appendChild(purpleMsg);
      }

      let errorMsg = document.createElement("p");
      errorMsg.style.color = "red";
      errorMsg.style.font = "monospace";
      errorMsg.textContent = "An error occurred. Please try again later.";
      errorContainer.appendChild(errorMsg);
    }
  }
});
