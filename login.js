let testusername = "Niggaman";
let testemail = "example@gmail.com";
let testpassword = "BBCnigger@1Aa"
document.querySelector("#submit").addEventListener("click",function(event){
    event.preventDefault();
    let username = document.querySelector("#username").value;
    let email = document.querySelector("#email").value;
    let password = document.querySelector("#password").value;
    const usernameRegex = /^[a-zA-Z0-9_-]{5,15}$/;
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d@$!%*?&]{8,16}$/; 
    let errorContainer = document.querySelector("#errorMessages");
    if (!errorContainer){  // basicly if there is't an eror continer i creat one
        errorContainer = document.createElement("div");
        errorContainer.id = "errorMessages";
        document.querySelector("#submit").parentElement.appendChild(errorContainer);
    }
    else { errorContainer.innerHTML = "";}
    let errors = [];
    // if (!usernameRegex.test(username)){
    //     errors.push("Username must be 5-15 characters long and only cointain letters,numbers,undersores,orhyphens.");
    // }
    if (!emailRegex.test(email)){
        errors.push("Please enter a valid eamil adress.");
    }
    // if (!passwordRegex.test(password)){
    //     errors.push("Password minimum 8 characters inlude both letters and numbers and contain atleast one uppercase letter and one symbol.");

    // }
    if (email !== testemail){
        errors.push("Inccorect Email");

    }
    if (password !== testpassword){
        errors.push("Incorrect Password");
    }
    if (username !==  testusername){
        errors.push("Incorrect  Username");
    }
    if (errors.length > 0){
        errors.forEach(function(error){
            let errorMsg = document.createElement("p");
            errorMsg.style.color = "red";
            errorMsg.style.font = "monospace";
            errorMsg.textContent = error;
            errorContainer.appendChild(errorMsg);
        });
    } else {
        alert("Form submitted sucesfuly!");
        window.location.href = "Succes.html";
    }
});
    let Usernamereall = document.getElementById("usernameReal").innerHTML = testusername
