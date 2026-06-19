/* ================================================================
   GroceryMS – Unified Core JS
   Includes State, Client-side Hash Router, UI rendering, and CRUD
   ================================================================ */

'use strict';

/* ── Authentication Helper ── */
const Auth = {
  check() {
    if (sessionStorage.getItem('groceryms_logged') !== 'true') {
      window.location.href = 'login.html';
    }
  },
  logout() {
    sessionStorage.removeItem('groceryms_logged');
    window.location.href = 'login.html';
  }
};

/* ── Theme Manager ── */
const ThemeManager = {
  init() {
    if (localStorage.getItem('theme') === 'light') {
      document.body.classList.add('light');
    }
    this.updateIcons();
  },
  toggle() {
    document.body.classList.toggle('light');
    localStorage.setItem('theme', document.body.classList.contains('light') ? 'light' : 'dark');
    this.updateIcons();
    // Re-render charts if on dashboard to apply color styles
    if (window.location.hash === '#dashboard' || !window.location.hash) {
      Router.renderView('dashboard');
    }
  },
  updateIcons() {
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      btn.textContent = document.body.classList.contains('light') ? '🌙' : '☀️';
      btn.title = document.body.classList.contains('light') ? 'Switch to Dark Mode' : 'Switch to Light Mode';
    });
  }
};

/* ── Toast Notifications ── */
const Toast = {
  container: null,
  init() {
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'toast-container';
      document.body.appendChild(this.container);
    }
  },
  show(message, type = 'success', duration = 3500) {
    this.init();
    const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.innerHTML = `
      <span class="toast-icon">${icons[type] || '📢'}</span>
      <span style="flex:1">${message}</span>
      <button class="toast-close">✕</button>
    `;
    t.querySelector('.toast-close').onclick = () => t.remove();
    this.container.appendChild(t);
    setTimeout(() => {
      t.style.opacity = '0';
      t.style.transform = 'translateX(120%)';
      t.style.transition = 'all 0.3s ease';
      setTimeout(() => t.remove(), 300);
    }, duration);
  }
};

/* ── Modal Controller ── */
const Modal = {
  open(id) {
    document.getElementById(id)?.classList.add('open');
  },
  close(id) {
    document.getElementById(id)?.classList.remove('open');
  },
  closeAll() {
    document.querySelectorAll('.modal-overlay.open').forEach(m => m.classList.remove('open'));
  }
};
document.addEventListener('keydown', e => { if (e.key === 'Escape') Modal.closeAll(); });
document.addEventListener('click', e => { if (e.target.classList.contains('modal-overlay')) Modal.closeAll(); });

/* ── Sidebar Mobile Controls ── */
const Sidebar = {
  toggle() {
    document.getElementById('sidebar')?.classList.toggle('open');
    document.getElementById('sidebarOverlay')?.classList.toggle('open');
  },
  close() {
    document.getElementById('sidebar')?.classList.remove('open');
    document.getElementById('sidebarOverlay')?.classList.remove('open');
  }
};

/* ── Notification Center ── */
const Notifications = {
  toggle() {
    document.getElementById('notificationsDropdown')?.classList.toggle('show');
  },
  close() {
    document.getElementById('notificationsDropdown')?.classList.remove('show');
  },
  init() {
    document.addEventListener('click', e => {
      const dropdown = document.getElementById('notificationsDropdown');
      const btn = document.getElementById('notificationBtn');
      if (dropdown && btn && !dropdown.contains(e.target) && !btn.contains(e.target)) {
        dropdown.classList.remove('show');
      }
    });
  }
};

/* ── Format Utilities ── */
const fmt = {
  currency: v => '₹' + Number(v).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
  date: v => v ? new Date(v).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—',
  datetime: v => v ? new Date(v).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—',
  shortDate: v => v ? new Date(v).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'
};

