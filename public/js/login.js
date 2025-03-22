document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault(); 
    
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
        const response = await fetch("http://localhost:3000/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.status === 200) {
            alert("User login successful!");
            window.location.href = "/dashboard"; 
        } else if (response.status === 401) {
            alert("Incorrect password. Please try again.");
        } else if (response.status === 404) {
            alert("User not found. Please sign up.");
        } else {
            alert(data.error || "Something went wrong. Please try again.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Something went wrong. Please try again.");
    }
});
