/**
 * SMART RECHARGE MANAGEMENT SYSTEM
 * Core Application Logic & State Controller
 * Features: LocalStorage persistence, Realtime Analytics, Receipt Generator, Custom Toasts & Modals
 */

// ==================== 1. CONSTANTS & INITIALIZATION ====================
const STORAGE_KEY = 'smart_recharges';
const SETTINGS_KEY = 'smart_recharge_settings';

// Default Shop Configuration
const defaultSettings = {
  shopName: 'Sri Krishna Mobiles & Recharges',
  ownerName: 'Sriram',
  contactPhone: '+91 98765 43210',
  address: '12/A College Road, Tech Market, Coimbatore',
  upiId: 'sriram.recharge@upi'
};

// Seed sample records ONLY IF localStorage is completely empty
const sampleDataset = [
  {
    id: 'TXN-908214',
    customerName: 'Aravind Swaminathan',
    mobileNumber: '9840123456',
    operator: 'Jio',
    planDetails: '2 GB/Day + 5G | 28 Days | 100 SMS/day',
    amount: 299,
    paymentMethod: 'UPI',
    status: 'SUCCESS',
    timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(), // 25 mins ago
    notes: 'Counter 1 QR Pay'
  },
  {
    id: 'TXN-908213',
    customerName: 'Priya Dharshini',
    mobileNumber: '9841234567',
    operator: 'Airtel',
    planDetails: '1.5 GB/Day | 84 Days | Unlimited Voice',
    amount: 666,
    paymentMethod: 'UPI',
    status: 'SUCCESS',
    timestamp: new Date(Date.now() - 1000 * 60 * 110).toISOString(), // 1.8 hrs ago
    notes: 'GooglePay UPI'
  },
  {
    id: 'TXN-908212',
    customerName: 'Karthik Raja',
    mobileNumber: '9789012345',
    operator: 'Vi',
    planDetails: '1.5 GB/Day | 28 Days | Unlimited Calls',
    amount: 239,
    paymentMethod: 'Cash',
    status: 'SUCCESS',
    timestamp: new Date(Date.now() - 1000 * 60 * 195).toISOString(),
    notes: 'Cash Counter'
  },
  {
    id: 'TXN-908211',
    customerName: 'Meenakshi Sundaram',
    mobileNumber: '9443123456',
    operator: 'BSNL',
    planDetails: '24 Days Unlimited Calls | 2 GB Total',
    amount: 155,
    paymentMethod: 'Cash',
    status: 'SUCCESS',
    timestamp: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    notes: 'BSNL Topup'
  },
  {
    id: 'TXN-908210',
    customerName: 'Vignesh Kumar',
    mobileNumber: '9940123456',
    operator: 'Jio',
    planDetails: '2 GB/Day + True 5G | 84 Days',
    amount: 799,
    paymentMethod: 'Debit Card',
    status: 'PENDING',
    timestamp: new Date(Date.now() - 1000 * 60 * 450).toISOString(),
    notes: 'Bank switch delay'
  },
  {
    id: 'TXN-908209',
    customerName: 'Deepa Lakshmi',
    mobileNumber: '9884123456',
    operator: 'Airtel',
    planDetails: '1 GB Data Booster | Existing Validity',
    amount: 19,
    paymentMethod: 'UPI',
    status: 'FAILED',
    timestamp: new Date(Date.now() - 1000 * 60 * 620).toISOString(),
    notes: 'Operator timeout'
  },
  {
    id: 'TXN-908208',
    customerName: 'Suresh Babu',
    mobileNumber: '9840556789',
    operator: 'Jio',
    planDetails: '1.5 GB/Day | 28 Days | Unlimited Calls',
    amount: 239,
    paymentMethod: 'UPI',
    status: 'SUCCESS',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(), // Yesterday
    notes: 'Regular Customer'
  },
  {
    id: 'TXN-908207',
    customerName: 'Anitha Ramesh',
    mobileNumber: '9790123456',
    operator: 'Airtel',
    planDetails: '2 GB/Day + 5G | 28 Days | 100 SMS/day',
    amount: 299,
    paymentMethod: 'Net Banking',
    status: 'SUCCESS',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(),
    notes: 'Netbanking Direct'
  },
  {
    id: 'TXN-908206',
    customerName: 'Aravind Swaminathan',
    mobileNumber: '9840123456',
    operator: 'Jio',
    planDetails: '1 GB Data Booster | Existing Validity',
    amount: 19,
    paymentMethod: 'UPI',
    status: 'SUCCESS',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 49).toISOString(),
    notes: 'Addon pack'
  },
  {
    id: 'TXN-908205',
    customerName: 'Manojkumar S',
    mobileNumber: '9677123456',
    operator: 'Vi',
    planDetails: '1.5 GB/Day | 84 Days | Unlimited Voice',
    amount: 666,
    paymentMethod: 'Cash',
    status: 'SUCCESS',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 52).toISOString(),
    notes: '3 Month recharge'
  },
  {
    id: 'TXN-908204',
    customerName: 'Saravanan M',
    mobileNumber: '9444123456',
    operator: 'BSNL',
    planDetails: '24 Days Unlimited Calls | 2 GB Total',
    amount: 155,
    paymentMethod: 'UPI',
    status: 'SUCCESS',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 75).toISOString(),
    notes: 'Govt SIM'
  },
  {
    id: 'TXN-908203',
    customerName: 'Geetha Narayanan',
    mobileNumber: '9841890123',
    operator: 'Jio',
    planDetails: '2 GB/Day + True 5G | 84 Days',
    amount: 799,
    paymentMethod: 'UPI',
    status: 'SUCCESS',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
    notes: 'Family pack'
  }
];

// App State
let recharges = [];
let currentSettings = { ...defaultSettings };
let pendingDeleteId = null;
let charts = {
  dailyCollection: null,
  status: null,
  operator: null,
  payment: null
};

// ==================== 2. DATA STORAGE FUNCTIONS ====================
function initStorage() {
  // Load Settings
  const savedSettings = localStorage.getItem(SETTINGS_KEY);
  if (savedSettings) {
    try {
      currentSettings = Object.assign({}, defaultSettings, JSON.parse(savedSettings));
    } catch (e) {
      currentSettings = { ...defaultSettings };
    }
  } else {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(defaultSettings));
  }

  // Load Recharges
  const savedRecharges = localStorage.getItem(STORAGE_KEY);
  if (savedRecharges) {
    try {
      recharges = JSON.parse(savedRecharges);
    } catch (e) {
      console.error('Error parsing localStorage recharges, resetting to samples', e);
      recharges = [...sampleDataset];
      saveRecharges();
    }
  } else {
    // Brand new session: seed samples
    recharges = [...sampleDataset];
    saveRecharges();
  }
}