/* ── Data Layer Manager ── */
const DB = {
  _key: 'groceryms_data',
  defaults() {
    return {
      customers: [
        { id: 1, name: 'Aarav Sharma', email: 'aarav.sharma@gmail.com', phone: '9876543210', address: '12, MG Road, Bangalore, KA 560001', joined: '2026-01-10' },
        { id: 2, name: 'Priya Patel', email: 'priya.patel@yahoo.com', phone: '9812345678', address: '45, Anna Nagar, Chennai, TN 600040', joined: '2026-01-15' },
        { id: 3, name: 'Rohit Verma', email: 'rohit.verma@outlook.com', phone: '9923456789', address: '78, Connaught Place, Delhi 110001', joined: '2026-01-20' },
        { id: 4, name: 'Sneha Iyer', email: 'sneha.iyer@gmail.com', phone: '9734567890', address: '23, Koregaon Park, Pune, MH 411001', joined: '2026-02-01' },
        { id: 5, name: 'Karan Mehta', email: 'karan.mehta@gmail.com', phone: '9645678901', address: '56, Salt Lake, Kolkata, WB 700091', joined: '2026-02-05' },
        { id: 6, name: 'Anjali Singh', email: 'anjali.singh@rediffmail.com', phone: '9556789012', address: '89, Banjara Hills, Hyderabad, TS 500034', joined: '2026-02-10' },
        { id: 7, name: 'Vikram Nair', email: 'vikram.nair@gmail.com', phone: '9467890123', address: '34, Marine Drive, Mumbai, MH 400020', joined: '2026-02-15' },
        { id: 8, name: 'Divya Reddy', email: 'divya.reddy@gmail.com', phone: '9378901234', address: '67, Jubilee Hills, Hyderabad, TS 500033', joined: '2026-03-01' },
        { id: 9, name: 'Amit Kumar', email: 'amit.kumar@hotmail.com', phone: '9289012345', address: '11, Civil Lines, Jaipur, RJ 302006', joined: '2026-03-05' },
        { id: 10, name: 'Pooja Gupta', email: 'pooja.gupta@gmail.com', phone: '9190123456', address: '44, Aliganj, Lucknow, UP 226024', joined: '2026-03-10' },
        { id: 11, name: 'Rahul Joshi', email: 'rahul.joshi@gmail.com', phone: '9901234567', address: '77, Navrangpura, Ahmedabad, GJ 380009', joined: '2026-03-15' },
        { id: 12, name: 'Meera Krishnan', email: 'meera.krishnan@gmail.com', phone: '9812340987', address: '22, T Nagar, Chennai, TN 600017', joined: '2026-03-20' },
        { id: 13, name: 'Suresh Pillai', email: 'suresh.pillai@yahoo.com', phone: '9723451098', address: '55, Thrissur, Kerala 680001', joined: '2026-04-01' },
        { id: 14, name: 'Neha Agarwal', email: 'neha.agarwal@gmail.com', phone: '9634562109', address: '88, Sector 17, Chandigarh 160017', joined: '2026-04-05' },
        { id: 15, name: 'Arjun Bose', email: 'arjun.bose@gmail.com', phone: '9545673210', address: '33, Park Street, Kolkata, WB 700016', joined: '2026-04-10' },
        { id: 16, name: 'Lakshmi Rao', email: 'lakshmi.rao@gmail.com', phone: '9456784321', address: '66, Indiranagar, Bangalore, KA 560038', joined: '2026-04-15' },
        { id: 17, name: 'Sanjay Tiwari', email: 'sanjay.tiwari@outlook.com', phone: '9367895432', address: '99, Hazratganj, Lucknow, UP 226001', joined: '2026-04-20' },
        { id: 18, name: 'Ritu Malhotra', email: 'ritu.malhotra@gmail.com', phone: '9278906543', address: '12, Model Town, Delhi 110009', joined: '2026-05-01' },
        { id: 19, name: 'Deepak Jain', email: 'deepak.jain@gmail.com', phone: '9189017654', address: '45, Vastrapur, Ahmedabad, GJ 380015', joined: '2026-05-05' },
        { id: 20, name: 'Kavya Menon', email: 'kavya.menon@gmail.com', phone: '9090128765', address: '78, Kakkanad, Kochi, KL 682030', joined: '2026-05-10' }
      ],
      suppliers: [
        { id: 1, name: 'FreshFarm Agro Pvt Ltd', contact: '8012345678', email: 'contact@freshfarm.com', address: 'Industrial Area, Pune, MH 411019' },
        { id: 2, name: "Nature's Basket Supplies", contact: '8123456789', email: 'supply@naturesbasket.in', address: 'Sector 5, Noida, UP 201301' },
        { id: 3, name: 'Green Valley Organics', contact: '8234567890', email: 'info@greenvalley.co.in', address: 'Mysore Road, Bangalore, KA 560026' },
        { id: 4, name: 'Prime Foods Distribution', contact: '8345678901', email: 'orders@primefoods.com', address: 'Guindy, Chennai, TN 600032' },
        { id: 5, name: 'Sunrise Dairy Products', contact: '8456789012', email: 'sales@sunrisedairy.in', address: 'Anand, Gujarat 388001' },
        { id: 6, name: 'Golden Grain Traders', contact: '8567890123', email: 'trade@goldengrain.com', address: 'Mandi Gobindgarh, Punjab 147301' },
        { id: 7, name: 'Tropical Fruits Co.', contact: '8678901234', email: 'export@tropicalfruits.in', address: 'Ratnagiri, MH 415612' },
        { id: 8, name: 'Ocean Fresh Seafood', contact: '8789012345', email: 'fresh@oceanseafood.com', address: 'Kochi Port, Kerala 682009' },
        { id: 9, name: 'Himalayan Spice Hub', contact: '8890123456', email: 'spice@himalayanspice.in', address: 'Cochin, Kerala 682001' },
        { id: 10, name: 'Farm to Fork Logistics', contact: '8901234567', email: 'logistics@farmtofork.com', address: 'Bommasandra, Bangalore 560099' }
      ],
      products: [
        { id: 1, supplierId: 1, name: 'Organic Basmati Rice (5kg)', category: 'Grains & Cereals', price: 450, stock: 120, expiry: '2026-12-31' },
        { id: 2, supplierId: 6, name: 'Whole Wheat Atta (10kg)', category: 'Grains & Cereals', price: 380, stock: 90, expiry: '2026-09-30' },
        { id: 3, supplierId: 6, name: 'Yellow Moong Dal (1kg)', category: 'Pulses', price: 95, stock: 200, expiry: '2026-11-30' },
        { id: 4, supplierId: 10, name: 'Toor Dal (1kg)', category: 'Pulses', price: 110, stock: 18, expiry: '2026-11-30' },
        { id: 5, supplierId: 5, name: 'Full Cream Milk (1L)', category: 'Dairy', price: 62, stock: 300, expiry: '2026-06-25' },
        { id: 6, supplierId: 5, name: 'Amul Butter (500g)', category: 'Dairy', price: 275, stock: 150, expiry: '2026-08-31' },
        { id: 7, supplierId: 5, name: 'Paneer Fresh (200g)', category: 'Dairy', price: 85, stock: 8, expiry: '2026-06-22' },
        { id: 8, supplierId: 7, name: 'Alphonso Mangoes (1kg)', category: 'Fruits', price: 250, stock: 0, expiry: '2026-06-30' },
        { id: 9, supplierId: 7, name: 'Bananas (1 dozen)', category: 'Fruits', price: 45, stock: 250, expiry: '2026-06-20' },
        { id: 10, supplierId: 3, name: 'Fresh Spinach (500g)', category: 'Vegetables', price: 30, stock: 200, expiry: '2026-06-19' }
      ],
      orders: [
        { id: 1, customerId: 1, date: '2026-05-01T10:30:00', total: 1345, status: 'Delivered', items: [{ productId: 1, qty: 2, subtotal: 900 }, { productId: 5, qty: 3, subtotal: 186 }] },
        { id: 2, customerId: 3, date: '2026-05-03T11:15:00', total: 775, status: 'Delivered', items: [{ productId: 2, qty: 2, subtotal: 760 }] },
        { id: 3, customerId: 5, date: '2026-05-05T14:00:00', total: 1220, status: 'Delivered', items: [{ productId: 6, qty: 2, subtotal: 550 }] },
        { id: 4, customerId: 7, date: '2026-05-07T09:45:00', total: 590, status: 'Delivered', items: [{ productId: 5, qty: 4, subtotal: 248 }] },
        { id: 5, customerId: 2, date: '2026-05-10T16:20:00', total: 870, status: 'Shipped', items: [{ productId: 3, qty: 4, subtotal: 380 }] },
        { id: 6, customerId: 4, date: '2026-05-12T13:00:00', total: 1560, status: 'Shipped', items: [{ productId: 8, qty: 4, subtotal: 1000 }] },
        { id: 7, customerId: 6, date: '2026-05-15T10:00:00', total: 430, status: 'Processing', items: [{ productId: 10, qty: 5, subtotal: 150 }] },
        { id: 8, customerId: 8, date: '2026-05-17T15:30:00', total: 2100, status: 'Processing', items: [{ productId: 8, qty: 3, subtotal: 750 }] },
        { id: 9, customerId: 10, date: '2026-05-20T11:00:00', total: 685, status: 'Pending', items: [{ productId: 9, qty: 5, subtotal: 225 }] },
        { id: 10, customerId: 12, date: '2026-05-22T12:45:00', total: 1125, status: 'Delivered', items: [{ productId: 1, qty: 2, subtotal: 900 }] }
      ],
      payments: [
        { id: 1, orderId: 1, method: 'UPI', status: 'Completed', amount: 1345, date: '2026-05-01T10:35:00' },
        { id: 2, orderId: 2, method: 'Credit Card', status: 'Completed', amount: 775, date: '2026-05-03T11:20:00' },
        { id: 3, orderId: 3, method: 'Net Banking', status: 'Completed', amount: 1220, date: '2026-05-05T14:05:00' },
        { id: 4, orderId: 4, method: 'Cash', status: 'Completed', amount: 590, date: '2026-05-07T09:50:00' },
        { id: 5, orderId: 5, method: 'Debit Card', status: 'Completed', amount: 870, date: '2026-05-10T16:25:00' },
        { id: 6, orderId: 6, method: 'UPI', status: 'Completed', amount: 1560, date: '2026-05-12T13:05:00' },
        { id: 7, orderId: 7, method: 'Wallet', status: 'Pending', amount: 430, date: '2026-05-15T10:05:00' },
        { id: 8, orderId: 8, method: 'Credit Card', status: 'Completed', amount: 2100, date: '2026-05-17T15:35:00' },
        { id: 9, orderId: 9, method: 'UPI', status: 'Pending', amount: 685, date: '2026-05-20T11:05:00' },
        { id: 10, orderId: 10, method: 'Net Banking', status: 'Completed', amount: 1125, date: '2026-05-22T12:50:00' }
      ],
      deliveries: [
        { id: 1, orderId: 1, status: 'Delivered', date: '2026-05-03', address: '12, MG Road, Bangalore, KA 560001' },
        { id: 2, orderId: 2, status: 'Delivered', date: '2026-05-05', address: '78, Connaught Place, Delhi 110001' },
        { id: 3, orderId: 3, status: 'Delivered', date: '2026-05-07', address: '56, Salt Lake, Kolkata, WB 700091' },
        { id: 4, orderId: 4, status: 'Delivered', date: '2026-05-09', address: '34, Marine Drive, Mumbai, MH 400020' },
        { id: 5, orderId: 5, status: 'In Transit', date: '2026-06-19', address: '45, Anna Nagar, Chennai, TN 600040' },
        { id: 6, orderId: 6, status: 'Dispatched', date: '2026-06-20', address: '23, Koregaon Park, Pune, MH 411001' },
        { id: 7, orderId: 7, status: 'Pending', date: null, address: '89, Banjara Hills, Hyderabad, TS 500034' },
        { id: 8, orderId: 8, status: 'In Transit', date: '2026-06-19', address: '67, Jubilee Hills, Hyderabad, TS 500033' },
        { id: 9, orderId: 9, status: 'Pending', date: null, address: '44, Aliganj, Lucknow, UP 226024' },
        { id: 10, orderId: 10, status: 'Delivered', date: '2026-05-24', address: '22, T Nagar, Chennai, TN 600017' }
      ],
      inventory: [
        { id: 1, productId: 1, stockIn: 200, stockOut: 0, date: '2026-04-01T08:00:00', notes: 'Initial stock - Basmati Rice' },
        { id: 2, productId: 1, stockIn: 0, stockOut: 80, date: '2026-05-01T10:00:00', notes: 'Sales outflow' },
        { id: 3, productId: 2, stockIn: 150, stockOut: 0, date: '2026-04-01T08:00:00', notes: 'Initial stock - Wheat Atta' },
        { id: 4, productId: 2, stockIn: 0, stockOut: 60, date: '2026-05-05T11:00:00', notes: 'Sales outflow' },
        { id: 5, productId: 5, stockIn: 500, stockOut: 0, date: '2026-04-01T08:00:00', notes: 'Initial stock - Milk' },
        { id: 6, productId: 5, stockIn: 0, stockOut: 200, date: '2026-05-10T09:00:00', notes: 'Daily sales outflow' }
      ]
    };
  },
  load() {
    const saved = localStorage.getItem(this._key);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error('Error parsing storage data', e); }
    }
    const d = this.defaults();
    this.save(d);
    return d;
  },
  save(data) {
    localStorage.setItem(this._key, JSON.stringify(data));
  },
  get() {
    return this.load();
  },
  set(data) {
    this.save(data);
  },
  nextId(arr) {
    return arr.length ? Math.max(...arr.map(x => x.id)) + 1 : 1;
  }
};

