
let ususu = "";
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
    if (!usernameRegex.test(username)){
        errors.push("Username must be 5-15 characters long and only cointain letters,numbers,undersores,orhyphens.");
    }
    if (!emailRegex.test(email)){
        errors.push("Please enter a valid eamil adress.");
    }
    if (!passwordRegex.test(password)){
        errors.push("Password minimum 8 characters inlude both letters and numbers and contain atleast one uppercase letter and one symbol.");

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
        ususu = username;
        alert("form submitted sucesfuly!");
        let securitywords = [
            "Skyline@82", "Winter$12", "Oceanic#45", "Forest@78", "Starlit!99",
            "Mountain#67", "Shadow*14", "Frosted$31", "Galaxy@88", "IronWolf*47",
            "Mystic&32", "Phoenix#21", "Aurora$56", "Lunar@73", "Twilight*59",
            "Crimson#48", "Nebula@91", "Eclipse&64", "Thunder$81", "Falcon#37",
            "Comet!65", "Dragon@42", "Solaris$29", "Arctic#83", "Vortex@68",
            "Inferno*53", "Radiant#99", "Cobalt@26", "Blizzard$75", "Flare*92",
            "Vertex@34", "Sapphire#61", "Pyro$86", "Quantum*27", "Cipher@38",
            "Nimbus$93", "Strider#49", "Halcyon@85", "Onyx$54", "Velvet#77",
            "Glacier@46", "Tempest$99", "Obsidian@23", "Titanium*87", "Silver@71",
            "Crucible#44", "Tundra$63", "Nimbus*51", "Auroral@40", "Pinnacle$62",
            "Summit#78", "Enigma@35", "Sentinel$98", "Nebulous#33", "Thunders@89",
            "Ember$56", "Cometary#88", "Stellar@95", "Platinum#82", "Orbit@67",
            "Cascade$92", "Zenith@36", "Dynasty$47", "Equinox#58", "Celestial$28",
            "Chimera@81", "Valiant#64", "Apex@53", "Seraph$66", "Pulse#99",
            "Ethereal@25", "Umbra$46", "Spectral#68", "Prism@97", "Meteor$48",
            "Astro#54", "Dusk@19", "Haven$52", "Nebulae#60", "Stargaze@87",
            "Ascend#29", "Midnight$49", "Twister@65", "Raven#32", "Eon@84",
            "Echo$23", "Spirit#56", "Harmony@74", "Reverie$31", "Infinity#82",
            "Luminous@63", "Radiance$41", "Solstice#91", "Summoner@22", "Clarity$78",
            "Symphony#38", "Paragon@59", "Ether$27", "Visionary#46", "Ascension@64",
            "Velocity$72", "Momentum#98", "Fusion@25", "Euphoria$37", "Odyssey#99",
            "Mirage@54", "Uplift$88", "Resolve#81", "Cascade@44", "Tranquil$99",
            "Harmony@57", "Eclipse$96", "Beacon#19", "Alpine@45", "Pioneer$61"
        ];
        
        let random = function(count) {
            let shuffled = [...securitywords].sort(() => 0.5 - Math.random());
            return shuffled.slice(0, count);
        };

        let selectedWords = random(8);
        window.alert("DON'T SKIP IMPORTANT REMEMBER THIS WORDS")
        window.alert(selectedWords.join(", "));
        sessionStorage.setItem("username", username);
        console.log("Username before saving:", username);

        window.location.href = "succesregister.html";
    }
});
// need to do creat a databse where i can store user data andn retrive it 