function saveRecharges() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recharges));
}

function saveSettings() {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(currentSettings));
}

// ==================== 3. DOM ELEMENTS ====================
const el = {
  // Navigation
  navLinks: document.querySelectorAll('.nav-link'),
  pageViews: document.querySelectorAll('.page-view'),
  hamburgerBtn: document.getElementById('hamburgerBtn'),
  sidebar: document.getElementById('sidebar'),
  sidebarCloseBtn: document.getElementById('sidebarCloseBtn'),
  sidebarBackdrop: document.getElementById('sidebarBackdrop'),
  sidebarQuickRechargeBtn: document.getElementById('sidebarQuickRechargeBtn'),

  // Header
  globalSearchInput: document.getElementById('globalSearchInput'),
  notificationBtn: document.getElementById('notificationBtn'),
  notifPanel: document.getElementById('notifPanel'),
  headerCurrentDate: document.getElementById('headerCurrentDate'),

  // Dashboard
  btnDashNewRecharge: document.getElementById('btnDashNewRecharge'),
  btnExportData: document.getElementById('btnExportData'),
  btnViewAllHistory: document.getElementById('btnViewAllHistory'),
  statTotalRecharges: document.getElementById('statTotalRecharges'),
  statTodayRecharges: document.getElementById('statTodayRecharges'),
  statTodayCollection: document.getElementById('statTodayCollection'),
  statSuccessfulRecharges: document.getElementById('statSuccessfulRecharges'),
  statFailedRecharges: document.getElementById('statFailedRecharges'),
  statTotalCustomers: document.getElementById('statTotalCustomers'),
  statSuccessRate: document.getElementById('statSuccessRate'),
  dashboardTxnBody: document.getElementById('dashboardTxnBody'),
  dashEmptyState: document.getElementById('dashEmptyState'),

  // Add Recharge Form
  rechargeForm: document.getElementById('rechargeForm'),
  editRechargeId: document.getElementById('editRechargeId'),
  customerName: document.getElementById('customerName'),
  mobileNumber: document.getElementById('mobileNumber'),
  planDetails: document.getElementById('planDetails'),
  rechargeAmount: document.getElementById('rechargeAmount'),
  rechargeStatus: document.getElementById('rechargeStatus'),
  transactionNotes: document.getElementById('transactionNotes'),
  btnResetForm: document.getElementById('btnResetForm'),
  btnSubmitRecharge: document.getElementById('btnSubmitRecharge'),
  btnCancelAddRecharge: document.getElementById('btnCancelAddRecharge'),
  operatorSelectGrid: document.getElementById('operatorSelectGrid'),
  paymentSelectGrid: document.getElementById('paymentSelectGrid'),
  planChips: document.querySelectorAll('.plan-chip'),

  // Form Preview Slip
  prevCustomer: document.getElementById('prevCustomer'),
  prevMobile: document.getElementById('prevMobile'),
  prevOperator: document.getElementById('prevOperator'),
  prevPayment: document.getElementById('prevPayment'),
  prevAmount: document.getElementById('prevAmount'),

  // History Page
  historySearchInput: document.getElementById('historySearchInput'),
  historyOperatorFilter: document.getElementById('historyOperatorFilter'),
  historyStatusFilter: document.getElementById('historyStatusFilter'),
  historyDateFilter: document.getElementById('historyDateFilter'),
  btnResetFilters: document.getElementById('btnResetFilters'),
  btnClearHistorySearch: document.getElementById('btnClearHistorySearch'),
  historyRecordsBadge: document.getElementById('historyRecordsBadge'),
  activeFilterChips: document.getElementById('activeFilterChips'),
  historyTableBody: document.getElementById('historyTableBody'),
  historyEmptyState: document.getElementById('historyEmptyState'),
  btnExportCSV: document.getElementById('btnExportCSV'),
  btnHistoryNewRecharge: document.getElementById('btnHistoryNewRecharge'),

  // Customers Page
  customerSearchInput: document.getElementById('customerSearchInput'),
  customersGrid: document.getElementById('customersGrid'),
  customerEmptyState: document.getElementById('customerEmptyState'),

  // Reports Page
  repTotalRevenue: document.getElementById('repTotalRevenue'),
  repAvgAmount: document.getElementById('repAvgAmount'),
  repSuccessRate: document.getElementById('repSuccessRate'),
  repTopOperator: document.getElementById('repTopOperator'),
  btnPrintReport: document.getElementById('btnPrintReport'),

  // Settings
  settingsForm: document.getElementById('settingsForm'),
  settingShopName: document.getElementById('settingShopName'),
  settingOwnerName: document.getElementById('settingOwnerName'),
  settingContactPhone: document.getElementById('settingContactPhone'),
  settingShopAddress: document.getElementById('settingShopAddress'),
  settingUpiId: document.getElementById('settingUpiId'),
  btnDownloadJsonBackup: document.getElementById('btnDownloadJsonBackup'),
  btnLoadDemoDataset: document.getElementById('btnLoadDemoDataset'),
  btnClearAllStorage: document.getElementById('btnClearAllStorage'),

  // Modals
  viewModal: document.getElementById('viewModal'),
  closeViewModal: document.getElementById('closeViewModal'),
  btnCloseViewModal: document.getElementById('btnCloseViewModal'),
  btnPrintSlipBtn: document.getElementById('btnPrintSlipBtn'),

  customerModal: document.getElementById('customerModal'),
  closeCustModal: document.getElementById('closeCustModal'),
  btnCloseCustModal: document.getElementById('btnCloseCustModal'),
  btnCustQuickRecharge: document.getElementById('btnCustQuickRecharge'),

  deleteModal: document.getElementById('deleteModal'),
  btnCancelDelete: document.getElementById('btnCancelDelete'),
  btnConfirmDelete: document.getElementById('btnConfirmDelete'),
  deleteTargetTxnId: document.getElementById('deleteTargetTxnId'),

  resetDbModal: document.getElementById('resetDbModal'),
  btnCancelResetDb: document.getElementById('btnCancelResetDb'),
  btnConfirmResetDb: document.getElementById('btnConfirmResetDb'),

  // Receipt Elements
  receiptShopName: document.getElementById('receiptShopName'),
  receiptShopAddress: document.getElementById('receiptShopAddress'),
  receiptShopContact: document.getElementById('receiptShopContact'),
  receiptStatusBadge: document.getElementById('receiptStatusBadge'),
  rcTxnId: document.getElementById('rcTxnId'),
  rcDateTime: document.getElementById('rcDateTime'),
  rcCustomer: document.getElementById('rcCustomer'),
  rcMobile: document.getElementById('rcMobile'),
  rcOperator: document.getElementById('rcOperator'),
  rcPlan: document.getElementById('rcPlan'),
  rcPayment: document.getElementById('rcPayment'),
  rcAmount: document.getElementById('rcAmount'),
  rcBarcodeNum: document.getElementById('rcBarcodeNum'),

  // Toast Container
  toastContainer: document.getElementById('toastContainer')
};