/* ── Pagination Class ── */
class Paginator {
  constructor({ data, pageSize = 8, renderFn, containerId, controlsId }) {
    this.data = data;
    this.pageSize = pageSize;
    this.renderFn = renderFn;
    this.containerId = containerId;
    this.controlsId = controlsId;
    this.page = 1;
  }
  get totalPages() { return Math.max(1, Math.ceil(this.data.length / this.pageSize)); }
  get slice() {
    const start = (this.page - 1) * this.pageSize;
    return this.data.slice(start, start + this.pageSize);
  }
  render() {
    this.renderFn(this.slice, this.page, this.totalPages, this.data.length);
    this.renderControls();
  }
  goTo(p) {
    this.page = Math.max(1, Math.min(p, this.totalPages));
    this.render();
  }
  renderControls() {
    const el = document.getElementById(this.controlsId);
    if (!el) return;

    let html = `<button class="page-btn" onclick="window.currentPaginator.goTo(${this.page - 1})" ${this.page === 1 ? 'disabled' : ''}>‹</button>`;
    const range = this.pageRange();
    range.forEach(p => {
      if (p === '…') {
        html += `<span class="page-btn" style="cursor:default;border:none">…</span>`;
      } else {
        html += `<button class="page-btn ${p === this.page ? 'active' : ''}" onclick="window.currentPaginator.goTo(${p})">${p}</button>`;
      }
    });
    html += `<button class="page-btn" onclick="window.currentPaginator.goTo(${this.page + 1})" ${this.page === this.totalPages ? 'disabled' : ''}>›</button>`;
    el.innerHTML = html;
  }
  pageRange() {
    const t = this.totalPages, c = this.page, r = [];
    if (t <= 5) { for (let i = 1; i <= t; i++) r.push(i); return r; }
    r.push(1);
    if (c > 3) r.push('…');
    for (let i = Math.max(2, c - 1); i <= Math.min(t - 1, c + 1); i++) r.push(i);
    if (c < t - 2) r.push('…');
    r.push(t);
    return r;
  }
}

/* ── Status Badge Generator ── */
function statusBadge(status) {
  const map = {
    'Delivered': 'success', 'Completed': 'success', 'Adequate Stock': 'success', 'Completed Payment': 'success',
    'Shipped': 'info', 'In Transit': 'info', 'Dispatched': 'info', 'Medium Stock': 'info',
    'Processing': 'purple', 'Pending': 'warning', 'Low Stock': 'warning',
    'Cancelled': 'danger', 'Failed': 'danger', 'Out of Stock': 'danger', 'Refunded': 'gray'
  };
  const cls = map[status] || 'gray';
  return `<span class="badge ${cls}">${status}</span>`;
}

/* ── Hash Router ── */
const Router = {
  routes: {
    dashboard: renderDashboardView,
    customers: renderCustomersView,
    products: renderProductsView,
    suppliers: renderSuppliersView,
    inventory: renderInventoryView,
    orders: renderOrdersView,
    payments: renderPaymentsView,
    delivery: renderDeliveryView,
    reports: renderReportsView
  },
  init() {
    window.addEventListener('hashchange', () => this.handleRouting());
    this.handleRouting();
  },
  handleRouting() {
    Auth.check();
    Sidebar.close();
    const hash = window.location.hash.slice(1) || 'dashboard';
    const parts = hash.split('/');
    const route = parts[0];
    const param = parts[1] || null;

    // Set active link in sidebar
    document.querySelectorAll('.nav-item').forEach(el => {
      if (el.getAttribute('href') === `#${route}`) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });

    const renderer = this.routes[route];
    if (renderer) {
      renderer(param);
    } else {
      renderDashboardView();
    }
  },
  renderView(route, param = null) {
    const renderer = this.routes[route];
    if (renderer) renderer(param);
  }
};

/* ── Global Search Helper ── */
let lastQuery = '';
function setupGlobalSearch() {
  const inp = document.getElementById('globalSearch');
  if (!inp) return;
  inp.oninput = (e) => {
    const q = e.target.value.trim().toLowerCase();
    lastQuery = q;
    // Dispatch to page search if on list views
    const hash = window.location.hash.slice(1) || 'dashboard';
    const pageSearchInp = document.getElementById('searchInput');
    if (pageSearchInp) {
      pageSearchInp.value = e.target.value;
      pageSearchInp.dispatchEvent(new Event('input'));
    }
  };
}

/* ================================================================
   VIEW RENDERERS & CONTROLLERS
   ================================================================ */

// Clean global charts reference
window.currentCharts = [];
function destroyCharts() {
  if (window.currentCharts && window.currentCharts.length > 0) {
    window.currentCharts.forEach(c => { try { c.destroy(); } catch (e) { } });
    window.currentCharts = [];
  }
}

