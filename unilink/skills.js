document.addEventListener('DOMContentLoaded', () => {
	const list = document.getElementById('skills-list');
	if (!list) return;

	const q = document.getElementById('q');
	const kind = document.getElementById('kind');
	const rating = document.getElementById('rating');
	const apply = document.getElementById('apply');

	const toggleNew = document.getElementById('toggle-new');
	const form = document.getElementById('new-form');
	const newKind = document.getElementById('new-kind');
	const newName = document.getElementById('new-name');
	const newRating = document.getElementById('new-rating');

	const items = [
		{ kind: 'Offer', name: 'Teach Python basics', by: 'Amina (CS)', rating: 4.8 },
		{ kind: 'Request', name: 'Essay writing help', by: 'John (Arts)', rating: null },
		{ kind: 'Offer', name: 'Electronics repair basics', by: 'Tunde (EEE)', rating: 4.3 },
	];

	function render(rows) {
		list.innerHTML = '';
		if (!rows.length) {
			const empty = document.createElement('div');
			empty.className = 'feature-card';
			empty.innerHTML = '<p>No results.</p>';
			list.appendChild(empty);
			return;
		}
		rows.forEach(item => {
			const card = document.createElement('div');
			card.className = 'feature-card';
			card.innerHTML = `
				<h4>${item.kind}</h4>
				<p><strong>${item.name}</strong></p>
				<p>${item.by}</p>
				<p>${item.rating ? `Rating: ${item.rating.toFixed(1)}/5` : 'Not rated yet'}</p>
				<button class="btn btn-primary btn-small" data-action="contact">Contact</button>
			`;
			list.appendChild(card);
		});
	}

	function applyFilters() {
		const query = (q?.value || '').toLowerCase();
		const k = kind?.value || '';
		const r = parseFloat(rating?.value || '0');
		const result = items.filter(it => {
			const matchesQuery = !query || it.name.toLowerCase().includes(query);
			const matchesKind = !k || it.kind === k;
			const numeric = typeof it.rating === 'number' ? it.rating : 0;
			const matchesRating = !r || numeric >= r;
			return matchesQuery && matchesKind && matchesRating;
		});
		render(result);
	}

	apply?.addEventListener('click', applyFilters);
	q?.addEventListener('keyup', (e) => { if (e.key === 'Enter') applyFilters(); });
	kind?.addEventListener('change', applyFilters);
	rating?.addEventListener('change', applyFilters);

	toggleNew?.addEventListener('click', () => {
		form?.classList.toggle('hidden');
	});

	form?.addEventListener('submit', (e) => {
		e.preventDefault();
		const user = JSON.parse(localStorage.getItem('ul_current_user') || 'null');
		if (!user) {
			alert('Please login to add a listing.');
			return;
		}
		const k = newKind.value;
		const n = newName.value.trim();
		const r = newRating.value ? parseFloat(newRating.value) : null;
		if (!n) return;
		items.unshift({ kind: k, name: n, by: user.name || user.email, rating: r });
		newName.value = '';
		newRating.value = '';
		form.classList.add('hidden');
		applyFilters();
	});

	list.addEventListener('click', (e) => {
		const btn = e.target.closest('button[data-action="contact"]');
		if (!btn) return;
		const user = JSON.parse(localStorage.getItem('ul_current_user') || 'null');
		if (!user) {
			alert('Please login to contact.');
			return;
		}
		alert('Contact request sent (demo).');
	});

	render(items);
});