// ==================== 4. NAVIGATION CONTROLLER ====================
function switchPage(pageId) {
  // Update sidebar active link
  el.navLinks.forEach(link => {
    if (link.dataset.page === pageId) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Switch visible section
  el.pageViews.forEach(view => {
    if (view.id === `view-${pageId}`) {
      view.classList.add('active');
    } else {
      view.classList.remove('active');
    }
  });

  // Close mobile sidebar if open
  closeMobileSidebar();

  // Scroll viewport to top
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Refresh page specific views
  if (pageId === 'dashboard') {
    renderDashboard();
  } else if (pageId === 'history') {
    renderHistory();
  } else if (pageId === 'customers') {
    renderCustomers();
  } else if (pageId === 'reports') {
    renderReports();
  } else if (pageId === 'settings') {
    populateSettingsForm();
  }
}

function openMobileSidebar() {
  el.sidebar.classList.add('open');
  el.sidebarBackdrop.classList.add('show');
}

function closeMobileSidebar() {
  el.sidebar.classList.remove('open');
  el.sidebarBackdrop.classList.remove('show');
}

// ==================== 5. TOAST NOTIFICATION SYSTEM ====================
function showToast(message, type = 'success', title = '') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const iconMap = {
    success: 'fa-solid fa-circle-check',
    error: 'fa-solid fa-circle-xmark',
    warning: 'fa-solid fa-triangle-exclamation',
    info: 'fa-solid fa-circle-info'
  };

  const defaultTitles = {
    success: 'Success',
    error: 'Action Failed',
    warning: 'Notice',
    info: 'Information'
  };

  toast.innerHTML = `
    <div class="toast-icon"><i class="${iconMap[type] || iconMap.info}"></i></div>
    <div class="toast-content">
      <div class="toast-title">${title || defaultTitles[type]}</div>
      <div class="toast-message">${message}</div>
    </div>
    <button class="toast-close" aria-label="Dismiss toast">&times;</button>
  `;

  el.toastContainer.appendChild(toast);

  const closeToast = () => {
    toast.classList.add('toast-hiding');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 250);
  };

  toast.querySelector('.toast-close').addEventListener('click', closeToast);

  // Auto dismiss after 3.8s
  setTimeout(closeToast, 3800);
}

// ==================== 6. DATE & FORMATTING HELPERS ====================
function formatCurrency(amount) {
  return Number(amount || 0).toLocaleString('en-IN');
}

function formatDateTime(isoString) {
  if (!isoString) return '--';
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return '--';
  
  return d.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}

function formatDateOnly(isoString) {
  if (!isoString) return '--';
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return '--';
  return d.toISOString().split('T')[0];
}

function isToday(isoString) {
  if (!isoString) return false;
  const target = new Date(isoString);
  const now = new Date();
  return (
    target.getFullYear() === now.getFullYear() &&
    target.getMonth() === now.getMonth() &&
    target.getDate() === now.getDate()
  );
}

function updateHeaderDate() {
  const now = new Date();
  const options = { weekday: 'long', day: '2-digit', month: 'short', year: 'numeric' };
  el.headerCurrentDate.textContent = now.toLocaleDateString('en-IN', options);
}

// Animate numbers counting up on dashboard cards
function animateValue(element, start, end, duration = 600, isCurrency = false) {
  if (!element) return;
  start = Number(start) || 0;
  end = Number(end) || 0;
  if (start === end) {
    element.textContent = isCurrency ? formatCurrency(end) : end;
    return;
  }
  const range = end - start;
  const startTime = performance.now();

  function updateCount(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const current = Math.floor(start + range * progress);
    element.textContent = isCurrency ? formatCurrency(current) : current;
    if (progress < 1) {
      requestAnimationFrame(updateCount);
    } else {
      element.textContent = isCurrency ? formatCurrency(end) : end;
    }
  }
  requestAnimationFrame(updateCount);
}

// Helper to get operator CSS classes
function getOperatorBadgeHtml(operator) {
  const op = (operator || 'Other').toLowerCase();
  let badgeClass = 'op-jio-badge';
  let icon = 'fa-signal';

  if (op.includes('airtel')) {
    badgeClass = 'op-airtel-badge';
    icon = 'fa-tower-broadcast';
  } else if (op.includes('vi') || op.includes('vodafone') || op.includes('idea')) {
    badgeClass = 'op-vi-badge';
    icon = 'fa-wifi';
  } else if (op.includes('bsnl')) {
    badgeClass = 'op-bsnl-badge';
    icon = 'fa-satellite-dish';
  }

  return `<span class="operator-badge ${badgeClass}"><i class="fa-solid ${icon}"></i> ${operator}</span>`;
}

// Helper to get status badge HTML
function getStatusBadgeHtml(status) {
  const st = (status || 'SUCCESS').toUpperCase();
  let statusClass = 'status-success';
  if (st === 'PENDING') statusClass = 'status-pending';
  if (st === 'FAILED') statusClass = 'status-failed';

  return `
    <span class="status-badge ${statusClass}">
      <span class="status-dot"></span> ${st}
    </span>
  `;
}

