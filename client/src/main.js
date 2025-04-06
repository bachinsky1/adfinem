import api from './api.js'

const app = document.getElementById('app')

const showLoading = () => {
    const container = document.getElementById('dashboard-content')
    if (container) {
        container.innerHTML =
        '<p class="text-center text-sm text-gray-500">Loading...</p>'
    } else {
        app.innerHTML =
        '<p class="text-center text-sm text-gray-500 mt-10">Loading...</p>'
    }
}

const renderLogin = () => {
    app.innerHTML = `
    <div class="card max-w-md mx-auto mt-4">
        <h1 class="text-2xl font-bold mb-4 text-center text-gray-900 dark:text-white">Login</h1>
        <div id="loginError" class="text-red-500 text-sm text-center mb-2"></div>
        <form id="loginForm" class="space-y-4">
        <input type="email" placeholder="Email" class="input bg-white text-black dark:bg-gray-900 dark:text-white" required />
        <input type="password" placeholder="Password" class="input bg-white text-black dark:bg-gray-900 dark:text-white" required />
        <button type="submit" class="btn w-full">Login</button>
        </form>
        <p class="text-sm text-center mt-4">
        Don't have an account? <a href="#" id="toRegister" class="text-blue-500 hover:underline">Register</a>
        </p>
        <p class="text-sm text-center mt-2">
            View <a href="http://localhost:8000/api/documentation" target="_blank" class="text-blue-500 hover:underline">API Docs</a>
        </p>
    </div>
    `

    document.getElementById('loginForm').onsubmit = async e => {
        e.preventDefault()
        showLoading()
        const [email, password] = Array.from(e.target.elements).map(el => el.value)
        const res = await api.login(email, password)
        if (res.token) {
            api.setToken(res.token)
            renderDashboard('tasks')
        } else {
            renderLogin()
            const errorEl = document.getElementById('loginError')
            errorEl.innerHTML = ''

            if (res.message) {
                errorEl.innerHTML += `<p>${res.message}</p>`
            }

            if (res.error) {
                errorEl.innerHTML += `<p>${res.error}</p>`
            }

            if (res.errors) {
                for (const field in res.errors) {
                    res.errors[field].forEach(msg => {
                        errorEl.innerHTML += `<p>${msg}</p>`
                    })
                }
            }
        }
    }

    document.getElementById('toRegister').onclick = e => {
        e.preventDefault()
        renderRegister()
    }
}

const renderRegister = () => {
    app.innerHTML = `
      <div class="card max-w-md mx-auto mt-4">
        <h1 class="text-2xl font-bold mb-4 text-center text-gray-900 dark:text-white">Register</h1>
        <div id="registerError" class="text-red-500 text-sm text-center mb-2"></div>
        <form id="registerForm" class="space-y-4">
          <input type="text" placeholder="Name" class="input bg-white text-black dark:bg-gray-900 dark:text-white" required />
          <input type="email" placeholder="Email" class="input bg-white text-black dark:bg-gray-900 dark:text-white" required />
          <input type="password" placeholder="Password" class="input bg-white text-black dark:bg-gray-900 dark:text-white" required />
          <button type="submit" class="btn w-full">Register</button>
        </form>
        <p class="text-sm text-center mt-4">
          Already have an account? <a href="#" id="toLogin" class="text-blue-500 hover:underline">Login</a>
        </p>
        <p class="text-sm text-center mt-2">
            View <a href="http://localhost:8000/api/documentation" target="_blank" class="text-blue-500 hover:underline">API Docs</a>
        </p>
      </div>
    `

    document.getElementById('registerForm').onsubmit = async e => {
        e.preventDefault()
        const [name, email, password] = Array.from(e.target.elements).map( el => el.value )
        showLoading()
        const res = await api.register(name, email, password)
        if (res.token) {
            api.setToken(res.token)
            renderDashboard('tasks')
        } else {
            renderRegister()
            const errorEl = document.getElementById('registerError')
            errorEl.innerHTML = ''

            if (res.message) {
                errorEl.innerHTML += `<p>${res.message}</p>`
            }

            if (res.errors) {
                for (const field in res.errors) {
                    res.errors[field].forEach(msg => {
                        errorEl.innerHTML += `<p>${msg}</p>`
                    })
                }
            }
        }
    }

    document.getElementById('toLogin').onclick = e => {
        e.preventDefault()
        renderLogin()
    }
}