/* 1. Dashboard View */
function renderDashboardView() {
  destroyCharts();
  document.getElementById('pageTitle').innerHTML = '📊 Store Dashboard';
  const data = DB.get();

  const totalRevenue = data.payments.filter(p => p.status === 'Completed').reduce((sum, p) => sum + p.amount, 0);
  const totalOrders = data.orders.length;
  const totalCustomers = data.customers.length;
  const lowStock = data.products.filter(p => p.stock <= 30).length;

  const html = `
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon green">💰</div>
        <div class="stat-body">
          <div class="stat-label">Total Revenue</div>
          <div class="stat-value">${fmt.currency(totalRevenue)}</div>
          <div class="stat-change up">↑ 12% vs last month</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon blue">🛒</div>
        <div class="stat-body">
          <div class="stat-label">Total Orders</div>
          <div class="stat-value">${totalOrders}</div>
          <div class="stat-change up">↑ 4 new today</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon purple">👥</div>
        <div class="stat-body">
          <div class="stat-label">Customers</div>
          <div class="stat-value">${totalCustomers}</div>
          <div class="stat-change up">↑ 5 joined this week</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon red">⚠️</div>
        <div class="stat-body">
          <div class="stat-label">Low Stock Items</div>
          <div class="stat-value">${lowStock}</div>
          <div class="stat-change down">Action required</div>
        </div>
      </div>
    </div>

    <div class="grid-2">
      <div class="card">
        <div class="card-header"><span class="card-title">📈 Monthly Revenue</span></div>
        <div class="chart-wrap"><canvas id="revenueChart" class="chart-canvas" height="220"></canvas></div>
      </div>
      <div class="card">
        <div class="card-header"><span class="card-title">🍕 Sales by Category</span></div>
        <div class="chart-wrap"><canvas id="categoryChart" class="chart-canvas" height="220"></canvas></div>
      </div>
    </div>

    <div class="grid-2">
      <div class="card">
        <div class="card-header">
          <span class="card-title">🛒 Recent Orders</span>
          <a href="#orders" class="btn btn-sm btn-secondary">View All</a>
        </div>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Order ID</th><th>Customer</th><th>Total</th><th>Status</th></tr>
            </thead>
            <tbody id="recentOrdersBody"></tbody>
          </table>
        </div>
      </div>
      <div class="card">
        <div class="card-header">
          <span class="card-title">⚠️ Low Stock Alert</span>
          <a href="#products" class="btn btn-sm btn-secondary">View All</a>
        </div>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Product</th><th>Category</th><th>Stock</th><th>Status</th></tr>
            </thead>
            <tbody id="lowStockBody"></tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  document.getElementById('viewport').innerHTML = html;

  // Render recent orders lists
  const recentOrders = [...data.orders].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
  document.getElementById('recentOrdersBody').innerHTML = recentOrders.map(o => {
    const cust = data.customers.find(c => c.id === o.customerId);
    return `
      <tr>
        <td><strong>#${o.id}</strong></td>
        <td>${cust?.name || 'Guest'}</td>
        <td>${fmt.currency(o.total)}</td>
        <td>${statusBadge(o.status)}</td>
      </tr>
    `;
  }).join('') || '<tr><td colspan="4" class="empty-state">No orders placed</td></tr>';

  // Render low stock list
  const lowStockProducts = data.products.filter(p => p.stock <= 50).sort((a, b) => a.stock - b.stock).slice(0, 5);
  document.getElementById('lowStockBody').innerHTML = lowStockProducts.map(p => {
    return `
      <tr>
        <td><strong>${p.name}</strong></td>
        <td><span class="badge info">${p.category}</span></td>
        <td><strong style="color:var(--danger)">${p.stock}</strong></td>
        <td>${statusBadge(p.stock === 0 ? 'Out of Stock' : 'Low Stock')}</td>
      </tr>
    `;
  }).join('') || '<tr><td colspan="4" class="empty-state">All products fully stocked</td></tr>';

  // Render Charts
  setTimeout(() => {
    try {
      const isDark = !document.body.classList.contains('light');
      const textColor = isDark ? '#94a3b8' : '#64748b';
      const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)';

      // Revenue Bar Chart
      const revCtx = document.getElementById('revenueChart');
      if (revCtx) {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        const revenueValues = [35000, 42000, 38000, 48000, 56000, 64200];
        
        // Sum from mock database orders
        data.orders.forEach(o => {
          const m = new Date(o.date).getMonth();
          if (m >= 0 && m < 6) {
            revenueValues[m] += o.total;
          }
        });

        const revChart = new Chart(revCtx, {
          type: 'bar',
          data: {
            labels: months,
            datasets: [{
              label: 'Sales (₹)',
              data: revenueValues,
              backgroundColor: '#2874f0',
              borderColor: '#1e5ecb',
              borderWidth: 1,
              borderRadius: 8
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              x: { grid: { color: gridColor }, ticks: { color: textColor } },
              y: { grid: { color: gridColor }, ticks: { color: textColor, callback: v => '₹' + v.toLocaleString() } }
            }
          }
        });
        window.currentCharts.push(revChart);
      }

      // Doughnut chart (Products Category)
      const catCtx = document.getElementById('categoryChart');
      if (catCtx) {
        const catMap = {};
        data.products.forEach(p => {
          catMap[p.category] = (catMap[p.category] || 0) + 1;
        });

        const catChart = new Chart(catCtx, {
          type: 'doughnut',
          data: {
            labels: Object.keys(catMap),
            datasets: [{
              data: Object.values(catMap),
              backgroundColor: ['#2874f0', '#ffd500', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#3b82f6', '#ec4899'],
              borderWidth: 0
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'right',
                labels: { color: textColor, boxWidth: 12, font: { size: 11 } }
              }
            },
            cutout: '70%'
          }
        });
        window.currentCharts.push(catChart);
      }
    } catch (e) {
      console.error('Error rendering dashboard charts:', e);
    }
  }, 100);
}

/* 2. Customers View */
let customerEditId = null;
function renderCustomersView() {
  document.getElementById('pageTitle').innerHTML = '👥 Customer Directory';
  const data = DB.get();

  const activeCount = new Set(data.orders.map(o => o.customerId)).size;

  const html = `
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon blue">👥</div>
        <div class="stat-body">
          <div class="stat-label">Total Customers</div>
          <div class="stat-value" id="custTotalCount">${data.customers.length}</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon green">🛒</div>
        <div class="stat-body">
          <div class="stat-label">Active Buyers</div>
          <div class="stat-value">${activeCount}</div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <span class="card-title">👥 Customer Records</span>
        <button class="btn btn-primary" onclick="openAddCustomerModal()">➕ Add Customer</button>
      </div>
      <div class="toolbar">
        <div class="search-input">
          <span>🔍</span>
          <input type="text" id="searchInput" placeholder="Search by name, email, phone, address..." value="${lastQuery}">
        </div>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr><th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Address</th><th>Joined Date</th><th>Actions</th></tr>
          </thead>
          <tbody id="customersTableBody"></tbody>
        </table>
      </div>
      <div class="pagination" id="customersPagination"></div>
    </div>
  `;

  document.getElementById('viewport').innerHTML = html;

  // Search filter implementation
  const searchInp = document.getElementById('searchInput');
  const filterList = () => {
    const q = searchInp.value.trim().toLowerCase();
    const filtered = data.customers.filter(c => 
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q) ||
      c.address.toLowerCase().includes(q)
    );
    
    const paginator = new Paginator({
      data: filtered,
      pageSize: 8,
      containerId: 'customersTableBody',
      controlsId: 'customersPagination',
      renderFn: (rows) => {
        document.getElementById('customersTableBody').innerHTML = rows.map(c => `
          <tr>
            <td>${c.id}</td>
            <td><strong>${c.name}</strong></td>
            <td><a href="mailto:${c.email}" style="color:var(--primary);text-decoration:none">${c.email}</a></td>
            <td>${c.phone}</td>
            <td style="max-width:200px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis" title="${c.address}">${c.address}</td>
            <td>${fmt.date(c.joined)}</td>
            <td>
              <button class="btn-icon-text" onclick="openEditCustomerModal(${c.id})" title="Edit">✏️</button>
              <button class="btn-icon-text" onclick="openDeleteCustomerConfirm(${c.id})" style="color:var(--danger)" title="Delete">🗑️</button>
            </td>
          </tr>
        `).join('') || '<tr><td colspan="7" class="empty-state">No customers match search query</td></tr>';
      }
    });
    window.currentPaginator = paginator;
    paginator.render();
  };

  searchInp.oninput = filterList;
  filterList();
}

// Customer Form Operations
window.openAddCustomerModal = function() {
  customerEditId = null;
  document.getElementById('custModalTitle').textContent = '➕ Add Customer';
  ['cust_name', 'cust_email', 'cust_phone', 'cust_address'].forEach(id => {
    document.getElementById(id).value = '';
  });
  Modal.open('customerModal');
};

window.openEditCustomerModal = function(id) {
  const db = DB.get();
  const cust = db.customers.find(c => c.id === id);
  if (!cust) return;

  customerEditId = id;
  document.getElementById('custModalTitle').textContent = '✏️ Edit Customer';
  document.getElementById('cust_name').value = cust.name;
  document.getElementById('cust_email').value = cust.email;
  document.getElementById('cust_phone').value = cust.phone;
  document.getElementById('cust_address').value = cust.address;
  Modal.open('customerModal');
};

window.saveCustomer = function() {
  const name = document.getElementById('cust_name').value.trim();
  const email = document.getElementById('cust_email').value.trim();
  const phone = document.getElementById('cust_phone').value.trim();
  const address = document.getElementById('cust_address').value.trim();

  if (!name || !email || !phone || !address) {
    Toast.show('Please fill in all customer details.', 'warning');
    return;
  }
  if (!email.includes('@')) {
    Toast.show('Please enter a valid email address.', 'warning');
    return;
  }

  const db = DB.get();
  if (customerEditId) {
    const idx = db.customers.findIndex(c => c.id === customerEditId);
    if (idx !== -1) {
      db.customers[idx] = { ...db.customers[idx], name, email, phone, address };
      Toast.show('Customer updated successfully.', 'success');
    }
  } else {
    const newCust = {
      id: DB.nextId(db.customers),
      name, email, phone, address,
      joined: new Date().toISOString().split('T')[0]
    };
    db.customers.push(newCust);
    Toast.show('Customer added successfully.', 'success');
  }

  DB.set(db);
  Modal.close('customerModal');
  renderCustomersView();
};

let customerDeleteId = null;
window.openDeleteCustomerConfirm = function(id) {
  customerDeleteId = id;
  document.getElementById('confirmDeleteType').textContent = 'Customer';
  document.getElementById('deleteConfirmAction').setAttribute('onclick', 'confirmDeleteCustomer()');
  Modal.open('deleteModal');
};

window.confirmDeleteCustomer = function() {
  const db = DB.get();
  db.customers = db.customers.filter(c => c.id !== customerDeleteId);
  DB.set(db);
  Modal.close('deleteModal');
  Toast.show('Customer deleted successfully.', 'info');
  renderCustomersView();
};

/* 3. Products View */
let productEditId = null;
function renderProductsView() {
  document.getElementById('pageTitle').innerHTML = '🛍️ Product Catalog';
  const data = DB.get();

  const totalValue = data.products.reduce((s, p) => s + p.price * p.stock, 0);
  const outOfStock = data.products.filter(p => p.stock === 0).length;

  const html = `
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon blue">🛍️</div>
        <div class="stat-body">
          <div class="stat-label">Total SKUs</div>
          <div class="stat-value">${data.products.length}</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon green">💰</div>
        <div class="stat-body">
          <div class="stat-label">Inventory Value</div>
          <div class="stat-value">${fmt.currency(totalValue)}</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon red">❌</div>
        <div class="stat-body">
          <div class="stat-label">Out of Stock</div>
          <div class="stat-value">${outOfStock}</div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <span class="card-title">🛍️ Product Catalog</span>
        <button class="btn btn-primary" onclick="openAddProductModal()">➕ Add Product</button>
      </div>
      <div class="toolbar">
        <div class="search-input">
          <span>🔍</span>
          <input type="text" id="searchInput" placeholder="Search by product name, category..." value="${lastQuery}">
        </div>
        <select class="form-control" style="width:auto" id="catFilter">
          <option value="">All Categories</option>
          <option>Grains & Cereals</option>
          <option>Pulses</option>
          <option>Dairy</option>
          <option>Fruits</option>
          <option>Vegetables</option>
          <option>Spices</option>
          <option>Bakery</option>
          <option>Oils & Fats</option>
          <option>Condiments</option>
          <option>Health Foods</option>
          <option>Seafood</option>
          <option>Snacks</option>
          <option>Beverages</option>
        </select>
        <select class="form-control" style="width:auto" id="stockFilter">
          <option value="">All Stock Levels</option>
          <option value="out">Out of Stock</option>
          <option value="low">Low Stock (≤30)</option>
          <option value="medium">Medium (31-100)</option>
          <option value="high">Adequate (>100)</option>
        </select>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr><th>SKU</th><th>Product Name</th><th>Category</th><th>Supplier</th><th>Price</th><th>Stock</th><th>Expiry</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody id="productsTableBody"></tbody>
        </table>
      </div>
      <div class="pagination" id="productsPagination"></div>
    </div>
  `;

  document.getElementById('viewport').innerHTML = html;

  // Setup supplier dropdown inside edit modal
  const supDropdown = document.getElementById('prod_supplier');
  if (supDropdown) {
    supDropdown.innerHTML = data.suppliers.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
  }

  // Filter implementation
  const searchInp = document.getElementById('searchInput');
  const catFilter = document.getElementById('catFilter');
  const stockFilter = document.getElementById('stockFilter');

  const filterList = () => {
    const q = searchInp.value.trim().toLowerCase();
    const cat = catFilter.value;
    const stk = stockFilter.value;

    const filtered = data.products.filter(p => {
      const matchSearch = !q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
      const matchCat = !cat || p.category === cat;
      const matchStk = !stk || (
        stk === 'out' && p.stock === 0 ||
        stk === 'low' && p.stock > 0 && p.stock <= 30 ||
        stk === 'medium' && p.stock > 30 && p.stock <= 100 ||
        stk === 'high' && p.stock > 100
      );
      return matchSearch && matchCat && matchStk;
    });

    const paginator = new Paginator({
      data: filtered,
      pageSize: 8,
      containerId: 'productsTableBody',
      controlsId: 'productsPagination',
      renderFn: (rows) => {
        document.getElementById('productsTableBody').innerHTML = rows.map(p => {
          const sup = data.suppliers.find(s => s.id === p.supplierId);
          const status = p.stock === 0 ? 'Out of Stock' : p.stock <= 30 ? 'Low Stock' : p.stock <= 100 ? 'Medium Stock' : 'Adequate Stock';
          const isExpired = p.expiry && new Date(p.expiry) < new Date();
          const isNearExpiry = p.expiry && !isExpired && new Date(p.expiry) < new Date(Date.now() + 30 * 86400000);

          return `
            <tr>
              <td>${p.id}</td>
              <td><strong>${p.name}</strong></td>
              <td><span class="badge info">${p.category}</span></td>
              <td style="font-size:0.8rem">${sup?.name || '—'}</td>
              <td>${fmt.currency(p.price)}</td>
              <td>
                <strong style="color: ${p.stock <= 30 ? 'var(--danger)' : p.stock <= 100 ? 'var(--warning)' : 'var(--success)'}">
                  ${p.stock}
                </strong>
              </td>
              <td>
                <span style="color: ${isExpired ? 'var(--danger)' : isNearExpiry ? 'var(--warning)' : 'inherit'}">
                  ${fmt.shortDate(p.expiry)} ${isExpired ? '⚠️' : ''}
                </span>
              </td>
              <td>${statusBadge(status)}</td>
              <td>
                <button class="btn-icon-text" onclick="openEditProductModal(${p.id})" title="Edit">✏️</button>
                <button class="btn-icon-text" onclick="openDeleteProductConfirm(${p.id})" style="color:var(--danger)" title="Delete">🗑️</button>
              </td>
            </tr>
          `;
        }).join('') || '<tr><td colspan="9" class="empty-state">No products found matching criteria</td></tr>';
      }
    });
    window.currentPaginator = paginator;
    paginator.render();
  };

  searchInp.oninput = filterList;
  catFilter.onchange = filterList;
  stockFilter.onchange = filterList;
  filterList();
}

window.openAddProductModal = function() {
  productEditId = null;
  document.getElementById('prodModalTitle').textContent = '➕ Add Product';
  ['prod_name', 'prod_price', 'prod_stock', 'prod_expiry'].forEach(id => {
    document.getElementById(id).value = '';
  });
  Modal.open('productModal');
};

window.openEditProductModal = function(id) {
  const db = DB.get();
  const prod = db.products.find(p => p.id === id);
  if (!prod) return;

  productEditId = id;
  document.getElementById('prodModalTitle').textContent = '✏️ Edit Product';
  document.getElementById('prod_name').value = prod.name;
  document.getElementById('prod_category').value = prod.category;
  document.getElementById('prod_supplier').value = prod.supplierId;
  document.getElementById('prod_price').value = prod.price;
  document.getElementById('prod_stock').value = prod.stock;
  document.getElementById('prod_expiry').value = prod.expiry || '';
  Modal.open('productModal');
};

window.saveProduct = function() {
  const name = document.getElementById('prod_name').value.trim();
  const category = document.getElementById('prod_category').value;
  const supplierId = parseInt(document.getElementById('prod_supplier').value);
  const price = parseFloat(document.getElementById('prod_price').value);
  const stock = parseInt(document.getElementById('prod_stock').value);
  const expiry = document.getElementById('prod_expiry').value;

  if (!name || isNaN(price) || isNaN(stock)) {
    Toast.show('Please fill in product name, price, and stock levels.', 'warning');
    return;
  }

  const db = DB.get();
  if (productEditId) {
    const idx = db.products.findIndex(p => p.id === productEditId);
    if (idx !== -1) {
      db.products[idx] = { ...db.products[idx], name, category, supplierId, price, stock, expiry };
      Toast.show('Product updated successfully.', 'success');
    }
  } else {
    const newProd = {
      id: DB.nextId(db.products),
      supplierId, name, category, price, stock, expiry
    };
    db.products.push(newProd);
    Toast.show('Product added to catalog.', 'success');
  }

  DB.set(db);
  Modal.close('productModal');
  renderProductsView();
};

let productDeleteId = null;
window.openDeleteProductConfirm = function(id) {
  productDeleteId = id;
  document.getElementById('confirmDeleteType').textContent = 'Product';
  document.getElementById('deleteConfirmAction').setAttribute('onclick', 'confirmDeleteProduct()');
  Modal.open('deleteModal');
};

window.confirmDeleteProduct = function() {
  const db = DB.get();
  db.products = db.products.filter(p => p.id !== productDeleteId);
  DB.set(db);
  Modal.close('deleteModal');
  Toast.show('Product deleted from inventory.', 'info');
  renderProductsView();
};

/* 4. Suppliers View */
let supplierEditId = null;
function renderSuppliersView() {
  document.getElementById('pageTitle').innerHTML = '🏭 Suppliers Management';
  const data = DB.get();

  const activeCount = new Set(data.products.map(p => p.supplierId)).size;

  const html = `
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon blue">🏭</div>
        <div class="stat-body">
          <div class="stat-label">Total Suppliers</div>
          <div class="stat-value">${data.suppliers.length}</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon green">✅</div>
        <div class="stat-body">
          <div class="stat-label">Active Suppliers</div>
          <div class="stat-value">${activeCount}</div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <span class="card-title">🏭 Suppliers List</span>
        <button class="btn btn-primary" onclick="openAddSupplierModal()">➕ Add Supplier</button>
      </div>
      <div class="toolbar">
        <div class="search-input">
          <span>🔍</span>
          <input type="text" id="searchInput" placeholder="Search by supplier name, contact, email..." value="${lastQuery}">
        </div>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr><th>ID</th><th>Supplier Name</th><th>Contact</th><th>Email</th><th>Address</th><th>SKUs Supplied</th><th>Actions</th></tr>
          </thead>
          <tbody id="suppliersTableBody"></tbody>
        </table>
      </div>
      <div class="pagination" id="suppliersPagination"></div>
    </div>
  `;

  document.getElementById('viewport').innerHTML = html;

  const searchInp = document.getElementById('searchInput');
  const filterList = () => {
    const q = searchInp.value.trim().toLowerCase();
    const filtered = data.suppliers.filter(s => 
      s.name.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.contact.toLowerCase().includes(q)
    );

    const paginator = new Paginator({
      data: filtered,
      pageSize: 8,
      containerId: 'suppliersTableBody',
      controlsId: 'suppliersPagination',
      renderFn: (rows) => {
        document.getElementById('suppliersTableBody').innerHTML = rows.map(s => {
          const prodCount = data.products.filter(p => p.supplierId === s.id).length;
          return `
            <tr>
              <td>${s.id}</td>
              <td><strong>${s.name}</strong></td>
              <td>${s.contact}</td>
              <td><a href="mailto:${s.email}" style="color:var(--primary);text-decoration:none">${s.email}</a></td>
              <td style="max-width:180px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis" title="${s.address}">${s.address}</td>
              <td><span class="badge info">${prodCount} items</span></td>
              <td>
                <button class="btn-icon-text" onclick="openEditSupplierModal(${s.id})" title="Edit">✏️</button>
                <button class="btn-icon-text" onclick="openDeleteSupplierConfirm(${s.id})" style="color:var(--danger)" title="Delete">🗑️</button>
              </td>
            </tr>
          `;
        }).join('') || '<tr><td colspan="7" class="empty-state">No suppliers found</td></tr>';
      }
    });
    window.currentPaginator = paginator;
    paginator.render();
  };

  searchInp.oninput = filterList;
  filterList();
}

window.openAddSupplierModal = function() {
  supplierEditId = null;
  document.getElementById('supModalTitle').textContent = '➕ Add Supplier';
  ['sup_name', 'sup_contact', 'sup_email', 'sup_address'].forEach(id => {
    document.getElementById(id).value = '';
  });
  Modal.open('supplierModal');
};

window.openEditSupplierModal = function(id) {
  const db = DB.get();
  const sup = db.suppliers.find(s => s.id === id);
  if (!sup) return;

  supplierEditId = id;
  document.getElementById('supModalTitle').textContent = '✏️ Edit Supplier';
  document.getElementById('sup_name').value = sup.name;
  document.getElementById('sup_contact').value = sup.contact;
  document.getElementById('sup_email').value = sup.email;
  document.getElementById('sup_address').value = sup.address;
  Modal.open('supplierModal');
};

window.saveSupplier = function() {
  const name = document.getElementById('sup_name').value.trim();
  const contact = document.getElementById('sup_contact').value.trim();
  const email = document.getElementById('sup_email').value.trim();
  const address = document.getElementById('sup_address').value.trim();

  if (!name || !contact || !email || !address) {
    Toast.show('Please complete all supplier details.', 'warning');
    return;
  }

  const db = DB.get();
  if (supplierEditId) {
    const idx = db.suppliers.findIndex(s => s.id === supplierEditId);
    if (idx !== -1) {
      db.suppliers[idx] = { ...db.suppliers[idx], name, contact, email, address };
      Toast.show('Supplier details updated successfully.', 'success');
    }
  } else {
    const newSup = {
      id: DB.nextId(db.suppliers),
      name, contact, email, address
    };
    db.suppliers.push(newSup);
    Toast.show('New supplier added successfully.', 'success');
  }

  DB.set(db);
  Modal.close('supplierModal');
  renderSuppliersView();
};

let supplierDeleteId = null;
window.openDeleteSupplierConfirm = function(id) {
  supplierDeleteId = id;
  document.getElementById('confirmDeleteType').textContent = 'Supplier';
  document.getElementById('deleteConfirmAction').setAttribute('onclick', 'confirmDeleteSupplier()');
  Modal.open('deleteModal');
};

window.confirmDeleteSupplier = function() {
  const db = DB.get();
  db.suppliers = db.suppliers.filter(s => s.id !== supplierDeleteId);
  DB.set(db);
  Modal.close('deleteModal');
  Toast.show('Supplier deleted.', 'info');
  renderSuppliersView();
};

/* 5. Inventory Log View */
function renderInventoryView() {
  document.getElementById('pageTitle').innerHTML = '📦 Inventory Stock Logs';
  const data = DB.get();

  const totalStock = data.products.reduce((s, p) => s + p.stock, 0);

  const html = `
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon blue">📦</div>
        <div class="stat-body">
          <div class="stat-label">Total Stock Quantity</div>
          <div class="stat-value">${totalStock} units</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon orange">🔄</div>
        <div class="stat-body">
          <div class="stat-label">Movement Logs</div>
          <div class="stat-value">${data.inventory.length} trans</div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <span class="card-title">📦 Stock Movement Log</span>
        <button class="btn btn-primary" onclick="openRestockModal()">🔄 Quick Restock</button>
      </div>
      <div class="toolbar">
        <div class="search-input">
          <span>🔍</span>
          <input type="text" id="searchInput" placeholder="Search logs by description, notes..." value="${lastQuery}">
        </div>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr><th>Log ID</th><th>Product</th><th>Stock In</th><th>Stock Out</th><th>Log Date</th><th>Notes</th></tr>
          </thead>
          <tbody id="inventoryTableBody"></tbody>
        </table>
      </div>
      <div class="pagination" id="inventoryPagination"></div>
    </div>
  `;

  document.getElementById('viewport').innerHTML = html;

  // Populate product options in Restock dropdown
  const prodSelect = document.getElementById('restock_prod');
  if (prodSelect) {
    prodSelect.innerHTML = data.products.map(p => `<option value="${p.id}">${p.name} (Stock: ${p.stock})</option>`).join('');
  }

  const searchInp = document.getElementById('searchInput');
  const filterList = () => {
    const q = searchInp.value.trim().toLowerCase();
    const filtered = data.inventory.filter(i => {
      const p = data.products.find(x => x.id === i.productId);
      return (
        i.notes.toLowerCase().includes(q) ||
        (p && p.name.toLowerCase().includes(q))
      );
    }).reverse(); // Latest logs first

    const paginator = new Paginator({
      data: filtered,
      pageSize: 8,
      containerId: 'inventoryTableBody',
      controlsId: 'inventoryPagination',
      renderFn: (rows) => {
        document.getElementById('inventoryTableBody').innerHTML = rows.map(i => {
          const p = data.products.find(x => x.id === i.productId);
          return `
            <tr>
              <td>#${i.id}</td>
              <td><strong>${p?.name || 'Deleted Product'}</strong></td>
              <td><span style="color: ${i.stockIn > 0 ? 'var(--success)' : 'inherit'}">${i.stockIn > 0 ? '+' + i.stockIn : '—'}</span></td>
              <td><span style="color: ${i.stockOut > 0 ? 'var(--danger)' : 'inherit'}">${i.stockOut > 0 ? '-' + i.stockOut : '—'}</span></td>
              <td>${fmt.datetime(i.date)}</td>
              <td><span class="badge gray" style="text-transform:none">${i.notes}</span></td>
            </tr>
          `;
        }).join('') || '<tr><td colspan="6" class="empty-state">No stock movements logged</td></tr>';
      }
    });
    window.currentPaginator = paginator;
    paginator.render();
  };

  searchInp.oninput = filterList;
  filterList();
}

window.openRestockModal = function() {
  document.getElementById('restock_qty').value = '';
  document.getElementById('restock_notes').value = 'Manual stock arrival';
  Modal.open('restockModal');
};

window.saveRestock = function() {
  const productId = parseInt(document.getElementById('restock_prod').value);
  const qty = parseInt(document.getElementById('restock_qty').value);
  const notes = document.getElementById('restock_notes').value.trim();

  if (isNaN(qty) || qty <= 0) {
    Toast.show('Please enter a valid stock quantity.', 'warning');
    return;
  }

  const db = DB.get();
  const prod = db.products.find(p => p.id === productId);
  if (!prod) return;

  // Add stock & save
  prod.stock += qty;

  const newLog = {
    id: DB.nextId(db.inventory),
    productId,
    stockIn: qty,
    stockOut: 0,
    date: new Date().toISOString(),
    notes: notes || 'Product restocked'
  };
  db.inventory.push(newLog);

  DB.set(db);
  Modal.close('restockModal');
  Toast.show(`Successfully restocked ${qty} units of ${prod.name}.`, 'success');
  renderInventoryView();
};

/* 6. Orders View */
function renderOrdersView() {
  document.getElementById('pageTitle').innerHTML = '🛒 Order Management';
  const data = DB.get();

  const totalValue = data.orders.reduce((s, o) => s + o.total, 0);

  const html = `
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon blue">🛒</div>
        <div class="stat-body">
          <div class="stat-label">Total Orders</div>
          <div class="stat-value">${data.orders.length}</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon green">💰</div>
        <div class="stat-body">
          <div class="stat-label">Order Volume</div>
          <div class="stat-value">${fmt.currency(totalValue)}</div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header"><span class="card-title">🛒 Customer Orders</span></div>
      <div class="toolbar">
        <div class="search-input">
          <span>🔍</span>
          <input type="text" id="searchInput" placeholder="Search orders by customer or status..." value="${lastQuery}">
        </div>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr><th>Order ID</th><th>Customer Name</th><th>Order Date</th><th>Amount</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody id="ordersTableBody"></tbody>
        </table>
      </div>
      <div class="pagination" id="ordersPagination"></div>
    </div>
  `;

  document.getElementById('viewport').innerHTML = html;

  const searchInp = document.getElementById('searchInput');
  const filterList = () => {
    const q = searchInp.value.trim().toLowerCase();
    const filtered = data.orders.filter(o => {
      const c = data.customers.find(x => x.id === o.customerId);
      return (
        o.id.toString().includes(q) ||
        o.status.toLowerCase().includes(q) ||
        (c && c.name.toLowerCase().includes(q))
      );
    }).reverse();

    const paginator = new Paginator({
      data: filtered,
      pageSize: 8,
      containerId: 'ordersTableBody',
      controlsId: 'ordersPagination',
      renderFn: (rows) => {
        document.getElementById('ordersTableBody').innerHTML = rows.map(o => {
          const c = data.customers.find(x => x.id === o.customerId);
          return `
            <tr>
              <td><strong>#${o.id}</strong></td>
              <td>${c?.name || 'Guest'}</td>
              <td>${fmt.datetime(o.date)}</td>
              <td>${fmt.currency(o.total)}</td>
              <td>${statusBadge(o.status)}</td>
              <td>
                <button class="btn btn-sm btn-secondary" onclick="viewOrderDetails(${o.id})">🔍 Details</button>
              </td>
            </tr>
          `;
        }).join('') || '<tr><td colspan="6" class="empty-state">No orders found</td></tr>';
      }
    });
    window.currentPaginator = paginator;
    paginator.render();
  };

  searchInp.oninput = filterList;
  filterList();
}

window.viewOrderDetails = function(orderId) {
  const db = DB.get();
  const order = db.orders.find(o => o.id === orderId);
  if (!order) return;

  const cust = db.customers.find(c => c.id === order.customerId);

  document.getElementById('orderDetailTitle').textContent = `Order Detail - #${order.id}`;
  
  const detailHTML = `
    <div style="display:flex;justify-content:space-between;margin-bottom:1.5rem">
      <div>
        <h4 style="margin-bottom:0.25rem">${cust?.name || 'Guest Customer'}</h4>
        <p style="font-size:0.8rem;color:var(--text-muted)">${cust?.phone || ''} | ${cust?.email || ''}</p>
        <p style="font-size:0.8rem;color:var(--text-muted)">${cust?.address || ''}</p>
      </div>
      <div style="text-align:right">
        <div style="margin-bottom:0.5rem">${statusBadge(order.status)}</div>
        <p style="font-size:0.8rem;color:var(--text-muted)">Date: ${fmt.datetime(order.date)}</p>
      </div>
    </div>
    
    <div class="table-wrap" style="margin-bottom:1.5rem">
      <table>
        <thead>
          <tr><th>Item</th><th>Price</th><th>Qty</th><th>Subtotal</th></tr>
        </thead>
        <tbody>
          ${order.items.map(i => {
            const p = db.products.find(x => x.id === i.productId);
            return `
              <tr>
                <td><strong>${p?.name || 'Product'}</strong></td>
                <td>${fmt.currency(p?.price || 0)}</td>
                <td>${i.qty}</td>
                <td>${fmt.currency(i.subtotal)}</td>
              </tr>
            `;
          }).join('')}
          <tr style="border-top:2px solid var(--glass-border)">
            <td colspan="3" style="text-align:right"><strong>Total Amount:</strong></td>
            <td><strong>${fmt.currency(order.total)}</strong></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="form-group">
      <label>Update Order Status</label>
      <div style="display:flex;gap:0.5rem">
        <select class="form-control" id="update_order_status_val" style="flex:1">
          <option ${order.status === 'Pending' ? 'selected' : ''}>Pending</option>
          <option ${order.status === 'Processing' ? 'selected' : ''}>Processing</option>
          <option ${order.status === 'Shipped' ? 'selected' : ''}>Shipped</option>
          <option ${order.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
          <option ${order.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
        </select>
        <button class="btn btn-primary" onclick="submitOrderStatusUpdate(${order.id})">Update</button>
      </div>
    </div>
  `;

  document.getElementById('orderDetailContent').innerHTML = detailHTML;
  Modal.open('orderDetailModal');
};

