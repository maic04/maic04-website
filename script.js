

/**
 * IMPORTANT NOTE:
 * This JavaScript provides a CLIENT-SIDE SIMULATION only.
 * It does NOT involve a server, database (like Java/SQL), or real payment processing.
 * User registrations, logins, and order data are handled temporarily in the browser's
 * localStorage (which can be cleared) and JavaScript memory.
 * For a truly functional website, a backend (e.g., Java with Spring Boot, Node.js with Express, PHP, Python)
 * and a database are required.
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const homeSection = document.getElementById('home');
    const signupLoginSection = document.getElementById('signup-login');
    const bakersSection = document.getElementById('bakers');
    const cakesSection = document.getElementById('baker-cakes-display');
    const orderSection = document.getElementById('order-payment');
    const contactSection = document.getElementById('contact');

    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form-element');
    const bakersGrid = document.getElementById('bakers-grid');
    const cakesGrid = document.getElementById('cakes-grid');
    const selectedBakerName = document.getElementById('selected-baker-name');
    const orderCakeName = document.getElementById('order-cake-name');
    const orderCakePrice = document.getElementById('order-cake-price');
    const orderTotalPrice = document.getElementById('order-total-price');

    const navBakersLink = document.getElementById('nav-bakers-link');

    const navSignupLoginLink = document.getElementById('nav-signup-login-link');
    const navWelcomeMessage = document.getElementById('nav-welcome-message');
    const currentUsernameSpan = document.getElementById('current-username');
    const navLogoutButton = document.getElementById('nav-logout-button');

    // --- Data Simulation (In a real app, this would come from a database) ---
    const users = JSON.parse(localStorage.getItem('registeredUsers')) || []; // Store users in localStorage
    let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null; // Track current user

    const bakers = [
        {
            id: 'sweet-delights',
            name: 'Sweet Delights Bakery',
            location: 'Downtown City, CA',
            services: 'Custom Cakes, Cupcakes, Wedding Cakes, Vegan Options',
            bio: 'Crafting happiness, one cake at a time since 2010. Specializing in intricate designs and unique flavors.',
            image: 'https://via.placeholder.com/100x100/FFD1DC/880e4f?text=Baker1'
        },
        {
            id: 'golden-spatula',
            name: 'The Golden Spatula',
            location: 'Northside Suburbs, NY',
            services: 'Birthday Cakes, Pastries, Gluten-Free, Delivery',
            bio: 'Home-baked goodness with a touch of magic. We believe every celebration deserves a memorable cake.',
            image: 'https://via.placeholder.com/100x100/ADD8E6/880e4f?text=Baker2'
        },
        {
            id: 'artisan-bakes',
            name: 'Artisan Bakes Co.',
            location: 'West Coast Beach, FL',
            services: 'Artisanal Bread, Designer Cakes, Dessert Tables, Corporate Orders',
            bio: 'Where art meets baking. Our creations are not just desserts, they are masterpieces.',
            image: 'https://via.placeholder.com/100x100/DDA0DD/880e4f?text=Baker3'
        }
    ];

    const cakes = [
        {
            id: 'cake1',
            bakerId: 'sweet-delights',
            name: 'Chocolate Dream Cake',
            description: 'Rich chocolate cake with ganache frosting.',
            price: 45.00,
            image: 'https://via.placeholder.com/250x180/FFC0CB/FFFFFF?text=Chocolate+Dream'
        },
        {
            id: 'cake2',
            bakerId: 'sweet-delights',
            name: 'Vanilla Bean Delight',
            description: 'Classic vanilla bean cake with buttercream.',
            price: 40.00,
            image: 'https://via.placeholder.com/250x180/ADD8E6/FFFFFF?text=Vanilla+Bean+Delight'
        },
        {
            id: 'cake3',
            bakerId: 'golden-spatula',
            name: 'Red Velvet Fantasy',
            description: 'Moist red velvet with cream cheese frosting.',
            price: 50.00,
            image: 'https://via.placeholder.com/250x180/DDA0DD/FFFFFF?text=Red+Velvet+Fantasy'
        },
        {
            id: 'cake4',
            bakerId: 'golden-spatula',
            name: 'Strawberry Shortcake Bliss',
            description: 'Layers of sponge cake, fresh strawberries, and whipped cream.',
            price: 48.00,
            image: 'https://via.placeholder.com/250x180/FFB6C1/FFFFFF?text=Strawberry+Shortcake'
        },
        {
            id: 'cake5',
            bakerId: 'artisan-bakes',
            name: 'Lemon Berry Bliss',
            description: 'Zesty lemon cake with fresh berry filling.',
            price: 55.00,
            image: 'https://via.placeholder.com/250x180/F0E68C/FFFFFF?text=Lemon+Berry+Bliss'
        },
        {
            id: 'cake6',
            bakerId: 'artisan-bakes',
            name: 'Caramel Macchiato Delight',
            description: 'Coffee-infused cake with creamy caramel layers.',
            price: 58.00,
            image: 'https://via.placeholder.com/250x180/DEB887/FFFFFF?text=Caramel+Macchiato'
        }
    ];

    let currentSelectedCake = null; // To store the cake selected for order

    // --- UI Update Functions ---
    function hideAllSections() {
        homeSection.classList.add('hidden');
        signupLoginSection.classList.add('hidden');
        bakersSection.classList.add('hidden');
        cakesSection.classList.add('hidden');
        orderSection.classList.add('hidden');
        contactSection.classList.add('hidden'); // Ensure contact is hidden too for controlled flow
    }

    function showSection(sectionElement) {
        hideAllSections(); // Hide everything first
        sectionElement.classList.remove('hidden');
        sectionElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function updateNavUI() {
        if (currentUser) {
            navSignupLoginLink.classList.add('hidden');
            navBakersLink.classList.remove('hidden');
            navWelcomeMessage.classList.remove('hidden');
            currentUsernameSpan.textContent = currentUser.username;
            navLogoutButton.classList.remove('hidden');
            showSection(bakersSection); // Automatically show bakers after login
            displayBakers(); // Populate bakers grid
        } else {
            navSignupLoginLink.classList.remove('hidden');
            navBakersLink.classList.add('hidden');
            navWelcomeMessage.classList.add('hidden');
            navLogoutButton.classList.add('hidden');
            showSection(homeSection); // Show home or login/signup
        }
    }

    // --- Authentication Functions ---
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = e.target.elements['reg-username'].value;
        const email = e.target.elements['reg-email'].value;
        const password = e.target.elements['reg-password'].value;
        const confirmPassword = e.target.elements['reg-confirm-password'].value;

        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        if (users.some(user => user.username === username || user.email === email)) {
            alert('Username or Email already exists. Please try logging in or use a different one.');
            return;
        }

        const newUser = { username, email, password }; // In real app, password would be hashed!
        users.push(newUser);
        localStorage.setItem('registeredUsers', JSON.stringify(users));
        currentUser = newUser;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        alert('Registration successful! You are now logged in.');
        registerForm.reset();
        updateNavUI();
    });

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const usernameOrEmail = e.target.elements['login-username'].value;
        const password = e.target.elements['login-password'].value;

        const foundUser = users.find(user =>
            (user.username === usernameOrEmail || user.email === usernameOrEmail) && user.password === password
        );

        if (foundUser) {
            currentUser = foundUser;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            alert(`Welcome back, ${currentUser.username}!`);
            loginForm.reset();
            updateNavUI();
        } else {
            alert('Invalid username/email or password.');
        }
    });

    navLogoutButton.addEventListener('click', () => {
        currentUser = null;
        localStorage.removeItem('currentUser');
        alert('You have been logged out.');
        updateNavUI();
    });

    // --- Dynamic Content Display Functions ---
    function displayBakers() {
        bakersGrid.innerHTML = ''; // Clear previous content
        bakers.forEach(baker => {

            const bakerCard = document.createElement('div');
            bakerCard.classList.add('baker-card');
            bakerCard.innerHTML = `
                <img src="${baker.image}" alt="${baker.name} Profile" class="baker-profile-img">
                <h3>${baker.name}</h3>
                <p><strong>Location:</strong> ${baker.location}</p>
                <p><strong>Services:</strong> ${baker.services}</p>
                <p><strong>Bio:</strong> ${baker.bio}</p>
                <button class="btn btn-secondary view-cakes-btn" data-baker-id="${baker.id}">View Cakes</button>
            `;
            bakersGrid.appendChild(bakerCard);
        });

        // Attach event listeners to newly created buttons
        document.querySelectorAll('.view-cakes-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const bakerId = e.target.dataset.bakerId;
                const bakerName = e.target.closest('.baker-card').querySelector('h3').textContent;
                displayCakes(bakerId, bakerName);
            });
        });
    }

    function displayCakes(bakerId, bakerName) {
        cakesGrid.innerHTML = ''; // Clear previous content
        selectedBakerName.textContent = `Cakes from ${bakerName}`;

        const bakerCakes = cakes.filter(cake => cake.bakerId === bakerId);

        if (bakerCakes.length === 0) {
            cakesGrid.innerHTML = '<p>No cakes available from this baker yet. Please check back later!</p>';
        } else {
            bakerCakes.forEach(cake => {
                const cakeCard = document.createElement('div');
                cakeCard.classList.add('cake-card');
                cakeCard.innerHTML = `
                    <img src="${cake.image}" alt="${cake.name}">
                    <h4>${cake.name}</h4>
                    <p>${cake.description}</p>
                    <p class="price">$${cake.price.toFixed(2)}</p>
                    <button class="btn btn-primary order-btn" data-cake-id="${cake.id}">Order Now</button>
                `;
                cakesGrid.appendChild(cakeCard);
            });
        }

        showSection(cakesSection);

        // Attach event listeners to newly created order buttons
        document.querySelectorAll('.order-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const cakeId = e.target.dataset.cakeId;
                handleOrderRequest(cakeId);
            });
        });
    }

    function handleOrderRequest(cakeId) {
        currentSelectedCake = cakes.find(cake => cake.id === cakeId);
        if (currentSelectedCake) {
            const deliveryFee = 5.00;
            const total = currentSelectedCake.price + deliveryFee;

            orderCakeName.textContent = currentSelectedCake.name;
            orderCakePrice.textContent = `$${currentSelectedCake.price.toFixed(2)}`;
            orderTotalPrice.textContent = `$${total.toFixed(2)}`;
            showSection(orderSection);
        } else {
            alert('Error: Cake not found.');
        }
    }

    // --- Event Listeners for Navigation & Flow ---
    document.querySelector('.back-to-bakers').addEventListener('click', () => {
        showSection(bakersSection);
    });

    document.querySelector('.back-to-cakes').addEventListener('click', () => {
        // Find the baker ID of the cake being ordered to go back to its cake list
        const bakerId = currentSelectedCake ? currentSelectedCake.bakerId : null;
        if (bakerId) {
            const baker = bakers.find(b => b.id === bakerId);
            displayCakes(bakerId, baker ? baker.name : 'Selected Baker');
        } else {
            // Fallback if currentSelectedCake is somehow null

            showSection(bakersSection);
        }
    });


    document.querySelector('.proceed-payment-btn').addEventListener('click', () => {
        if (currentSelectedCake) {
            alert(`Thank you for ordering the ${currentSelectedCake.name}!
            This is a demo; no actual payment is processed.
            Your cake will be delivered shortly (in your imagination!).`);
            // Optionally, clear the order and go back to bakers or home
            currentSelectedCake = null;
            updateNavUI(); // This will show bakers if logged in
        } else {
            alert('No cake selected for order.');
        }
    });

    // Handle internal navigation links to sections
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#bakers' && !currentUser) {
                e.preventDefault(); // Prevent default if not logged in
                alert('Please log in to view our bakers!');
                showSection(signupLoginSection);
                return;
            }
            if (targetId === '#signup-login') {
                 // If already logged in, clicking Join/Login should do nothing or prompt
                if (currentUser) {
                    e.preventDefault();
                    alert('You are already logged in!');
                    return;
                }
            }

            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                e.preventDefault(); // Prevent default anchor jump
                showSection(targetSection);
            }
        });
    });

    // --- Initial Load ---
    updateNavUI(); // Check login status and update UI on page load
});
