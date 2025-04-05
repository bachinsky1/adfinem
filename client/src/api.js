const API_URL = 'http://localhost:8000/api';

let token = localStorage.getItem('token');

function setToken(t) {
  token = t;
  localStorage.setItem('token', t);
}

async function request(method, endpoint, data) {
  const options = {
    method,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  const res = await fetch(`${API_URL}${endpoint}`, options);
  return res.json();
}

export default {
    login: (email, password) => request('POST', '/login', { email, password }),
    register: (name, email, password) => request('POST', '/register', { name, email, password }),
    me: () => request('GET', '/me'),
    getTasks: () => request('GET', '/tasks'),
    addTask: (task) => request('POST', '/tasks', task),
    deleteTask: (id) => request('DELETE', `/tasks/${id}`),
    updateTask: (id, task) => request('PUT', `/tasks/${id}`, task),
    setToken
  };
  