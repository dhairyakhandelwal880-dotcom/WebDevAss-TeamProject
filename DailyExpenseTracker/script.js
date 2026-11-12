const STORAGE_KEY = "daily_expense_tracker_v1";

// State
let expenses = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

// DOM Elements
const expenseForm = document.getElementById("expenseForm");
const expenseIdInput = document.getElementById("expenseId");
const expenseNameInput = document.getElementById("expenseName");
const expenseCategoryInput = document.getElementById("expenseCategory");
const expenseAmountInput = document.getElementById("expenseAmount");
const expenseDateInput = document.getElementById("expenseDate");
const expenseDescriptionInput = document.getElementById("expenseDescription");
const formError = document.getElementById("formError");
const formTitle = document.getElementById("formTitle");
const editBadge = document.getElementById("editBadge");
const submitBtn = document.getElementById("submitBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");

const totalAmountEl = document.getElementById("totalAmount");
const totalCountEl = document.getElementById("totalCount");
const highestExpenseAmountEl = document.getElementById("highestExpenseAmount");
const highestExpenseNameEl = document.getElementById("highestExpenseName");
const topCategoryNameEl = document.getElementById("topCategoryName");
const topCategoryAmountEl = document.getElementById("topCategoryAmount");
const averageExpenseEl = document.getElementById("averageExpense");

const categoryBreakdownEl = document.getElementById("categoryBreakdown");
const expenseTableBody = document.getElementById("expenseTableBody");
const emptyListMessage = document.getElementById("emptyListMessage");

const searchInput = document.getElementById("searchInput");
const filterCategory = document.getElementById("filterCategory");
const filterDate = document.getElementById("filterDate");
const resetFiltersBtn = document.getElementById("resetFiltersBtn");
const seedDemoBtn = document.getElementById("seedDemoBtn");
const clearAllBtn = document.getElementById("clearAllBtn");

// Initialize default date to today
function setDefaultDate() {
  const today = new Date().toISOString().split("T")[0];
  expenseDateInput.value = today;
}

function saveToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
}