const renderDashboard = async (view = 'tasks') => {
    showLoading()
    const me = await api.me()

    if (!me || me.error || !me.name) {
        api.removeToken()
        renderLogin()
        return
    }

    const tasks = await api.getTasks()

    app.innerHTML = `
        <div class="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <header class="bg-white dark:bg-gray-800 shadow p-4 flex justify-between items-center">
            <h1 class="text-2xl font-bold">Task Dashboard — ${me.name}, ${
        me.email
    }</h1>
            <button id="logoutBtn" class="text-red-500 hover:text-red-700 text-sm">🚪 Logout</button>
        </header>

        <div class="flex flex-1">
            <aside class="w-64 bg-gray-200 dark:bg-gray-800 p-4 flex flex-col justify-between">
            <nav class="space-y-2">
                <a href="#" class="block px-2 py-1 rounded hover:bg-gray-300 dark:hover:bg-gray-700" id="link-tasks">📋 All Tasks</a>
                <a href="#" class="block px-2 py-1 rounded hover:bg-gray-300 dark:hover:bg-gray-700" id="link-create">➕ Add Task</a>
                <a href="#" class="block px-2 py-1 rounded hover:bg-gray-300 dark:hover:bg-gray-700" id="link-edit">✏️ Edit Task</a>
            </nav>
            <div class="mt-6">
                <a href="http://localhost:8000/api/documentation" target="_blank" class="block px-2 py-1 rounded hover:bg-gray-300 dark:hover:bg-gray-700">
                📚 API Docs
                </a>
            </div>
            </aside>
            <main class="flex-1 p-6" id="dashboard-content"></main>
        </div>

        <footer class="bg-gray-100 dark:bg-gray-800 text-center py-4 text-sm text-gray-500 dark:text-gray-400">
            © ${new Date().getFullYear()} Task Manager
        </footer>
        </div>
    `

    document.getElementById('logoutBtn').onclick = () => {
        api.removeToken()
        location.reload()
    }

    document.getElementById('link-tasks').onclick = e => {
        e.preventDefault()
        renderDashboard('tasks')
    }
    document.getElementById('link-create').onclick = e => {
        e.preventDefault()
        renderDashboard('create')
    }
    document.getElementById('link-edit').onclick = e => {
        e.preventDefault()
        renderDashboard('edit')
    }

    view === 'create'
        ? renderCreateTaskContent()
        : view === 'edit'
        ? renderEditTaskContent(tasks)
        : renderTasksContent(tasks)
}

const renderTasksContent = tasks => {
    const container = document.getElementById('dashboard-content')

    if (!tasks.length) {
        container.innerHTML = `
            <div class="text-center text-gray-500 text-sm">
            No tasks found.
            </div>
        `
        return
    }

    container.innerHTML = `
        <ul class="space-y-2">
            ${tasks
            .map(
                t => `
            <li class="bg-white dark:bg-gray-800 p-3 shadow rounded cursor-pointer group task-item" data-id="${
                t.id
            }">
                <div class="flex justify-between items-center">
                <div>
                    <div class="font-semibold text-lg">${t.title}</div>
                    <div class="text-sm text-gray-500 mt-1">
                    Created by: ${t.user?.name || 'Unknown'}<br/>
                    Created: ${formatDate(t.created_at)}<br/>
                    Updated: ${formatDate(t.updated_at)}
                    </div>
                </div>
                <button data-id="${
                    t.id
                }" class="text-red-500 hover:text-red-700 deleteBtn">✕</button>
                </div>
            </li>
            `
            )
            .join('')}
        </ul>
        `

    document.querySelectorAll('.task-item').forEach(item => {
        item.onclick = e => {
            if (e.target.classList.contains('deleteBtn')) return
            const task = tasks.find(t => t.id == item.dataset.id)
            renderTaskDetail(task)
        }
    })

    document.querySelectorAll('.deleteBtn').forEach(btn => {
        btn.onclick = async e => {
            e.stopPropagation()
            const confirmDelete = confirm(
                'Are you sure you want to delete this task?'
            )
            if (!confirmDelete) return

            showLoading()
            await api.deleteTask(btn.dataset.id)
            renderDashboard('tasks')
        }
    })
}