window.submitOrderStatusUpdate = function(orderId) {
  const status = document.getElementById('update_order_status_val').value;
  const db = DB.get();
  const order = db.orders.find(o => o.id === orderId);
  if (!order) return;

  order.status = status;

  // Sync payments and deliveries if completed
  if (status === 'Delivered') {
    const delivery = db.deliveries.find(d => d.orderId === orderId);
    if (delivery) {
      delivery.status = 'Delivered';
      delivery.date = new Date().toISOString().split('T')[0];
    }
  }

  DB.set(db);
  Modal.close('orderDetailModal');
  Toast.show(`Order #${orderId} status updated to ${status}.`, 'success');
  renderOrdersView();
};

/* 7. Payments View */
function renderPaymentsView() {
  document.getElementById('pageTitle').innerHTML = '💳 Payments Processing';
  const data = DB.get();

  const totalCollected = data.payments.filter(p => p.status === 'Completed').reduce((sum, p) => sum + p.amount, 0);
  const pendingPayments = data.payments.filter(p => p.status === 'Pending').reduce((sum, p) => sum + p.amount, 0);

  const html = `
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon green">💳</div>
        <div class="stat-body">
          <div class="stat-label">Total Collections</div>
          <div class="stat-value">${fmt.currency(totalCollected)}</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon orange">⏳</div>
        <div class="stat-body">
          <div class="stat-label">Pending Receivables</div>
          <div class="stat-value">${fmt.currency(pendingPayments)}</div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header"><span class="card-title">💳 Ledger Transactions</span></div>
      <div class="toolbar">
        <div class="search-input">
          <span>🔍</span>
          <input type="text" id="searchInput" placeholder="Search payments by Order ID, Method or Status..." value="${lastQuery}">
        </div>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr><th>Tx ID</th><th>Order Ref</th><th>Method</th><th>Amount</th><th>Transaction Date</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody id="paymentsTableBody"></tbody>
        </table>
      </div>
      <div class="pagination" id="paymentsPagination"></div>
    </div>
  `;

  document.getElementById('viewport').innerHTML = html;

  const searchInp = document.getElementById('searchInput');
  const filterList = () => {
    const q = searchInp.value.trim().toLowerCase();
    const filtered = data.payments.filter(p => 
      p.orderId.toString().includes(q) ||
      p.method.toLowerCase().includes(q) ||
      p.status.toLowerCase().includes(q)
    ).reverse();

    const paginator = new Paginator({
      data: filtered,
      pageSize: 8,
      containerId: 'paymentsTableBody',
      controlsId: 'paymentsPagination',
      renderFn: (rows) => {
        document.getElementById('paymentsTableBody').innerHTML = rows.map(p => `
          <tr>
            <td>#TX-${p.id}</td>
            <td><strong>#${p.orderId}</strong></td>
            <td><span class="badge info">${p.method}</span></td>
            <td><strong>${fmt.currency(p.amount)}</strong></td>
            <td>${fmt.datetime(p.date)}</td>
            <td>${statusBadge(p.status === 'Completed' ? 'Completed Payment' : p.status)}</td>
            <td>
              ${p.status === 'Pending' ? `
                <button class="btn btn-sm btn-primary" onclick="completePaymentTx(${p.id})">Complete</button>
              ` : '—'}
            </td>
          </tr>
        `).join('') || '<tr><td colspan="7" class="empty-state">No payment logs found</td></tr>';
      }
    });
    window.currentPaginator = paginator;
    paginator.render();
  };

  searchInp.oninput = filterList;
  filterList();
}