// ==================== 7. DASHBOARD LOGIC ====================
function renderDashboard() {
  const totalRecharges = recharges.length;

  // Filter Today's recharges
  const todayRechargesList = recharges.filter(r => isToday(r.timestamp));
  const todayRechargesCount = todayRechargesList.length;

  // Today's Collection (Only Successful recharges count toward revenue)
  const todayCollection = todayRechargesList
    .filter(r => r.status === 'SUCCESS')
    .reduce((sum, r) => sum + (Number(r.amount) || 0), 0);

  // Status breakdown
  const successfulCount = recharges.filter(r => r.status === 'SUCCESS').length;
  const failedCount = recharges.filter(r => r.status === 'FAILED').length;

  // Unique Customers count
  const uniqueMobiles = new Set(recharges.map(r => r.mobileNumber));
  const totalCustomers = uniqueMobiles.size;

  // Success rate percentage
  const successRate = totalRecharges > 0 ? Math.round((successfulCount / totalRecharges) * 100) : 100;

  // Animate stats values
  animateValue(el.statTotalRecharges, 0, totalRecharges);
  animateValue(el.statTodayRecharges, 0, todayRechargesCount);
  animateValue(el.statTodayCollection, 0, todayCollection, 600, true);
  animateValue(el.statSuccessfulRecharges, 0, successfulCount);
  animateValue(el.statFailedRecharges, 0, failedCount);
  animateValue(el.statTotalCustomers, 0, totalCustomers);
  if (el.statSuccessRate) el.statSuccessRate.textContent = `${successRate}% Rate`;

  // Render Recent Transactions (Top 5 sorted by timestamp descending)
  const sorted = [...recharges].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  const recent = sorted.slice(0, 6);

  if (recent.length === 0) {
    el.dashboardTxnBody.innerHTML = '';
    el.dashEmptyState.classList.remove('hidden');
  } else {
    el.dashEmptyState.classList.add('hidden');
    el.dashboardTxnBody.innerHTML = recent.map(tx => `
      <tr>
        <td>
          <div class="customer-col">
            <div class="cust-mini-avatar">${(tx.customerName || 'U').charAt(0).toUpperCase()}</div>
            <div>
              <strong>${escapeHtml(tx.customerName || 'Customer')}</strong>
              <div class="text-muted" style="font-size: 0.72rem;">${tx.id}</div>
            </div>
          </div>
        </td>
        <td><strong>+91 ${escapeHtml(tx.mobileNumber || '')}</strong></td>
        <td>${getOperatorBadgeHtml(tx.operator)}</td>
        <td><span class="table-amount">₹${formatCurrency(tx.amount)}</span></td>
        <td><span class="text-muted"><i class="fa-solid fa-credit-card"></i> ${escapeHtml(tx.paymentMethod || 'Cash')}</span></td>
        <td>${getStatusBadgeHtml(tx.status)}</td>
        <td><span class="table-time">${formatDateTime(tx.timestamp)}</span></td>
        <td class="text-right">
          <button class="action-btn" title="View Slip" onclick="openReceiptModal('${tx.id}')">
            <i class="fa-regular fa-file-lines"></i>
          </button>
        </td>
      </tr>
    `).join('');
  }
}

// ==================== 8. ADD / EDIT RECHARGE LOGIC ====================
function getSelectedOperator() {
  const checked = document.querySelector('input[name="operatorRadio"]:checked');
  return checked ? checked.value : 'Jio';
}

function getSelectedPayment() {
  const checked = document.querySelector('input[name="paymentRadio"]:checked');
  return checked ? checked.value : 'UPI';
}

function updateLivePreviewSlip() {
  const name = el.customerName.value.trim() || '--';
  const mobile = el.mobileNumber.value.trim() ? `+91 ${el.mobileNumber.value.trim()}` : '--';
  const op = getSelectedOperator();
  const pay = getSelectedPayment();
  const amt = el.rechargeAmount.value.trim() || '0';

  el.prevCustomer.textContent = name;
  el.prevMobile.textContent = mobile;
  el.prevOperator.textContent = op;
  el.prevPayment.textContent = pay;
  el.prevAmount.textContent = formatCurrency(amt);
}

function setupFormInteractiveCards() {
  // Operator card radio selection styling
  const opCards = el.operatorSelectGrid.querySelectorAll('.op-select-card');
  opCards.forEach(card => {
    card.addEventListener('click', () => {
      opCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      const radio = card.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
      updateLivePreviewSlip();
    });
  });

  // Payment card radio selection styling
  const payCards = el.paymentSelectGrid.querySelectorAll('.pay-select-card');
  payCards.forEach(card => {
    card.addEventListener('click', () => {
      payCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      const radio = card.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
      updateLivePreviewSlip();
    });
  });

  // Plan Chips quick selector
  el.planChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const amt = chip.dataset.amount;
      const plan = chip.dataset.plan;
      el.rechargeAmount.value = amt;
      el.planDetails.value = plan;
      updateLivePreviewSlip();
      showToast(`Selected ₹${amt} plan`, 'info', 'Plan Chosen');
    });
  });

  // Input listeners for preview slip
  [el.customerName, el.mobileNumber, el.rechargeAmount].forEach(input => {
    input.addEventListener('input', updateLivePreviewSlip);
  });
}

function resetRechargeForm() {
  el.rechargeForm.reset();
  el.editRechargeId.value = '';
  el.btnSubmitRecharge.innerHTML = '<i class="fa-solid fa-bolt"></i> Recharge Now';

  // Reset radio cards active classes
  const opCards = el.operatorSelectGrid.querySelectorAll('.op-select-card');
  opCards.forEach((c, idx) => c.classList.toggle('active', idx === 0));
  if (opCards[0]) opCards[0].querySelector('input').checked = true;

  const payCards = el.paymentSelectGrid.querySelectorAll('.pay-select-card');
  payCards.forEach((c, idx) => c.classList.toggle('active', idx === 0));
  if (payCards[0]) payCards[0].querySelector('input').checked = true;

  updateLivePreviewSlip();
}

function handleRechargeSubmit(e) {
  e.preventDefault();

  const customerName = el.customerName.value.trim();
  const mobileNumber = el.mobileNumber.value.trim();
  const operator = getSelectedOperator();
  const planDetails = el.planDetails.value.trim();
  const amount = Number(el.rechargeAmount.value);
  const paymentMethod = getSelectedPayment();
  const status = el.rechargeStatus.value;
  const notes = el.transactionNotes.value.trim();
  const editId = el.editRechargeId.value.trim();

  // Basic Validation
  if (!customerName) {
    showToast('Please enter Customer Name', 'error', 'Validation Error');
    el.customerName.focus();
    return;
  }

  if (!/^\d{10}$/.test(mobileNumber)) {
    showToast('Please enter a valid 10-digit mobile number', 'error', 'Invalid Phone');
    el.mobileNumber.focus();
    return;
  }

  if (!planDetails) {
    showToast('Please specify recharge plan details', 'error', 'Validation Error');
    el.planDetails.focus();
    return;
  }

  if (isNaN(amount) || amount <= 0) {
    showToast('Please enter a valid recharge amount', 'error', 'Invalid Amount');
    el.rechargeAmount.focus();
    return;
  }

  if (editId) {
    // EDIT MODE
    const index = recharges.findIndex(r => r.id === editId);
    if (index !== -1) {
      recharges[index] = {
        ...recharges[index],
        customerName,
        mobileNumber,
        operator,
        planDetails,
        amount,
        paymentMethod,
        status,
        notes
      };
      saveRecharges();
      showToast(`Transaction ${editId} updated successfully!`, 'success', 'Record Updated');
      resetRechargeForm();
      switchPage('history');
    }
  } else {
    // NEW RECHARGE
    const newTxnId = 'TXN-' + Math.floor(100000 + Math.random() * 900000);
    const newRecord = {
      id: newTxnId,
      customerName,
      mobileNumber,
      operator,
      planDetails,
      amount,
      paymentMethod,
      status,
      timestamp: new Date().toISOString(),
      notes: notes || 'Counter Transaction'
    };

    // Prepend to top
    recharges.unshift(newRecord);
    saveRecharges();

    showToast(`Recharge of ₹${amount} for +91 ${mobileNumber} processed successfully!`, 'success', 'Recharge Success');
    resetRechargeForm();

    // Show receipt token slip directly
    openReceiptModal(newTxnId);
  }
}

