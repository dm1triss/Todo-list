document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.querySelector('#taskInput');
    const taskList = document.querySelector('#tasksList');
    const form = document.querySelector('#form');
    const emptyList = document.querySelector('#emptyList');
    const removeDoneTasksButton = document.querySelector('#removeDoneTasks');
    const clearAllTasksButton = document.querySelector('#clearAllTasks');
    const toggleThemeButton = document.querySelector('#toggleTheme');

    // Функция для сохранения задач в localStorage
    const saveTasks = () => {
        const tasks = [];
        taskList.querySelectorAll('.task-item').forEach(taskItem => {
            tasks.push({
                text: taskItem.querySelector('.task-title').textContent,
                time: taskItem.querySelector('.task-time').textContent,
                done: taskItem.querySelector('.task-title').classList.contains('task-title--done')
            });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    // Функция для загрузки задач из localStorage
    const loadTasks = () => {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => {
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item d-flex justify-content-between task-item';
            listItem.innerHTML = `
                <span class="task-title ${task.done ? 'task-title--done' : ''}">${task.text}</span>
                <span class="task-time">${task.time}</span>
                <div class="task-item__buttons">
                    <button type="button" data-action="done" class="btn-action">
                        <img src="./img/tick.svg" alt="Done" width="18" height="18">
                    </button>
                    <button type="button" data-action="delete" class="btn-action">
                        <img src="./img/cross.svg" alt="Delete" width="18" height="18">
                    </button>
                    <button type="button" data-action="edit" class="btn-action">
                        <img src="./img/edit.svg" alt="Edit" width="18" height="18">
                    </button>
                </div>
            `;
            taskList.appendChild(listItem);
        });
        if (tasks.length > 0) {
            emptyList.style.display = 'none';
        }
    };

    // Загрузка задач при загрузке страницы
    loadTasks();

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const taskText = taskInput.value.trim();
        if (taskText !== '') {
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item d-flex justify-content-between task-item';
            const currentTime = new Date().toLocaleString();
            listItem.innerHTML = `
                <span class="task-title">${taskText}</span>
                <span class="task-time">${currentTime}</span>
                <div class="task-item__buttons">
                    <button type="button" data-action="done" class="btn-action">
                        <img src="./img/tick.svg" alt="Done" width="18" height="18">
                    </button>
                    <button type="button" data-action="delete" class="btn-action">
                        <img src="./img/cross.svg" alt="Delete" width="18" height="18">
                    </button>
                    <button type="button" data-action="edit" class="btn-action">
                        <img src="./img/edit.svg" alt="Edit" width="18" height="18">
                    </button>
                </div>
            `;
            taskList.appendChild(listItem);
            taskInput.value = '';
            if (emptyList) {
                emptyList.style.display = 'none';
            }
            saveTasks();
        }
    });

    taskList.addEventListener('click', (event) => {
        if (event.target.dataset.action === 'delete') {
            const parentNode = event.target.closest('li');
            parentNode.remove();
            if (taskList.children.length === 1) {
                emptyList.style.display = 'flex';
            }
            saveTasks();
        } else if (event.target.dataset.action === 'done') {
            const parentNode = event.target.closest('li');
            parentNode.querySelector('.task-title').classList.toggle('task-title--done');
            saveTasks();
        } else if (event.target.dataset.action === 'edit') {
            const parentNode = event.target.closest('li');
            const taskTitle = parentNode.querySelector('.task-title');
            const newTaskText = prompt('Редактировать задачу', taskTitle.textContent);
            if (newTaskText !== null) {
                taskTitle.textContent = newTaskText;
                saveTasks();
            }
        }
    });

    removeDoneTasksButton.addEventListener('click', () => {
        const doneTasks = taskList.querySelectorAll('.task-title--done');
        doneTasks.forEach(task => {
            task.closest('li').remove();
        });
        if (taskList.children.length === 1) {
            emptyList.style.display = 'flex';
        }
        saveTasks();
    });

    // Логика для очистки всех задач
    clearAllTasksButton.addEventListener('click', () => {
        taskList.innerHTML = '';
        emptyList.style.display = 'flex';
        saveTasks();
    });

    // Переключение темы
    toggleThemeButton.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        document.body.classList.toggle('light-theme');
        localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
    });

    // Установка темы при загрузке страницы
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.classList.add(savedTheme + '-theme');
});