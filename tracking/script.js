const STORAGE_KEY = 'resourceSharingRequests';

const initialRequests = [
  { id: 1, user: 'Aashish', item: 'Laptop', status: 'Pending', requestedOn: '04-06-2026', dueDate: '11-06-2026', time: '09:30' },
  { id: 2, user: 'Aashish', item: 'Projector', status: 'Approved', requestedOn: '01-06-2026', dueDate: '08-06-2026', time: '11:00' },
  { id: 3, user: 'Aashish', item: 'Power Bank', status: 'Returned', requestedOn: '28-05-2026', dueDate: '04-06-2026', time: '15:45' }
];

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function loadRequests() {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [...initialRequests];
}

function saveRequests(requests) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
}

function formatStatus(status) {
  const classes = {
    Pending: 'status-pending',
    Approved: 'status-approved',
    Returned: 'status-returned'
  };
  return `<span class="status-badge ${classes[status] || 'status-pending'}">${escapeHtml(status)}</span>`;
}

function renderRequests() {
  const rows = loadRequests();
  const tbody = document.getElementById('requestTable');
  const totalRequests = document.getElementById('totalRequests');

  if (!tbody) return;

  if (!rows.length) {
    tbody.innerHTML = '<tr><td colspan="6" class="empty-row">No requests available yet.</td></tr>';
  } else {
    tbody.innerHTML = rows.map(request => `
      <tr>
        <td>${escapeHtml(request.user)}</td>
        <td>${escapeHtml(request.item)}</td>
        <td>${formatStatus(request.status)}</td>
        <td>${escapeHtml(request.dueDate)}</td>
        <td>${escapeHtml(request.time)}</td>
        <td>
          ${request.status === 'Pending'
            ? `<button class="btn btn-success" onclick="approveRequest(${request.id})">Approve</button>`
            : request.status === 'Approved'
              ? `<button class="btn btn-primary" onclick="returnRequest(${request.id})">Return</button>`
              : '<span class="btn btn-neutral">Completed</span>'}
        </td>
      </tr>
    `).join('');
  }

  if (totalRequests) totalRequests.textContent = `${rows.length} request${rows.length === 1 ? '' : 's'}`;
}

function renderApprovals() {
  const rows = loadRequests().filter(request => request.status === 'Pending');
  const tbody = document.getElementById('approvalTable');
  const pendingCount = document.getElementById('pendingCount');

  if (!tbody) return;

  if (!rows.length) {
    tbody.innerHTML = '<tr><td colspan="5" class="empty-row">No pending approvals.</td></tr>';
  } else {
    tbody.innerHTML = rows.map(request => `
      <tr>
        <td>${escapeHtml(request.user)}</td>
        <td>${escapeHtml(request.item)}</td>
        <td>${formatStatus(request.status)}</td>
        <td>${escapeHtml(request.dueDate)}</td>
        <td>${escapeHtml(request.time)}</td>
        <td><button class="btn btn-success" onclick="approveRequest(${request.id})">Approve</button></td>
      </tr>
    `).join('');
  }

  if (pendingCount) pendingCount.textContent = `${rows.length} pending`;
}

function renderReturns() {
  const rows = loadRequests().filter(request => request.status === 'Approved' || request.status === 'Returned');
  const tbody = document.getElementById('returnTable');
  const approvedCount = document.getElementById('approvedCount');

  if (!tbody) return;

  if (!rows.length) {
    tbody.innerHTML = '<tr><td colspan="6" class="empty-row">No items being tracked.</td></tr>';
  } else {
    tbody.innerHTML = rows.map(request => `
      <tr>
        <td>${escapeHtml(request.user)}</td>
        <td>${escapeHtml(request.item)}</td>
        <td>${formatStatus(request.status)}</td>
        <td>${escapeHtml(request.dueDate)}</td>
        <td>${escapeHtml(request.time)}</td>
        <td>
          ${request.status === 'Approved'
            ? `<button class="btn btn-primary" onclick="returnRequest(${request.id})">Return</button>`
            : '<span class="btn btn-neutral">Completed</span>'}
        </td>
      </tr>
    `).join('');
  }

  if (approvedCount) approvedCount.textContent = `${rows.length} tracked`;
}

function renderHistory() {
  const rows = loadRequests().filter(request => request.status === 'Approved' || request.status === 'Returned');
  const tbody = document.getElementById('historyTable');

  if (!tbody) return;

  if (!rows.length) {
    tbody.innerHTML = '<tr><td colspan="5" class="empty-row">No history records yet.</td></tr>';
  } else {
    tbody.innerHTML = rows.map(request => `
      <tr>
        <td>${escapeHtml(request.user)}</td>
        <td>${escapeHtml(request.item)}</td>
        <td>${formatStatus(request.status)}</td>
        <td>${escapeHtml(request.dueDate)}</td>
        <td>${escapeHtml(request.time)}</td>
      </tr>
    `).join('');
  }
}

function showSection(sectionId) {
  document.querySelectorAll('.section').forEach(section => {
    section.classList.toggle('active-section', section.id === sectionId);
  });

  document.querySelectorAll('.tab-button').forEach(button => {
    button.classList.toggle('active', button.dataset.section === sectionId);
  });
}

function approveRequest(id) {
  if (!confirm('Approve this request?')) return;
  const requests = loadRequests().map(request => {
    if (request.id === id) {
      return { ...request, status: 'Approved' };
    }
    return request;
  });
  saveRequests(requests);
  renderAll();
}

function returnRequest(id) {
  if (!confirm('Mark this item as returned?')) return;
  const requests = loadRequests().map(request => {
    if (request.id === id) {
      return { ...request, status: 'Returned' };
    }
    return request;
  });
  saveRequests(requests);
  renderAll();
}

function addRequest(event) {
  event.preventDefault();

  const userInput = document.getElementById('requesterName');
  const itemInput = document.getElementById('requestItem');
  const daysInput = document.getElementById('requestDays');

  const user = userInput ? userInput.value.trim() : 'Guest';
  const item = itemInput ? itemInput.value.trim() : 'General Resource';
  const days = daysInput ? Number(daysInput.value) : 7;

  if (!user || !item || days < 1) return;

  const today = new Date();
  const dueDate = new Date(today);
  dueDate.setDate(today.getDate() + days);

  const requests = loadRequests();
  requests.unshift({
    id: Date.now(),
    user,
    item,
    status: 'Pending',
    requestedOn: today.toLocaleDateString(),
    dueDate: dueDate.toISOString().split('T')[0],
    time: today.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  });

  saveRequests(requests);
  renderAll();
  if (event.target.reset) event.target.reset();
}

function renderAll() {
  renderRequests();
  renderApprovals();
  renderReturns();
  renderHistory();
}

function initPage() {
  if (!localStorage.getItem(STORAGE_KEY)) {
    saveRequests(initialRequests);
  }

  document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', () => showSection(button.dataset.section));
  });

  renderAll();
  showSection('requestSection');
}

window.approveRequest = approveRequest;
window.returnRequest = returnRequest;

window.addEventListener('DOMContentLoaded', initPage);