// Prefill form for editing
window.editRecharge = function(id) {
  const item = recharges.find(r => r.id === id);
  if (!item) return;

  switchPage('add-recharge');

  el.editRechargeId.value = item.id;
  el.customerName.value = item.customerName;
  el.mobileNumber.value = item.mobileNumber;
  el.planDetails.value = item.planDetails;
  el.rechargeAmount.value = item.amount;
  el.rechargeStatus.value = item.status;
  el.transactionNotes.value = item.notes || '';

  // Select operator radio
  const opCards = el.operatorSelectGrid.querySelectorAll('.op-select-card');
  opCards.forEach(c => {
    const radio = c.querySelector('input');
    if (radio && radio.value === item.operator) {
      c.classList.add('active');
      radio.checked = true;
    } else {
      c.classList.remove('active');
    }
  });

  // Select payment radio
  const payCards = el.paymentSelectGrid.querySelectorAll('.pay-select-card');
  payCards.forEach(c => {
    const radio = c.querySelector('input');
    if (radio && radio.value === item.paymentMethod) {
      c.classList.add('active');
      radio.checked = true;
    } else {
      c.classList.remove('active');
    }
  });

  el.btnSubmitRecharge.innerHTML = `<i class="fa-solid fa-floppy-disk"></i> Update Transaction (${item.id})`;
  updateLivePreviewSlip();
  showToast(`Editing transaction ${item.id}`, 'info', 'Edit Mode');
};

// ==================== 9. RECHARGE HISTORY LOGIC ====================
function getFilteredHistory() {
  const query = el.historySearchInput.value.toLowerCase().trim();
  const operator = el.historyOperatorFilter.value;
  const status = el.historyStatusFilter.value;
  const dateFilter = el.historyDateFilter.value; // YYYY-MM-DD

  return recharges.filter(item => {
    // Search query matches customer name, mobile, id, or plan
    if (query) {
      const match =
        (item.customerName && item.customerName.toLowerCase().includes(query)) ||
        (item.mobileNumber && item.mobileNumber.includes(query)) ||
        (item.id && item.id.toLowerCase().includes(query)) ||
        (item.planDetails && item.planDetails.toLowerCase().includes(query));
      if (!match) return false;
    }

    // Operator Filter
    if (operator !== 'ALL' && item.operator !== operator) {
      return false;
    }

    // Status Filter
    if (status !== 'ALL' && item.status !== status) {
      return false;
    }

    // Date Filter
    if (dateFilter) {
      const itemDate = formatDateOnly(item.timestamp);
      if (itemDate !== dateFilter) return false;
    }

    return true;
  });
}

function renderHistory() {
  const filtered = getFilteredHistory();
  // Sort latest first
  filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  el.historyRecordsBadge.textContent = `Showing ${filtered.length} of ${recharges.length} records`;

  // Render Active filter chips
  renderFilterChips();

  if (filtered.length === 0) {
    el.historyTableBody.innerHTML = '';
    el.historyEmptyState.classList.remove('hidden');
    return;
  }

  el.historyEmptyState.classList.add('hidden');
  el.historyTableBody.innerHTML = filtered.map(tx => `
    <tr>
      <td>
        <strong style="color: var(--primary-blue); font-family: monospace; font-size: 0.85rem;">${tx.id}</strong>
      </td>
      <td>
        <div class="customer-col">
          <div class="cust-mini-avatar">${(tx.customerName || 'U').charAt(0).toUpperCase()}</div>
          <strong>${escapeHtml(tx.customerName || 'Customer')}</strong>
        </div>
      </td>
      <td><strong>+91 ${escapeHtml(tx.mobileNumber || '')}</strong></td>
      <td>${getOperatorBadgeHtml(tx.operator)}</td>
      <td><span class="plan-txt text-muted" title="${escapeHtml(tx.planDetails)}">${escapeHtml(tx.planDetails || '--')}</span></td>
      <td><span class="table-amount">₹${formatCurrency(tx.amount)}</span></td>
      <td><span class="text-muted">${escapeHtml(tx.paymentMethod || 'Cash')}</span></td>
      <td>${getStatusBadgeHtml(tx.status)}</td>
      <td><span class="table-time">${formatDateTime(tx.timestamp)}</span></td>
      <td class="text-right">
        <div class="table-actions">
          <button class="action-btn" title="View Slip" onclick="openReceiptModal('${tx.id}')">
            <i class="fa-regular fa-file-lines"></i>
          </button>
          <button class="action-btn" title="Edit Recharge" onclick="editRecharge('${tx.id}')">
            <i class="fa-regular fa-pen-to-square"></i>
          </button>
          <button class="action-btn btn-delete" title="Delete Recharge" onclick="promptDeleteRecharge('${tx.id}')">
            <i class="fa-regular fa-trash-can"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

function renderFilterChips() {
  const chips = [];
  const query = el.historySearchInput.value.trim();
  const operator = el.historyOperatorFilter.value;
  const status = el.historyStatusFilter.value;
  const dateFilter = el.historyDateFilter.value;

  if (query) chips.push(`Query: "${query}"`);
  if (operator !== 'ALL') chips.push(`Operator: ${operator}`);
  if (status !== 'ALL') chips.push(`Status: ${status}`);
  if (dateFilter) chips.push(`Date: ${dateFilter}`);

  if (chips.length === 0) {
    el.activeFilterChips.innerHTML = '';
    return;
  }

  el.activeFilterChips.innerHTML = chips.map(chip => `
    <span class="filter-pill">
      ${escapeHtml(chip)}
    </span>
  `).join('');
}

function clearAllHistoryFilters() {
  el.historySearchInput.value = '';
  el.historyOperatorFilter.value = 'ALL';
  el.historyStatusFilter.value = 'ALL';
  el.historyDateFilter.value = '';
  renderHistory();
  showToast('Filters cleared', 'info');
}

// Prompt Delete Modal
window.promptDeleteRecharge = function(id) {
  pendingDeleteId = id;
  el.deleteTargetTxnId.textContent = id;
  el.deleteModal.classList.add('show');
};

function confirmDeleteRecharge() {
  if (!pendingDeleteId) return;
  const idToDelete = pendingDeleteId;
  recharges = recharges.filter(r => r.id !== idToDelete);
  saveRecharges();

  el.deleteModal.classList.remove('show');
  pendingDeleteId = null;

  showToast(`Transaction ${idToDelete} deleted permanently`, 'warning', 'Deleted');
  renderHistory();
  renderDashboard();
}

// Export CSV of Recharge records
function exportRechargesToCSV() {
  if (recharges.length === 0) {
    showToast('No recharge records to export', 'warning');
    return;
  }

  const headers = ['Transaction ID', 'Customer Name', 'Mobile Number', 'Operator', 'Plan Details', 'Amount (INR)', 'Payment Method', 'Status', 'Date Time', 'Notes'];
  const rows = recharges.map(r => [
    `"${r.id}"`,
    `"${(r.customerName || '').replace(/"/g, '""')}"`,
    `"${r.mobileNumber}"`,
    `"${r.operator}"`,
    `"${(r.planDetails || '').replace(/"/g, '""')}"`,
    r.amount,
    `"${r.paymentMethod}"`,
    `"${r.status}"`,
    `"${r.timestamp}"`,
    `"${(r.notes || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `SmartRecharge_Export_${formatDateOnly(new Date().toISOString())}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast('Recharge CSV exported successfully', 'success', 'Export Complete');
}

