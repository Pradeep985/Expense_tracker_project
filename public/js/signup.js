document.addEventListener("DOMContentLoaded", () => {
    const signupForm = document.querySelector("#signupForm");

    signupForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = document.querySelector("#name").value.trim();
        const email = document.querySelector("#email").value.trim();
        const password = document.querySelector("#password").value.trim();

        if (!name || !email || !password) {
            alert("All fields are required!");
            return;
        }

        const response = await fetch("/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            alert("User registered successfully");
            window.location.href = "/"; 
        } else {
            alert(data.error || "Signup failed");
        }
    });
});
