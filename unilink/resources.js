document.addEventListener('DOMContentLoaded', () => {
	const list = document.getElementById('resource-list');
	if (!list) return;

	const q = document.getElementById('q');
	const type = document.getElementById('type');
	const action = document.getElementById('action');
	const applyBtn = document.getElementById('apply');

	const items = [
		{ type: 'Textbook', title: 'Calculus I (James Stewart)', action: 'Borrow', campus: 'Main Library Pickup' },
		{ type: 'Notes', title: 'Intro to Python (CSC101) — Week 1-6', action: 'Share PDF', campus: 'CS Dept' },
		{ type: 'Textbook', title: 'Organic Chemistry (Solomons)', action: 'Sell', campus: 'Chem Lab' },
		{ type: 'Notes', title: 'Linear Algebra (MTH201) — Problem Sets', action: 'Share PDF', campus: 'Math Dept' },
		{ type: 'Textbook', title: 'Microeconomics (Krugman)', action: 'Borrow', campus: 'Econs Dept' },
	];

	function render(rows) {
		list.innerHTML = '';
		if (!rows.length) {
			const empty = document.createElement('div');
			empty.className = 'feature-card';
			empty.innerHTML = '<p>No results. Try different filters.</p>';
			list.appendChild(empty);
			return;
		}
		rows.forEach(item => {
			const card = document.createElement('div');
			card.className = 'feature-card';
			card.innerHTML = `
				<h4>${item.type}</h4>
				<p><strong>${item.title}</strong></p>
				<p>${item.campus}</p>
				<button class="btn btn-primary btn-small">${item.action}</button>
			`;
			list.appendChild(card);
		});
	}

	function applyFilters() {
		const query = (q?.value || '').toLowerCase();
		const t = type?.value || '';
		const a = action?.value || '';
		const result = items.filter(it => {
			const matchesQuery = !query || it.title.toLowerCase().includes(query);
			const matchesType = !t || it.type === t;
			const matchesAction = !a || it.action === a;
			return matchesQuery && matchesType && matchesAction;
		});
		render(result);
	}

	applyBtn?.addEventListener('click', applyFilters);
	q?.addEventListener('keyup', (e) => { if (e.key === 'Enter') applyFilters(); });
	type?.addEventListener('change', applyFilters);
	action?.addEventListener('change', applyFilters);

	render(items);
});