window.completePaymentTx = function(txId) {
  const db = DB.get();
  const pay = db.payments.find(p => p.id === txId);
  if (!pay) return;

  pay.status = 'Completed';
  pay.date = new Date().toISOString();

  // If order status is pending, mark it as Processing since payment is cleared
  const order = db.orders.find(o => o.id === pay.orderId);
  if (order && order.status === 'Pending') {
    order.status = 'Processing';
  }

  DB.set(db);
  Toast.show(`Payment transaction TX-${txId} marked as completed.`, 'success');
  renderPaymentsView();
};

/* 8. Delivery View */
function renderDeliveryView() {
  document.getElementById('pageTitle').innerHTML = '🚚 Delivery Logistics';
  const data = DB.get();

  const activeDeliveries = data.deliveries.filter(d => ['Dispatched', 'In Transit', 'Pending'].includes(d.status)).length;

  const html = `
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon blue">🚚</div>
        <div class="stat-body">
          <div class="stat-label">Active Logistics</div>
          <div class="stat-value">${activeDeliveries} deliveries</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon green">📦</div>
        <div class="stat-body">
          <div class="stat-label">Completed Deliveries</div>
          <div class="stat-value">${data.deliveries.filter(d => d.status === 'Delivered').length} orders</div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header"><span class="card-title">🚚 Dispatches & Deliveries</span></div>
      <div class="toolbar">
        <div class="search-input">
          <span>🔍</span>
          <input type="text" id="searchInput" placeholder="Search dispatches by Order Ref, Address, Status..." value="${lastQuery}">
        </div>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr><th>Dispatch ID</th><th>Order ID</th><th>Delivery Address</th><th>Estimated Date</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody id="deliveryTableBody"></tbody>
        </table>
      </div>
      <div class="pagination" id="deliveryPagination"></div>
    </div>
  `;

  document.getElementById('viewport').innerHTML = html;

  const searchInp = document.getElementById('searchInput');
  const filterList = () => {
    const q = searchInp.value.trim().toLowerCase();
    const filtered = data.deliveries.filter(d => 
      d.orderId.toString().includes(q) ||
      d.delivery_address.toLowerCase().includes(q) ||
      d.status.toLowerCase().includes(q)
    ).reverse();

    const paginator = new Paginator({
      data: filtered,
      pageSize: 8,
      containerId: 'deliveryTableBody',
      controlsId: 'deliveryPagination',
      renderFn: (rows) => {
        document.getElementById('deliveryTableBody').innerHTML = rows.map(d => `
          <tr>
            <td>#DEL-${d.id}</td>
            <td><strong>#${d.orderId}</strong></td>
            <td style="max-width:250px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis" title="${d.delivery_address}">${d.delivery_address}</td>
            <td>${d.date ? fmt.date(d.date) : 'Pending Dispatch'}</td>
            <td>${statusBadge(d.status)}</td>
            <td>
              ${d.status !== 'Delivered' && d.status !== 'Failed' ? `
                <select class="form-control" style="width:auto;padding:0.35rem 0.5rem" onchange="updateDeliveryLogistics(${d.id}, this.value)">
                  <option value="" disabled selected>Update...</option>
                  <option value="Dispatched">Dispatched</option>
                  <option value="In Transit">In Transit</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Failed">Failed</option>
                </select>
              ` : '—'}
            </td>
          </tr>
        `).join('') || '<tr><td colspan="6" class="empty-state">No shipments logged</td></tr>';
      }
    });
    window.currentPaginator = paginator;
    paginator.render();
  };

  searchInp.oninput = filterList;
  filterList();
}