function formatCurrency(amount) {
  return `₹${Number(amount).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// Form Validation & Submission
expenseForm.addEventListener("submit", (e) => {
  e.preventDefault();
  formError.textContent = "";

  const name = expenseNameInput.value.trim();
  const category = expenseCategoryInput.value;
  const amount = parseFloat(expenseAmountInput.value);
  const date = expenseDateInput.value;
  const description = expenseDescriptionInput.value.trim();
  const editId = expenseIdInput.value;

  if (!name) {
    formError.textContent = "Please enter an expense name.";
    return;
  }
  if (!category) {
    formError.textContent = "Please select an expense category.";
    return;
  }
  if (isNaN(amount) || amount <= 0) {
    formError.textContent = "Please enter a valid amount greater than zero.";
    return;
  }
  if (!date) {
    formError.textContent = "Please select a valid date.";
    return;
  }

  if (editId) {
    // Update existing record
    expenses = expenses.map((item) =>
      item.id === editId ? { ...item, name, category, amount, date, description } : item
    );
    resetFormMode();
  } else {
    // Add new record at the top
    const newExpense = {
      id: Date.now().toString(),
      name,
      category,
      amount,
      date,
      description,
    };
    expenses.unshift(newExpense);
  }

  saveToStorage();
  expenseForm.reset();
  setDefaultDate();
  renderAll();
});

// Edit Mode Helpers
function startEditExpense(id) {
  const target = expenses.find((item) => item.id === id);
  if (!target) return;

  expenseIdInput.value = target.id;
  expenseNameInput.value = target.name;
  expenseCategoryInput.value = target.category;
  expenseAmountInput.value = target.amount;
  expenseDateInput.value = target.date;
  expenseDescriptionInput.value = target.description || "";

  formTitle.textContent = "Edit Expense";
  editBadge.classList.remove("hidden");
  submitBtn.textContent = "Save Changes";
  cancelEditBtn.classList.remove("hidden");
  formError.textContent = "";
  expenseNameInput.focus();
}

function resetFormMode() {
  expenseIdInput.value = "";
  formTitle.textContent = "Add New Expense";
  editBadge.classList.add("hidden");
  submitBtn.textContent = "Add Expense";
  cancelEditBtn.classList.add("hidden");
  formError.textContent = "";
}

cancelEditBtn.addEventListener("click", () => {
  resetFormMode();
  expenseForm.reset();
  setDefaultDate();
});

// Delete Record
function deleteExpense(id) {
  if (!confirm("Are you sure you want to delete this expense?")) return;
  expenses = expenses.filter((item) => item.id !== id);
  if (expenseIdInput.value === id) {
    resetFormMode();
    expenseForm.reset();
    setDefaultDate();
  }
  saveToStorage();
  renderAll();
}

// Render Summary Dashboard Cards
function renderSummary() {
  const count = expenses.length;
  const total = expenses.reduce((sum, item) => sum + item.amount, 0);

  totalAmountEl.textContent = formatCurrency(total);
  totalCountEl.textContent = `${count} recorded ${count === 1 ? "expense" : "expenses"}`;

  if (count === 0) {
    highestExpenseAmountEl.textContent = "₹0.00";
    highestExpenseNameEl.textContent = "No records yet";
    topCategoryNameEl.textContent = "—";
    topCategoryAmountEl.textContent = "₹0.00 spent";
    averageExpenseEl.textContent = "₹0.00";
    return;
  }

  // Highest individual expense
  const highest = expenses.reduce((max, item) => (item.amount > max.amount ? item : max), expenses[0]);
  highestExpenseAmountEl.textContent = formatCurrency(highest.amount);
  highestExpenseNameEl.textContent = `${highest.name} (${highest.category})`;

  // Category totals
  const categoryTotals = {};
  expenses.forEach((item) => {
    categoryTotals[item.category] = (categoryTotals[item.category] || 0) + item.amount;
  });

  const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];
  topCategoryNameEl.textContent = topCategory[0];
  topCategoryAmountEl.textContent = `${formatCurrency(topCategory[1])} spent`;

  // Average
  averageExpenseEl.textContent = formatCurrency(total / count);
}

// Render Category-wise Visual Bar Chart
function renderCategoryBreakdown() {
  if (expenses.length === 0) {
    categoryBreakdownEl.innerHTML =
      '<p class="empty-state">Add expenses to view category distribution.</p>';
    return;
  }

  const total = expenses.reduce((sum, item) => sum + item.amount, 0);
  const categoryTotals = {};

  expenses.forEach((item) => {
    categoryTotals[item.category] = (categoryTotals[item.category] || 0) + item.amount;
  });

  const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);

  categoryBreakdownEl.innerHTML = sortedCategories
    .map(([category, amount]) => {
      const percentage = total > 0 ? ((amount / total) * 100).toFixed(1) : 0;
      return `
        <div class="category-item">
          <div class="category-item-header">
            <span>${escapeHTML(category)}</span>
            <span>${formatCurrency(amount)} (${percentage}%)</span>
          </div>
          <div class="progress-track">
            <div class="progress-fill" style="width: ${percentage}%"></div>
          </div>
        </div>
      `;
    })
    .join("");
}

// Render Filtered Expense Table
function renderExpenseList() {
  const query = searchInput.value.trim().toLowerCase();
  const selectedCategory = filterCategory.value;
  const selectedDate = filterDate.value;

  const filtered = expenses.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(query) ||
      (item.description && item.description.toLowerCase().includes(query));
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesDate = !selectedDate || item.date === selectedDate;
    return matchesSearch && matchesCategory && matchesDate;
  });

  if (filtered.length === 0) {
    expenseTableBody.innerHTML = "";
    emptyListMessage.classList.remove("hidden");
    return;
  }

  emptyListMessage.classList.add("hidden");
  expenseTableBody.innerHTML = filtered
    .map(
      (item) => `
      <tr>
        <td>
          <span class="expense-title">${escapeHTML(item.name)}</span>
          ${
            item.description
              ? `<span class="expense-desc">${escapeHTML(item.description)}</span>`
              : ""
          }
        </td>
        <td><span class="category-pill">${escapeHTML(item.category)}</span></td>
        <td>${escapeHTML(item.date)}</td>
        <td class="text-right amount-cell">${formatCurrency(item.amount)}</td>
        <td class="text-center">
          <div class="action-btns">
            <button type="button" class="icon-btn edit" onclick="startEditExpense('${item.id}')">Edit</button>
            <button type="button" class="icon-btn delete" onclick="deleteExpense('${item.id}')">Delete</button>
          </div>
        </td>
      </tr>
    `
    )
    .join("");
}

function renderAll() {
  renderSummary();
  renderCategoryBreakdown();
  renderExpenseList();
}

// Filter Events
searchInput.addEventListener("input", renderExpenseList);
filterCategory.addEventListener("change", renderExpenseList);
filterDate.addEventListener("change", renderExpenseList);

resetFiltersBtn.addEventListener("click", () => {
  searchInput.value = "";
  filterCategory.value = "All";
  filterDate.value = "";
  renderExpenseList();
});

// Demo Data & Clear All
seedDemoBtn.addEventListener("click", () => {
  const today = new Date().toISOString().split("T")[0];
  const sampleExpenses = [
    {
      id: (Date.now() + 1).toString(),
      name: "Lunch Combo",
      category: "Food",
      amount: 180,
      date: today,
      description: "Campus cafeteria meal",
    },
    {
      id: (Date.now() + 2).toString(),
      name: "Metro & Bus Pass",
      category: "Transportation",
      amount: 120,
      date: today,
      description: "Daily commute",
    },
    {
      id: (Date.now() + 3).toString(),
      name: "Data Structures Notebook",
      category: "Education",
      amount: 250,
      date: today,
      description: "Lab record & stationery",
    },
    {
      id: (Date.now() + 4).toString(),
      name: "Weekend Movie Ticket",
      category: "Entertainment",
      amount: 320,
      date: today,
      description: "Evening show",
    },
  ];
  expenses = [...sampleExpenses, ...expenses];
  saveToStorage();
  renderAll();
});

clearAllBtn.addEventListener("click", () => {
  if (expenses.length === 0) return;
  if (!confirm("Delete all recorded expenses?")) return;
  expenses = [];
  resetFormMode();
  saveToStorage();
  renderAll();
});

// Initial Load
setDefaultDate();
renderAll();