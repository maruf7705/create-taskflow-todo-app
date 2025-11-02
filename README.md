# TaskFlow ✨

A modern, feature-rich single-page todo list application built with pure Vanilla JavaScript, Tailwind CSS, and Vite. TaskFlow is designed for a seamless and intuitive user experience, focusing on performance and a clean, minimalist aesthetic.

![TaskFlow Application Screenshot](https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)
*A placeholder image representing a modern development workspace.*

---

## Features

TaskFlow is packed with features to enhance your productivity:

-   **📝 Full CRUD Functionality:** Add, edit, and delete tasks with ease.
-   **✅ Task Completion:** Mark tasks as complete with a satisfying visual cue.
-   **🔄 Smart Filtering:** Dynamically filter tasks by `All`, `Active`, and `Completed` states.
-   **↔️ Drag & Drop Reordering:** Intuitively reorder tasks to prioritize your workflow.
-   **💾 Persistent Storage:** All tasks are saved to your browser's `localStorage`, so your data is safe even after closing the tab.
-   **📥 Export to JSON:** Easily export all your tasks to a JSON file for backup or migration.
-   **🗑️ Safe Deletion:** A confirmation modal prevents accidental deletion of all tasks.
-   **📱 Fully Responsive:** A beautiful and functional interface on any device, from mobile phones to desktops.
-   **🛡️ Input Validation:** Prevents empty or duplicate tasks from being added.
-   **📊 Task Statistics:** See a live count of your active and completed tasks.
-   **🎨 Modern UI:** A sleek, dark-themed interface built with Tailwind CSS for a premium feel.

## Tech Stack

This project leverages a modern, lightweight tech stack for optimal performance and developer experience.

-   **Frontend:**
    -   **HTML5**
    -   **CSS3** with **[Tailwind CSS](https://tailwindcss.com/)** for utility-first styling.
    -   **JavaScript (ES6+)** for all application logic (no frameworks).
-   **Build Tool:**
    -   **[Vite](https://vitejs.dev/)** for lightning-fast development and optimized builds.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

-   Node.js (v18 or higher recommended)
-   npm or a compatible package manager

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    # This command is not available in the current environment.
    # git clone https://github.com/your-username/taskflow-todo-app.git
    ```

2.  **Navigate to the project directory:**
    ```sh
    cd taskflow-todo-app
    ```

3.  **Install NPM packages:**
    ```sh
    npm install
    ```

4.  **Run the development server:**
    ```sh
    npm run dev
    ```
    The application will be available at `http://localhost:5173` (or the next available port).

## Project Structure

The project follows a simple and organized structure:

```
/
├── public/
│   └── vite.svg      # Vite logo
├── src/
│   ├── main.js       # Main application logic
│   └── style.css     # Tailwind CSS directives and custom styles
├── .gitignore
├── index.html        # Main HTML entry point
├── package.json
├── postcss.config.js # PostCSS configuration
├── tailwind.config.js# Tailwind CSS configuration
├── README.md         # You are here!
└── vite.config.js    # Vite configuration
```

## License

Distributed under the MIT License. See `LICENSE` for more information.

---