// ==================== 10. CUSTOMERS DIRECTORY ====================
function getAggregatedCustomers() {
  const customerMap = new Map();

  recharges.forEach(tx => {
    const key = tx.mobileNumber;
    if (!key) return;

    if (!customerMap.has(key)) {
      customerMap.set(key, {
        customerName: tx.customerName || 'Valued Customer',
        mobileNumber: tx.mobileNumber,
        totalRecharges: 0,
        totalAmount: 0,
        lastRechargeDate: tx.timestamp,
        lastOperator: tx.operator,
        history: []
      });
    }

    const c = customerMap.get(key);
    c.totalRecharges += 1;
    if (tx.status === 'SUCCESS') {
      c.totalAmount += (Number(tx.amount) || 0);
    }
    // Update last recharge if more recent
    if (new Date(tx.timestamp) > new Date(c.lastRechargeDate)) {
      c.lastRechargeDate = tx.timestamp;
      c.lastOperator = tx.operator;
      c.customerName = tx.customerName || c.customerName;
    }
    c.history.push(tx);
  });

  return Array.from(customerMap.values());
}

function renderCustomers() {
  const query = el.customerSearchInput.value.toLowerCase().trim();
  let customers = getAggregatedCustomers();

  if (query) {
    customers = customers.filter(c =>
      c.customerName.toLowerCase().includes(query) ||
      c.mobileNumber.includes(query)
    );
  }

  // Sort by total recharges descending
  customers.sort((a, b) => b.totalRecharges - a.totalRecharges);

  if (customers.length === 0) {
    el.customersGrid.innerHTML = '';
    el.customerEmptyState.classList.remove('hidden');
    return;
  }

  el.customerEmptyState.classList.add('hidden');
  el.customersGrid.innerHTML = customers.map(c => `
    <div class="customer-card" onclick="openCustomerModal('${c.mobileNumber}')">
      <div class="customer-card-header">
        <div class="customer-avatar">${c.customerName.charAt(0).toUpperCase()}</div>
        <div class="customer-info">
          <h4>${escapeHtml(c.customerName)}</h4>
          <div class="customer-mobile"><i class="fa-solid fa-phone"></i> +91 ${escapeHtml(c.mobileNumber)}</div>
        </div>
      </div>

      <div class="customer-stats-row">
        <div class="cust-mini-stat">
          <span class="cms-val">${c.totalRecharges}</span>
          <span class="cms-lbl">Total Recharges</span>
        </div>
        <div class="cust-mini-stat">
          <span class="cms-val">₹${formatCurrency(c.totalAmount)}</span>
          <span class="cms-lbl">Total Spent</span>
        </div>
      </div>

      <div class="customer-card-footer">
        <span>Last: ${formatDateOnly(c.lastRechargeDate)} (${escapeHtml(c.lastOperator)})</span>
        <span class="view-hist-link">History <i class="fa-solid fa-chevron-right"></i></span>
      </div>
    </div>
  `).join('');
}

// Customer Profile Modal with full transaction history
window.openCustomerModal = function(mobile) {
  const customerList = getAggregatedCustomers();
  const c = customerList.find(item => item.mobileNumber === mobile);
  if (!c) return;

  el.custHeroAvatar.textContent = c.customerName.charAt(0).toUpperCase();
  el.custHeroName.textContent = c.customerName;
  el.custHeroPhone.textContent = `+91 ${c.mobileNumber}`;
  el.custHeroCount.textContent = c.totalRecharges;
  el.custHeroTotal.textContent = `₹${formatCurrency(c.totalAmount)}`;

  // Populate customer recharges table
  const sortedHistory = [...c.history].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  el.custTxnBody.innerHTML = sortedHistory.map(tx => `
    <tr>
      <td><span style="font-family: monospace; font-weight: 700;">${tx.id}</span></td>
      <td>${getOperatorBadgeHtml(tx.operator)}</td>
      <td><span class="plan-txt">${escapeHtml(tx.planDetails)}</span></td>
      <td><strong>₹${formatCurrency(tx.amount)}</strong></td>
      <td>${escapeHtml(tx.paymentMethod)}</td>
      <td>${getStatusBadgeHtml(tx.status)}</td>
      <td>${formatDateTime(tx.timestamp)}</td>
    </tr>
  `).join('');

  // Setup "Recharge Again" button
  el.btnCustQuickRecharge.onclick = () => {
    el.customerModal.classList.remove('show');
    switchPage('add-recharge');
    el.customerName.value = c.customerName;
    el.mobileNumber.value = c.mobileNumber;
    updateLivePreviewSlip();
    showToast(`Quick-recharge initiated for ${c.customerName}`, 'info');
  };

  el.customerModal.classList.add('show');
};

// ==================== 11. REPORTS & CHARTS ====================
function renderReports() {
  const totalRev = recharges
    .filter(r => r.status === 'SUCCESS')
    .reduce((sum, r) => sum + (Number(r.amount) || 0), 0);

  const totalSuccess = recharges.filter(r => r.status === 'SUCCESS').length;
  const avgAmount = totalSuccess > 0 ? Math.round(totalRev / totalSuccess) : 0;
  const successRate = recharges.length > 0 ? Math.round((totalSuccess / recharges.length) * 100) : 100;

  // Find top operator
  const opCounts = {};
  recharges.forEach(r => {
    opCounts[r.operator] = (opCounts[r.operator] || 0) + 1;
  });
  let topOp = '--';
  let topOpMax = 0;
  Object.keys(opCounts).forEach(op => {
    if (opCounts[op] > topOpMax) {
      topOpMax = opCounts[op];
      topOp = op;
    }
  });

  el.repTotalRevenue.textContent = formatCurrency(totalRev);
  el.repAvgAmount.textContent = formatCurrency(avgAmount);
  el.repSuccessRate.textContent = `${successRate}%`;
  el.repTopOperator.textContent = topOp;

  renderReportCharts();
}

