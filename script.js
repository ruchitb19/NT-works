document.addEventListener("DOMContentLoaded", function () {
    AOS.init();

    var typed = new Typed("#typed-text", {
        strings: ["NT Works | IT Services &amp; Consulting", "Software Development Solutions &amp; Services"],
        typeSpeed: 50,
        backSpeed: 30,
        loop: true,
        showCursor: false
    });


    // JavaScript for Chatbot
    document.getElementById("chatIcon").addEventListener("click", function () {
        let chatContainer = document.getElementById("chatContainer");
        chatContainer.classList.toggle("hidden");
    });

    document.getElementById("sendBtn").addEventListener("click", sendMessage);
    document.getElementById("userInput").addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            sendMessage();
        }
    });

    function sendMessage() {
        let userInput = document.getElementById("userInput");
        let chatbox = document.getElementById("chatbox");
        let messageText = userInput.value.trim();

        if (messageText !== "") {
            let userMessage = document.createElement("div");
            userMessage.className = "text-right text-blue-600 mb-1";
            userMessage.textContent = messageText;
            chatbox.appendChild(userMessage);

            setTimeout(() => {
                let botMessage = document.createElement("div");
                botMessage.className = "text-left text-gray-600 mb-1";
                botMessage.textContent = "Bot: " + getBotResponse(messageText);
                chatbox.appendChild(botMessage);
                chatbox.scrollTop = chatbox.scrollHeight;
            }, 500);

            chatbox.scrollTop = chatbox.scrollHeight;
            userInput.value = "";
        }
    }

    function getBotResponse(input) {
        input = input.toLowerCase();

        const keywords = [
            { keyword: "hello", response: "Hello! Welcome to NT-works – your partner in IT solutions and consulting. How can we assist you today?" },
            { keyword: "hi", response: "Hello! Welcome to NT-works – your partner in IT solutions and consulting. How can we assist you today?" },
            { keyword: "services", response: "We offer a range of services including cloud solutions, cybersecurity, software development, IT consulting, and more." },
            { keyword: "consulting", response: "Our IT consulting services help businesses streamline operations, improve security, and boost productivity." },
            { keyword: "support", response: "Need help? Our tech support team is here to resolve any issues you’re facing." },
            { keyword: "thank", response: "You're welcome! Let us know if you need any more assistance." }
        ];

        for (let i = 0; i < keywords.length; i++) {
            if (input.includes(keywords[i].keyword)) {
                return keywords[i].response;
            }
        }

        return "I'm not sure how to respond to that. Can I connect you with one of our IT consultants?";
    }


    //  JavaScript for Toggling the Menu 
    const menuToggle = document.getElementById("menu-toggle");
    const mobileMenu = document.getElementById("mobile-menu");
    const mobileDropdownToggle = document.getElementById("mobile-dropdown-toggle");
    const mobileDropdown = document.getElementById("mobile-dropdown");
    const navbar = document.querySelector("nav");

    //  Mobile Menu Toggle
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener("click", function (event) {
            mobileMenu.classList.toggle("hidden");
            event.stopPropagation();
        });

        // Close menu when clicking outside
        document.addEventListener("click", function (event) {
            if (!mobileMenu.contains(event.target) && !menuToggle.contains(event.target)) {
                mobileMenu.classList.add("hidden");
            }
        });

        // ✅ Close menu when a link inside it is clicked
        const menuLinks = mobileMenu.querySelectorAll("a");
        menuLinks.forEach(link => {
            link.addEventListener("click", () => {
                mobileMenu.classList.add("hidden");
            });
        });
    }


    //  Mobile Dropdown Toggle
    if (mobileDropdownToggle && mobileDropdown) {
        mobileDropdownToggle.addEventListener("click", function (event) {
            mobileDropdown.classList.toggle("hidden");
            event.stopPropagation();
        });

    }

    //  Hide Navbar on Scroll Down, Show on Scroll Up
    let prevScrollPos = window.scrollY;

    window.addEventListener("scroll", function () {
        let currentScrollPos = window.scrollY;

        if (prevScrollPos < currentScrollPos && currentScrollPos > 50) {
            navbar.classList.add("-translate-y-full"); // Hide navbar
        } else {
            navbar.classList.remove("-translate-y-full"); // Show navbar
        }

        prevScrollPos = currentScrollPos;
    });

    //  Cookie Consent
    if (!localStorage.getItem("cookiesAccepted")) {
        document.getElementById("cookiePopup").classList.remove("hidden");
    }

    window.acceptCookies = function () {
        localStorage.setItem("cookiesAccepted", "true");
        document.getElementById("cookiePopup").classList.add("hidden");
    };

    //  JavaScript for More info Btn
    const buttons = document.querySelectorAll('.more-info-btn');

    buttons.forEach((btn) => {
        btn.addEventListener('click', () => {
            const info = btn.previousElementSibling;

            // Toggle classes
            info.classList.toggle('max-h-0');
            info.classList.toggle('max-h-40'); // Adjust to control how much height is shown

            // Optional: toggle button text
            if (btn.textContent.trim() === 'More Info') {
                btn.textContent = 'Less Info';
            } else {
                btn.textContent = 'More Info';
            }
        });
    });

    //  Contact Form Submission
    document.getElementById("contactForm").addEventListener("submit", async function (event) {
        event.preventDefault();

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const message = document.getElementById("message").value;
        const statusMessage = document.getElementById("statusMessage");

        try {
            const response = await fetch("http://localhost:5000/send-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, message }),
            });

            const result = await response.json();
            if (response.ok) {
                statusMessage.textContent = "Message sent successfully!";
                statusMessage.classList.remove("hidden", "text-red-500");
                statusMessage.classList.add("text-green-500");
                document.getElementById("contactForm").reset();
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            statusMessage.textContent = "Failed to send message. Try again.";
            statusMessage.classList.remove("hidden", "text-green-500");
            statusMessage.classList.add("text-red-500");
        }
    });

    //  Subscribe Form Submission
    document.getElementById("subscribeForm").addEventListener("submit", async function (event) {
        event.preventDefault();

        const email = document.getElementById("subscribeEmail").value;
        const subscribeMessage = document.getElementById("subscribeMessage");

        try {
            const response = await fetch("http://localhost:5000/subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const result = await response.json();
            if (response.ok) {
                subscribeMessage.textContent = "Subscribed successfully!";
                subscribeMessage.classList.remove("hidden", "text-red-500");
                subscribeMessage.classList.add("text-green-500");
                document.getElementById("subscribeForm").reset();
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            subscribeMessage.textContent = "Subscription failed. Try again.";
            subscribeMessage.classList.remove("hidden", "text-green-500");
            subscribeMessage.classList.add("text-red-500");
        }
    });

    // Javascript for Upload resume
    const uploadButton = document.querySelector("button");
    uploadButton.addEventListener("click", async function () {
        const fileInput = document.getElementById("resumeFile");
        const file = fileInput.files[0];

        if (!file) {
            alert("Please select a file to upload.");
            return;
        }

        const formData = new FormData();
        formData.append("resume", file);

        try {
            const response = await fetch("http://localhost:5000/upload-resume", {
                method: "POST",
                body: formData,
            });

            const result = await response.json();
            if (response.ok) {
                alert("Resume sent successfully!");
                fileInput.value = ""; // Clear input
            } else {
                throw new Error(result.message || "Upload failed");
            }
        } catch (error) {
            alert("Failed to send resume: " + error.message);
        }
    });
});