window.updateDeliveryLogistics = function(deliveryId, status) {
  const db = DB.get();
  const del = db.deliveries.find(d => d.id === deliveryId);
  if (!del) return;

  del.status = status;
  if (status === 'Delivered') {
    del.date = new Date().toISOString().split('T')[0];
    
    // Auto update corresponding order status to Delivered
    const order = db.orders.find(o => o.id === del.orderId);
    if (order) {
      order.status = 'Delivered';
    }
  }

  DB.set(db);
  Toast.show(`Logistics shipment DEL-${deliveryId} updated to ${status}.`, 'success');
  renderDeliveryView();
};

/* 9. Reports & Analytics View */
function renderReportsView() {
  destroyCharts();
  document.getElementById('pageTitle').innerHTML = '📈 Sales Reports & Analytics';
  const data = DB.get();

  const totalRevenue = data.payments.filter(p => p.status === 'Completed').reduce((sum, p) => sum + p.amount, 0);
  const profitMargin = totalRevenue * 0.18; // Simulated margin: 18%

  const html = `
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon green">📈</div>
        <div class="stat-body">
          <div class="stat-label">Total Revenue</div>
          <div class="stat-value">${fmt.currency(totalRevenue)}</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon blue">🪙</div>
        <div class="stat-body">
          <div class="stat-label">Simulated Profit (18%)</div>
          <div class="stat-value">${fmt.currency(profitMargin)}</div>
        </div>
      </div>
    </div>

    <div class="grid-2">
      <div class="card">
        <div class="card-header"><span class="card-title">📈 Weekly Revenue Analytics</span></div>
        <div class="chart-wrap"><canvas id="weeklyRevenueChart" class="chart-canvas" height="250"></canvas></div>
      </div>
      <div class="card" style="display:flex;flex-direction:column;justify-content:center;text-align:center;padding:2rem">
        <div style="font-size:3.5rem;margin-bottom:1rem">📊</div>
        <h3 style="color:var(--text-heading);margin-bottom:0.5rem">B2B SaaS Data Export</h3>
        <p style="color:var(--text-muted);margin-bottom:1.5rem;font-size:0.875rem">
          Generate and download database ledgers, product catalog listings, and transaction histories in PDF/CSV format.
        </p>
        <div style="display:flex;gap:0.75rem;justify-content:center">
          <button class="btn btn-primary" onclick="simulateExport('PDF')">📥 Export PDF Summary</button>
          <button class="btn btn-secondary" onclick="simulateExport('CSV')">📥 Export CSV Sheet</button>
        </div>
      </div>
    </div>
  `;

  document.getElementById('viewport').innerHTML = html;

  setTimeout(() => {
    try {
      const isDark = !document.body.classList.contains('light');
      const textColor = isDark ? '#94a3b8' : '#64748b';
      const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)';

      const weekCtx = document.getElementById('weeklyRevenueChart');
      if (weekCtx) {
        const weeklyChart = new Chart(weekCtx, {
          type: 'line',
          data: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
            datasets: [{
              label: 'Revenue Trend',
              data: [12000, 19000, 15000, 24000, 22000, 31000],
              borderColor: '#2874f0',
              backgroundColor: 'rgba(40, 116, 240, 0.08)',
              borderWidth: 3,
              fill: true,
              tension: 0.35,
              pointBackgroundColor: '#2874f0'
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              x: { grid: { color: gridColor }, ticks: { color: textColor } },
              y: { grid: { color: gridColor }, ticks: { color: textColor, callback: v => '₹' + v.toLocaleString() } }
            }
          }
        });
        window.currentCharts.push(weeklyChart);
      }
    } catch (e) {
      console.error('Error rendering weekly chart:', e);
    }
  }, 100);
}

window.simulateExport = function(format) {
  Toast.show(`Compiling spreadsheet report...`, 'info', 1500);
  setTimeout(() => {
    Toast.show(`Successfully generated and downloaded StoreReport_${new Date().toISOString().split('T')[0]}.${format.toLowerCase()}`, 'success');
  }, 1800);
};

/* ── DOM Initialization ── */
document.addEventListener('DOMContentLoaded', () => {
  ThemeManager.init();
  Notifications.init();
  setupGlobalSearch();
  Router.init();

  // Handle mobile backdrop close
  document.getElementById('sidebarOverlay')?.addEventListener('click', () => {
    Sidebar.close();
  });

  // Handle theme buttons in UI shell
  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.addEventListener('click', () => ThemeManager.toggle());
  });

  // Logout binder
  document.querySelectorAll('.btn-logout').forEach(btn => {
    btn.addEventListener('click', () => Auth.logout());
  });
});