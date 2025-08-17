document.addEventListener('DOMContentLoaded', () => {
	const list = document.getElementById('projects-list');
	if (!list) return;

	const q = document.getElementById('q');
	const dept = document.getElementById('dept');
	const apply = document.getElementById('apply');

	const toggleNew = document.getElementById('toggle-new');
	const form = document.getElementById('new-form');
	const newTitle = document.getElementById('new-title');
	const newNeed = document.getElementById('new-need');
	const newDept = document.getElementById('new-dept');

	const items = [
		{ title: 'Solar IoT water monitoring', owner: 'Kofi (Mech Eng)', need: 'Firmware dev + data viz', dept: 'Interdisciplinary' },
		{ title: 'Campus note-sharing PWA', owner: 'Lindiwe (CS)', need: 'UI design + content moderators', dept: 'CS + Media' },
		{ title: 'Community health outreach', owner: 'Ada (Medicine)', need: 'Data analysis + field logistics', dept: 'Medicine + Stats' },
	];

	function render(rows) {
		list.innerHTML = '';
		if (!rows.length) {
			const empty = document.createElement('div');
			empty.className = 'feature-card';
			empty.innerHTML = '<p>No projects found.</p>';
			list.appendChild(empty);
			return;
		}
		rows.forEach(item => {
			const card = document.createElement('div');
			card.className = 'feature-card';
			card.innerHTML = `
				<h4>${item.title}</h4>
				<p><strong>Lead:</strong> ${item.owner}</p>
				<p><strong>Needs:</strong> ${item.need}</p>
				<p><strong>Depts:</strong> ${item.dept}</p>
				<button class="btn btn-primary btn-small" data-action="help">I can help</button>
			`;
			list.appendChild(card);
		});
	}

	function applyFilters() {
		const query = (q?.value || '').toLowerCase();
		const d = (dept?.value || '').toLowerCase();
		const result = items.filter(it => {
			const matchesQuery = !query || it.title.toLowerCase().includes(query) || it.need.toLowerCase().includes(query);
			const matchesDept = !d || it.dept.toLowerCase().includes(d);
			return matchesQuery && matchesDept;
		});
		render(result);
	}

	apply?.addEventListener('click', applyFilters);
	q?.addEventListener('keyup', (e) => { if (e.key === 'Enter') applyFilters(); });
	dept?.addEventListener('keyup', (e) => { if (e.key === 'Enter') applyFilters(); });

	toggleNew?.addEventListener('click', () => form?.classList.toggle('hidden'));

	form?.addEventListener('submit', (e) => {
		e.preventDefault();
		const user = JSON.parse(localStorage.getItem('ul_current_user') || 'null');
		if (!user) { alert('Please login to post.'); return; }
		const title = newTitle.value.trim();
		const need = newNeed.value.trim();
		const d = newDept.value.trim();
		if (!title || !need) return;
		items.unshift({ title, owner: user.name || user.email, need, dept: d || 'Interdisciplinary' });
		newTitle.value = '';
		newNeed.value = '';
		newDept.value = '';
		form.classList.add('hidden');
		applyFilters();
	});

	list.addEventListener('click', (e) => {
		const btn = e.target.closest('button[data-action="help"]');
		if (!btn) return;
		const user = JSON.parse(localStorage.getItem('ul_current_user') || 'null');
		if (!user) { alert('Please login to offer help.'); return; }
		alert('Your interest has been sent to the project lead (demo).');
	});

	render(items);
});