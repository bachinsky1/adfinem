const API_URL = 'http://localhost:8000/api'

let token = localStorage.getItem('token')

const setToken = t => {
    token = t
    localStorage.setItem('token', t)
}

const removeToken = () => {
    token = null
    localStorage.removeItem('token')
}

const request = async (method, endpoint, data) => {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            ...(token && { Authorization: `Bearer ${token}` })
        }
    }

    if (data) {
        options.body = JSON.stringify(data)
    }

    try {
        const response = await fetch(`${API_URL}${endpoint}`, options)

        if (response.status === 401) {
            removeToken()
            return { error: 'Unauthorized' }
        }

        return await response.json()
    } catch (err) {
        console.error('API request failed:', err)
        return { error: 'Request failed' }
    }
}

export default {
    login: (email, password) => request('POST', '/login', { email, password }),
    register: (name, email, password) => request('POST', '/register', { name, email, password }),
    me: () => request('GET', '/me'),
    getTasks: () => request('GET', '/tasks'),
    addTask: task => request('POST', '/tasks', task),
    deleteTask: id => request('DELETE', `/tasks/${id}`),
    updateTask: (id, task) => request('PUT', `/tasks/${id}`, task),
    setToken,
    removeToken
}
