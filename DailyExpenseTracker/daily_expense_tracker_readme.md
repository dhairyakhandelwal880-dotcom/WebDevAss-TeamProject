# Daily Expense Tracker

A responsive web-based application built with **HTML5**, **CSS3**, and **Vanilla JavaScript** that helps users record, categorize, filter, and visualize their daily expenditure.

---

## Project Overview

Managing everyday spending manually is prone to oversight. The **Daily Expense Tracker** provides a clean, interactive dashboard where users can log expenses, organize them across 8 spending categories, monitor real-time financial summaries, and persist data locally in the browser without requiring any backend server or external libraries.

---

## Features

### Essential Features
- **Welcome & Spending Dashboard**: Displays real-time totals for total expenditure, recorded expense count, highest individual expense, top spending category, and average expense.
- **Add Expense Form with Validation**: Captures expense name, category, amount (`₹`), date, and optional notes while validating inputs before submission.
- **8 Expense Categories**: Organizes spending into *Food, Transportation, Shopping, Education, Entertainment, Healthcare, Bills,* and *Others*.
- **Expense History Table**: Displays all recorded transactions with the newest entries at the top.
- **Delete Functionality**: Removes individual records with confirmation and immediately recalculates all dashboard totals.

### Enhanced Features
- **Edit Expense Mode**: Populates existing expense details back into the form for quick updates.
- **Multi-Criteria Filtering & Search**: Filter expenses instantaneously by keyword search, category dropdown, or specific date.
- **Category-wise Visual Breakdown**: Dynamic progress bars illustrating percentage and rupee distribution per category.
- **Browser `localStorage` Persistence**: Automatically saves entries across page reloads, paired with a **Load Sample Data** button for instant testing.
- **Responsive Design**: Adapts seamlessly across desktop, tablet, and mobile viewports.

---

## Tech Stack

- **HTML5**: Semantic document structure, forms, and accessible dashboard layout.
- **CSS3**: Responsive CSS Grid/Flexbox layouts, custom properties, progress bars, and media queries.
- **JavaScript (ES6+)**: DOM manipulation, array/object state management, validation, filtering, and `localStorage` persistence.

---

## Project Structure

```text
daily-expense-tracker/
├── index.html      # Application markup, dashboard cards, form, and expense table
├── style.css       # Responsive styling, visual category bars, and layout rules
├── script.js       # CRUD operations, validation, analytics, and localStorage logic
└── README.md       # Project documentation and setup instructions
```

---

## Getting Started

### Prerequisites
- Any modern web browser (Google Chrome, Microsoft Edge, Mozilla Firefox, or Safari).
- Optional: Visual Studio Code with the Live Server extension.

### Installation & Usage
1. **Clone the repository**
   ```bash
   git clone https://github.com/<your-username>/<your-repo-name>.git
   cd <your-repo-name>
   ```
2. **Launch the application**
   - Double-click `index.html` to open it directly in your browser, **or**
   - Right-click `index.html` in VS Code and select **Open with Live Server**.
3. **Test quickly**
   - Click **Load Sample Data** in the top navigation bar to populate sample expenses and explore the charts and filters immediately.

---

## Team Division of Work (3 Members)

| Team Member | Git Branch | Responsibilities |
| :--- | :--- | :--- |
| **Member 1** | `feature/html-structure` | Dashboard layout, semantic HTML structure, expense input form, and filter controls (`index.html`) |
| **Member 2** | `feature/ui-styling` | CSS styling, summary cards, category progress bars, table layout, and responsive breakpoints (`style.css`) |
| **Member 3** | `feature/js-logic` | Form validation, CRUD operations, real-time analytics calculations, filtering, and `localStorage` (`script.js`) |

---

## Git Workflow Followed
1. Each team member created a dedicated feature branch from `main`.
2. Individual changes were committed incrementally with clear commit messages.
3. Pull Requests were opened, reviewed, and merged into `main` upon testing.