const renderCreateTaskContent = () => {
    const container = document.getElementById('dashboard-content')
    container.innerHTML = `
        <form id="taskForm" class="space-y-4 max-w-xl">
        <input type="text" placeholder="Title" class="input w-full" id="taskTitle" required />
        <textarea placeholder="Description" class="input w-full resize-none" id="taskDesc" rows="4"></textarea>
        <button class="btn">Create Task</button>
        </form>
    `

    document.getElementById('taskForm').onsubmit = async e => {
        e.preventDefault()
        const title = document.getElementById('taskTitle').value
        const description = document.getElementById('taskDesc').value
        showLoading()
        await api.addTask({ title, description })
        renderDashboard('tasks')
    }
}

const renderEditTaskContent = tasks => {
    const container = document.getElementById('dashboard-content')
    container.innerHTML = `
        <form id="editTaskForm" class="space-y-4 max-w-xl">
        <label class="block">
            <span class="block mb-1">Select a Task:</span>
            <select id="taskSelect" class="input bg-white dark:bg-gray-800 dark:text-white w-full">
            ${tasks
                .map(task => `<option value="${task.id}">${task.title}</option>`)
                .join('')}
            </select>
        </label>
        <label class="block">
            <span class="block mb-1">New Title:</span>
            <input type="text" id="newTitle" class="input bg-white dark:bg-gray-800 dark:text-white w-full" required />
        </label>
        <label class="block">
            <span class="block mb-1">Description:</span>
            <textarea id="newDescription" rows="4" class="input bg-white dark:bg-gray-800 dark:text-white w-full resize-none"></textarea>
        </label>
        <button type="submit" class="btn">💾 Save</button>
        </form>
    `

    const taskSelect = document.getElementById('taskSelect')
    const titleInput = document.getElementById('newTitle')
    const descInput = document.getElementById('newDescription')

    const fillFormFields = () => {
        const selectedTask = tasks.find(t => t.id == taskSelect.value)
        if (selectedTask) {
            titleInput.value = selectedTask.title
            descInput.value = selectedTask.description || ''
        }
    }

    taskSelect.addEventListener('change', fillFormFields)
    fillFormFields()

    document.getElementById('editTaskForm').onsubmit = async e => {
        e.preventDefault()
        showLoading()
        await api.updateTask(taskSelect.value, {
            title: titleInput.value,
            description: descInput.value
        })
        alert('Task updated!')
        renderDashboard('tasks')
    }
}

const renderTaskDetail = task => {
    const container = document.getElementById('dashboard-content')
    container.innerHTML = `
            <div class="space-y-4 max-w-xl">
                <h2 class="text-2xl font-bold">${task.title}</h2>
                <p class="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                    ${task.description || '<no description>'}
                </p>
                <p class="text-sm text-gray-500">Created by: ${
                task.user?.name || 'Unknown'
                }</p>
                <p class="text-sm text-gray-500">Created at: ${formatDate(
                task.created_at
                )}</p>
                <p class="text-sm text-gray-500">Updated at: ${formatDate(
                task.updated_at
                )}</p>
                <button id="backBtn" class="btn">⬅ Back to all tasks</button>
            </div>
        `

    document.getElementById('backBtn').onclick = () => renderDashboard('tasks')
}

const formatDate = dateStr => {
    const date = new Date(dateStr)
    const pad = n => (n < 10 ? '0' + n : n)

    return `${pad(date.getDate())}.${pad(
        date.getMonth() + 1
    )}.${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

localStorage.getItem('token') ? renderDashboard('tasks') : renderLogin()
