document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const errorMessage = document.getElementById('error-message');
    const taskList = document.getElementById('task-list');
    const noTasksMessage = document.getElementById('no-tasks-message');
    const taskStats = document.getElementById('task-stats');
    const filterButtons = document.getElementById('filter-buttons');
    const exportBtn = document.getElementById('export-btn');
    const clearAllBtn = document.getElementById('clear-all-btn');
    const confirmationModal = document.getElementById('confirmation-modal');
    const confirmClearBtn = document.getElementById('confirm-clear');
    const cancelClearBtn = document.getElementById('cancel-clear');

    // --- State ---
    let state = {
        tasks: [],
        filter: 'all', // 'all', 'active', 'completed'
    };

    // --- Persistence ---
    const saveState = () => {
        try {
            localStorage.setItem('taskflow_state', JSON.stringify(state));
        } catch (e) {
            console.error("Error saving to localStorage", e);
            alert("Could not save tasks. Your browser's storage might be full.");
        }
    };

    const loadState = () => {
        try {
            const savedState = localStorage.getItem('taskflow_state');
            if (savedState) {
                state = JSON.parse(savedState);
            }
        } catch (e) {
            console.error("Error loading from localStorage", e);
            state = { tasks: [], filter: 'all' };
        }
    };

    // --- Rendering ---
    const render = () => {
        taskList.innerHTML = '';

        const filteredTasks = state.tasks.filter(task => {
            if (state.filter === 'active') return !task.completed;
            if (state.filter === 'completed') return task.completed;
            return true;
        }).sort((a, b) => a.order - b.order);

        if (filteredTasks.length === 0) {
            noTasksMessage.classList.remove('hidden');
            taskStats.classList.add('hidden');
        } else {
            noTasksMessage.classList.add('hidden');
            taskStats.classList.remove('hidden');
            filteredTasks.forEach(task => {
                const taskElement = createTaskElement(task);
                taskList.appendChild(taskElement);
            });
        }

        updateStats();
        updateFilterButtons();
        saveState();
    };

    const createTaskElement = (task) => {
        const li = document.createElement('li');
        li.className = `flex items-center justify-between bg-surface-light p-4 rounded-lg shadow transition-all duration-300 animate-fadeIn`;
        li.dataset.id = task.id;
        li.draggable = true;

        li.innerHTML = `
            <div class="flex items-center gap-4 flex-grow min-w-0">
                <input type="checkbox" class="task-checkbox flex-shrink-0" ${task.completed ? 'checked' : ''} aria-checked="${task.completed}" aria-label="Mark task as ${task.completed ? 'incomplete' : 'complete'}">
                <span class="task-text truncate" title="${task.text}">${task.text}</span>
                <input type="text" class="task-edit-input bg-transparent border-b-2 border-primary focus:outline-none hidden w-full">
            </div>
            <div class="flex items-center gap-2 flex-shrink-0 ml-4">
                <button class="remove-btn text-text-secondary hover:text-error transition-colors" aria-label="Remove task">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                </button>
            </div>
        `;

        if (task.completed) {
            li.querySelector('.task-text').classList.add('line-through', 'opacity-50');
        }

        return li;
    };

    const updateStats = () => {
        const totalTasks = state.tasks.length;
        const completedTasks = state.tasks.filter(t => t.completed).length;
        taskStats.textContent = `Tasks: ${totalTasks} (${completedTasks} completed)`;
    };

    const updateFilterButtons = () => {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.toggle('active-filter', btn.dataset.filter === state.filter);
        });
    };

    // --- Event Handlers ---
    const handleAddTask = (e) => {
        e.preventDefault();
        const text = taskInput.value.trim();
        if (text === '') {
            errorMessage.textContent = 'Task cannot be empty.';
            setTimeout(() => errorMessage.textContent = '', 3000);
            return;
        }
        
        const newTask = {
            id: Date.now().toString(),
            text,
            completed: false,
            order: state.tasks.length,
        };
        state.tasks.push(newTask);
        taskInput.value = '';
        render();
    };

    const handleTaskListClick = (e) => {
        const target = e.target;
        const taskElement = target.closest('li');
        if (!taskElement) return;
        const taskId = taskElement.dataset.id;

        // Toggle complete
        if (target.classList.contains('task-checkbox')) {
            const task = state.tasks.find(t => t.id === taskId);
            task.completed = !task.completed;
            render();
        }

        // Remove task
        if (target.closest('.remove-btn')) {
            taskElement.classList.add('animate-fadeOut');
            taskElement.addEventListener('animationend', () => {
                state.tasks = state.tasks.filter(t => t.id !== taskId);
                render();
            }, { once: true });
        }

        // Edit task
        if (target.classList.contains('task-text')) {
            enterEditMode(taskElement);
        }
    };

    const enterEditMode = (taskElement) => {
        const textSpan = taskElement.querySelector('.task-text');
        const editInput = taskElement.querySelector('.task-edit-input');
        
        textSpan.classList.add('hidden');
        editInput.classList.remove('hidden');
        editInput.value = textSpan.textContent;
        editInput.focus();
        editInput.select();

        const saveChanges = () => {
            const newText = editInput.value.trim();
            const taskId = taskElement.dataset.id;
            const task = state.tasks.find(t => t.id === taskId);

            if (newText && newText !== task.text) {
                task.text = newText;
            }
            render();
        };

        editInput.addEventListener('blur', saveChanges, { once: true });
        editInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') editInput.blur();
            if (e.key === 'Escape') {
                editInput.removeEventListener('blur', saveChanges);
                render();
            }
        });
    };

    const handleFilterChange = (e) => {
        if (e.target.matches('[data-filter]')) {
            state.filter = e.target.dataset.filter;
            render();
        }
    };

    const handleExport = () => {
        const incompleteTasks = state.tasks.filter(t => !t.completed).map(t => `- ${t.text}`).join('\n');
        const completedTasks = state.tasks.filter(t => t.completed).map(t => `- ${t.text}`).join('\n');

        const fileContent = `Todo List Export - ${new Date().toLocaleString()}\n\n` +
                          `--- Incomplete Tasks ---\n${incompleteTasks || 'None'}\n\n` +
                          `--- Completed Tasks ---\n${completedTasks || 'None'}`;
        
        const blob = new Blob([fileContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const date = new Date().toISOString().slice(0, 10);
        a.href = url;
        a.download = `Todo_List_${date}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleClearAll = () => {
        confirmationModal.classList.remove('hidden');
    };

    const confirmClear = () => {
        state.tasks = [];
        confirmationModal.classList.add('hidden');
        render();
    };

    const cancelClear = () => {
        confirmationModal.classList.add('hidden');
    };

    // --- Drag and Drop ---
    let draggedItemId = null;

    taskList.addEventListener('dragstart', (e) => {
        draggedItemId = e.target.dataset.id;
        setTimeout(() => e.target.classList.add('dragging'), 0);
    });

    taskList.addEventListener('dragend', (e) => {
        e.target.classList.remove('dragging');
        draggedItemId = null;
    });

    taskList.addEventListener('dragover', (e) => {
        e.preventDefault();
        const afterElement = getDragAfterElement(taskList, e.clientY);
        const draggable = document.querySelector('.dragging');
        if (afterElement == null) {
            taskList.appendChild(draggable);
        } else {
            taskList.insertBefore(draggable, afterElement);
        }
    });
    
    taskList.addEventListener('drop', (e) => {
        e.preventDefault();
        const droppedOnElement = e.target.closest('li');
        if (!droppedOnElement || droppedOnElement.dataset.id === draggedItemId) return;

        const draggedIndex = state.tasks.findIndex(t => t.id === draggedItemId);
        const droppedOnIndex = state.tasks.findIndex(t => t.id === droppedOnElement.dataset.id);

        const [draggedItem] = state.tasks.splice(draggedIndex, 1);
        state.tasks.splice(droppedOnIndex, 0, draggedItem);

        state.tasks.forEach((task, index) => {
            task.order = index;
        });

        render();
    });

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('li:not(.dragging)')];
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    // --- Initial Setup ---
    const init = () => {
        loadState();
        render();

        taskForm.addEventListener('submit', handleAddTask);
        taskList.addEventListener('click', handleTaskListClick);
        filterButtons.addEventListener('click', handleFilterChange);
        exportBtn.addEventListener('click', handleExport);
        clearAllBtn.addEventListener('click', handleClearAll);
        confirmClearBtn.addEventListener('click', confirmClear);
        cancelClearBtn.addEventListener('click', cancelClear);
    };

    init();
});