function renderReportCharts() {
  if (typeof Chart === 'undefined') {
    console.warn('Chart.js not loaded');
    return;
  }

  // 1. Daily Collection Trend (Group by date for last 7 dates)
  const collectionByDate = {};
  recharges
    .filter(r => r.status === 'SUCCESS')
    .forEach(r => {
      const d = formatDateOnly(r.timestamp);
      collectionByDate[d] = (collectionByDate[d] || 0) + Number(r.amount);
    });

  const sortedDates = Object.keys(collectionByDate).sort();
  const dateLabels = sortedDates.slice(-7);
  const dateValues = dateLabels.map(d => collectionByDate[d]);

  const ctxDaily = document.getElementById('dailyCollectionChart');
  if (ctxDaily) {
    if (charts.dailyCollection) charts.dailyCollection.destroy();
    charts.dailyCollection = new Chart(ctxDaily, {
      type: 'line',
      data: {
        labels: dateLabels.length ? dateLabels : ['Today'],
        datasets: [{
          label: 'Collection (₹)',
          data: dateValues.length ? dateValues : [0],
          borderColor: '#2563eb',
          backgroundColor: 'rgba(37, 99, 235, 0.12)',
          fill: true,
          tension: 0.35,
          borderWidth: 3,
          pointBackgroundColor: '#38bdf8',
          pointBorderColor: '#ffffff',
          pointRadius: 5
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: value => '₹' + value
            },
            grid: { color: '#f1f5f9' }
          },
          x: {
            grid: { display: false }
          }
        }
      }
    });
  }

  // 2. Status Doughnut Chart (Success vs Failed vs Pending)
  const successCount = recharges.filter(r => r.status === 'SUCCESS').length;
  const failedCount = recharges.filter(r => r.status === 'FAILED').length;
  const pendingCount = recharges.filter(r => r.status === 'PENDING').length;

  const ctxStatus = document.getElementById('statusChart');
  if (ctxStatus) {
    if (charts.status) charts.status.destroy();
    charts.status = new Chart(ctxStatus, {
      type: 'doughnut',
      data: {
        labels: ['Success', 'Pending', 'Failed'],
        datasets: [{
          data: [successCount, pendingCount, failedCount],
          backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
          borderWidth: 2,
          borderColor: '#ffffff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { font: { family: 'Plus Jakarta Sans', weight: '600' } }
          }
        },
        cutout: '68%'
      }
    });
  }

  // 3. Operator Bar Chart
  const operatorDistribution = { Jio: 0, Airtel: 0, Vi: 0, BSNL: 0 };
  recharges.forEach(r => {
    const op = r.operator || 'Jio';
    operatorDistribution[op] = (operatorDistribution[op] || 0) + 1;
  });

  const ctxOp = document.getElementById('operatorChart');
  if (ctxOp) {
    if (charts.operator) charts.operator.destroy();
    charts.operator = new Chart(ctxOp, {
      type: 'bar',
      data: {
        labels: Object.keys(operatorDistribution),
        datasets: [{
          label: 'Recharges',
          data: Object.values(operatorDistribution),
          backgroundColor: ['#0a2885', '#e11900', '#c41230', '#0284c7'],
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { stepSize: 1 },
            grid: { color: '#f1f5f9' }
          },
          x: {
            grid: { display: false }
          }
        }
      }
    });
  }

  // 4. Payment Method Doughnut Chart
  const paymentDistribution = { UPI: 0, Cash: 0, 'Debit Card': 0, 'Net Banking': 0 };
  recharges.forEach(r => {
    const pm = r.paymentMethod || 'UPI';
    paymentDistribution[pm] = (paymentDistribution[pm] || 0) + 1;
  });

  const ctxPay = document.getElementById('paymentChart');
  if (ctxPay) {
    if (charts.payment) charts.payment.destroy();
    charts.payment = new Chart(ctxPay, {
      type: 'doughnut',
      data: {
        labels: Object.keys(paymentDistribution),
        datasets: [{
          data: Object.values(paymentDistribution),
          backgroundColor: ['#2563eb', '#10b981', '#7c3aed', '#0284c7'],
          borderWidth: 2,
          borderColor: '#ffffff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { font: { family: 'Plus Jakarta Sans', weight: '600' } }
          }
        },
        cutout: '65%'
      }
    });
  }
}

// ==================== 12. RECEIPT SLIP MODAL & PRINTING ====================
window.openReceiptModal = function(id) {
  const item = recharges.find(r => r.id === id);
  if (!item) return;

  el.receiptShopName.textContent = currentSettings.shopName;
  el.receiptShopAddress.textContent = currentSettings.address;
  el.receiptShopContact.textContent = currentSettings.contactPhone;

  el.rcTxnId.textContent = item.id;
  el.rcDateTime.textContent = formatDateTime(item.timestamp);
  el.rcCustomer.textContent = item.customerName;
  el.rcMobile.textContent = `+91 ${item.mobileNumber}`;
  el.rcOperator.textContent = item.operator;
  el.rcPlan.textContent = item.planDetails;
  el.rcPayment.textContent = item.paymentMethod;
  el.rcAmount.textContent = `₹${formatCurrency(item.amount)}`;
  el.rcBarcodeNum.textContent = `*${item.id}*`;

  // Status Badge in receipt
  const st = item.status.toUpperCase();
  el.receiptStatusBadge.textContent = st;
  if (st === 'SUCCESS') {
    el.receiptStatusBadge.style.background = '#ecfdf5';
    el.receiptStatusBadge.style.color = '#047857';
    el.receiptStatusBadge.style.borderColor = '#a7f3d0';
  } else if (st === 'PENDING') {
    el.receiptStatusBadge.style.background = '#fffbeb';
    el.receiptStatusBadge.style.color = '#b45309';
    el.receiptStatusBadge.style.borderColor = '#fde68a';
  } else {
    el.receiptStatusBadge.style.background = '#fef2f2';
    el.receiptStatusBadge.style.color = '#b91c1c';
    el.receiptStatusBadge.style.borderColor = '#fecaca';
  }

  el.viewModal.classList.add('show');
};

function printReceiptSlip() {
  window.print();
}

// ==================== 13. SETTINGS & BACKUPS ====================
function populateSettingsForm() {
  el.settingShopName.value = currentSettings.shopName;
  el.settingOwnerName.value = currentSettings.ownerName;
  el.settingContactPhone.value = currentSettings.contactPhone;
  el.settingShopAddress.value = currentSettings.address;
  el.settingUpiId.value = currentSettings.upiId;
}

