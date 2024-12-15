let failedAttempts = 0; // Track failed login attempts

async function handleAdminLogin() {
    const username = document.getElementById("adminUsername").value.trim();
    const password = document.getElementById("adminPassword").value.trim();
    const captchaResponse = hcaptcha.getResponse(); // Get hCaptcha response
    const loginButton = document.getElementById("adminLoginButton");

    try {
        // Perform admin login request
        const response = await fetch("http://localhost:4002/api/auth/admin-login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password, captcha: captchaResponse }),
        });

        const data = await response.json();

        if (!response.ok || !data.isAdmin) {
            failedAttempts++;
            alert(`Invalid credentials. Attempt ${failedAttempts} of 5.`);

            if (failedAttempts >= 5) {
                alert("Too many failed attempts. Redirecting to registration page.");
                window.location.href = "succesregister.html";
                return;
            }

            if (failedAttempts >= 2) {
                document.getElementById("captchaContainer").style.display = "block";
            }

            const delay = 30000; // 30 seconds
            alert(`Please wait ${delay / 1000} seconds before trying again.`);
            loginButton.disabled = true;

            setTimeout(() => {
                loginButton.disabled = false;
                hcaptcha.reset(); // Reset hCaptcha after delay
            }, delay);

            return;
        }

        // Successful login
        failedAttempts = 0;
        sessionStorage.setItem("userId", data.userId);
        sessionStorage.setItem("rank", data.rank);

        if (data.rank === "Admin") {
            alert("Admin login successful!");
            window.location.href = "admin.html";
        } else {
            alert("Access denied. Redirecting to registration page.");
            window.location.href = "succesregister.html";
        }
    } catch (error) {
        console.error("Error during admin login:", error);
        alert("An error occurred. Please try again.");
    }
}

document.getElementById("adminLoginButton").addEventListener("click", handleAdminLogin);

document.addEventListener("DOMContentLoaded", async () => {
    const userId = sessionStorage.getItem("userId");

    if (!userId) {
        window.location.href = "succesregister.html";
        return;
    }

    try {
        const response = await fetch(`http://localhost:4002/api/verify-admin/${userId}`);
        const data = await response.json();

        if (!response.ok || !data.isAdmin) {
            window.location.href = "succesregister.html";
            return;
        }

        document.getElementById("adminContent").style.display = "block";
    } catch (error) {
        console.error("Error verifying admin:", error);
        window.location.href = "succesregister.html";
    }
});
