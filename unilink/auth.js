document.addEventListener('DOMContentLoaded', () => {
	const ALLOWED_DOMAIN = 'university.edu'; // placeholder for demo

	const signup = document.getElementById('signup-form');
	const login = document.getElementById('login-form');

	const users = JSON.parse(localStorage.getItem('ul_users') || '[]');

	function saveUsers() {
		localStorage.setItem('ul_users', JSON.stringify(users));
	}

	function toast(msg) { alert(msg); }

	signup?.addEventListener('submit', (e) => {
		e.preventDefault();
		const name = document.getElementById('name').value.trim();
		const email = document.getElementById('email').value.trim();
		const password = document.getElementById('password').value;

		if (!email.endsWith('@' + ALLOWED_DOMAIN)) {
			toast(`Please use your university email (@${ALLOWED_DOMAIN}).`);
			return;
		}
		if (users.some(u => u.email === email)) {
			toast('Email already registered.');
			return;
		}
		users.push({ name, email, password });
		saveUsers();
		toast('Account created. You can now login.');
		(e.target).reset();
	});

	login?.addEventListener('submit', (e) => {
		e.preventDefault();
		const email = document.getElementById('lemail').value.trim();
		const password = document.getElementById('lpassword').value;
		const user = users.find(u => u.email === email && u.password === password);
		if (!user) {
			toast('Invalid credentials');
			return;
		}
		localStorage.setItem('ul_current_user', JSON.stringify(user));
		toast('Logged in.');
		window.location.href = './index.html#home';
	});
});