function handleSettingsSubmit(e) {
  e.preventDefault();
  currentSettings.shopName = el.settingShopName.value.trim() || defaultSettings.shopName;
  currentSettings.ownerName = el.settingOwnerName.value.trim() || defaultSettings.ownerName;
  currentSettings.contactPhone = el.settingContactPhone.value.trim() || defaultSettings.contactPhone;
  currentSettings.address = el.settingShopAddress.value.trim() || defaultSettings.address;
  currentSettings.upiId = el.settingUpiId.value.trim() || defaultSettings.upiId;

  saveSettings();
  showToast('Shop configuration saved successfully!', 'success', 'Settings Saved');
}

function downloadJsonBackup() {
  const backupObject = {
    app: 'SmartRecharge',
    version: '2.0',
    exportDate: new Date().toISOString(),
    settings: currentSettings,
    recharges: recharges
  };

  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupObject, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `smart_recharge_backup_${formatDateOnly(new Date().toISOString())}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();

  showToast('Full database JSON backup downloaded', 'success', 'Backup Exported');
}

function loadDemoDataset() {
  recharges = [...sampleDataset];
  saveRecharges();
  showToast('Sample presentation dataset loaded successfully!', 'success', 'Demo Data Ready');
  renderDashboard();
  renderHistory();
  renderCustomers();
  renderReports();
}

function resetAllStorageData() {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(SETTINGS_KEY);
  recharges = [];
  currentSettings = { ...defaultSettings };
  saveSettings();
  saveRecharges();

  el.resetDbModal.classList.remove('show');
  showToast('Storage wiped clean. Ready for fresh records.', 'warning', 'Reset Completed');
  renderDashboard();
  renderHistory();
  renderCustomers();
  renderReports();
}

// ==================== 14. GLOBAL SEARCH ====================
function handleGlobalSearch(e) {
  const query = e.target.value.trim();
  if (!query) return;

  if (e.key === 'Enter') {
    switchPage('history');
    el.historySearchInput.value = query;
    renderHistory();
    showToast(`Searching history for "${query}"`, 'info');
  }
}

// ==================== 15. UTILITIES ====================
function escapeHtml(string) {
  if (string === null || string === undefined) return '';
  return String(string)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ==================== 16. EVENT LISTENERS ====================
function attachEventListeners() {
  // Navigation
  el.navLinks.forEach(link => {
    link.addEventListener('click', () => {
      const page = link.dataset.page;
      switchPage(page);
    });
  });

  // Mobile drawer
  el.hamburgerBtn.addEventListener('click', openMobileSidebar);
  el.sidebarCloseBtn.addEventListener('click', closeMobileSidebar);
  el.sidebarBackdrop.addEventListener('click', closeMobileSidebar);

  // Quick Action Buttons
  el.sidebarQuickRechargeBtn.addEventListener('click', () => {
    resetRechargeForm();
    switchPage('add-recharge');
  });

  el.btnDashNewRecharge.addEventListener('click', () => {
    resetRechargeForm();
    switchPage('add-recharge');
  });

  el.btnHistoryNewRecharge.addEventListener('click', () => {
    resetRechargeForm();
    switchPage('add-recharge');
  });

  el.btnCancelAddRecharge.addEventListener('click', () => {
    switchPage('dashboard');
  });

  el.btnViewAllHistory.addEventListener('click', () => {
    switchPage('history');
  });

  el.btnExportData.addEventListener('click', exportRechargesToCSV);
  el.btnExportCSV.addEventListener('click', exportRechargesToCSV);

  // Form
  el.rechargeForm.addEventListener('submit', handleRechargeSubmit);
  el.btnResetForm.addEventListener('click', resetRechargeForm);
  setupFormInteractiveCards();

  // History Filters
  el.historySearchInput.addEventListener('input', renderHistory);
  el.historyOperatorFilter.addEventListener('change', renderHistory);
  el.historyStatusFilter.addEventListener('change', renderHistory);
  el.historyDateFilter.addEventListener('change', renderHistory);
  el.btnResetFilters.addEventListener('click', clearAllHistoryFilters);
  el.btnClearHistorySearch.addEventListener('click', clearAllHistoryFilters);

  // Customers Search
  el.customerSearchInput.addEventListener('input', renderCustomers);

  // Reports
  el.btnPrintReport.addEventListener('click', () => window.print());

  // Settings
  el.settingsForm.addEventListener('submit', handleSettingsSubmit);
  el.btnDownloadJsonBackup.addEventListener('click', downloadJsonBackup);
  el.btnLoadDemoDataset.addEventListener('click', loadDemoDataset);
  el.btnClearAllStorage.addEventListener('click', () => {
    el.resetDbModal.classList.add('show');
  });

  // Modals Close handlers
  el.closeViewModal.addEventListener('click', () => el.viewModal.classList.remove('show'));
  el.btnCloseViewModal.addEventListener('click', () => el.viewModal.classList.remove('show'));
  el.btnPrintSlipBtn.addEventListener('click', printReceiptSlip);

  el.closeCustModal.addEventListener('click', () => el.customerModal.classList.remove('show'));
  el.btnCloseCustModal.addEventListener('click', () => el.customerModal.classList.remove('show'));

  el.btnCancelDelete.addEventListener('click', () => {
    el.deleteModal.classList.remove('show');
    pendingDeleteId = null;
  });
  el.btnConfirmDelete.addEventListener('click', confirmDeleteRecharge);

  el.btnCancelResetDb.addEventListener('click', () => el.resetDbModal.classList.remove('show'));
  el.btnConfirmResetDb.addEventListener('click', resetAllStorageData);

  // Close modals when clicking backdrop
  [el.viewModal, el.customerModal, el.deleteModal, el.resetDbModal].forEach(modal => {
    modal.addEventListener('click', e => {
      if (e.target === modal) modal.classList.remove('show');
    });
  });

  // Notification button dropdown
  el.notificationBtn.addEventListener('click', e => {
    e.stopPropagation();
    el.notifPanel.classList.toggle('show');
  });

  document.addEventListener('click', e => {
    if (!el.notificationBtn.contains(e.target) && !el.notifPanel.contains(e.target)) {
      el.notifPanel.classList.remove('show');
    }
  });

  // Global search input
  el.globalSearchInput.addEventListener('keydown', handleGlobalSearch);

  // Keyboard shortcut CMD+K or Ctrl+K to search
  document.addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      el.globalSearchInput.focus();
    }
    // Escape to close modals
    if (e.key === 'Escape') {
      [el.viewModal, el.customerModal, el.deleteModal, el.resetDbModal].forEach(m => m.classList.remove('show'));
      el.notifPanel.classList.remove('show');
      closeMobileSidebar();
    }
  });
}

// ==================== 17. APP STARTUP ====================
document.addEventListener('DOMContentLoaded', () => {
  initStorage();
  updateHeaderDate();
  attachEventListeners();
  renderDashboard();
  updateLivePreviewSlip();
});
