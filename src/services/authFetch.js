const API_BASE = import.meta.env.VITE_BACKEND_URL;

async function handleResponse(response) {
  const result = await response.json();
  if (!response.ok) {
    throw result; // return the error data as it is coming from the backend
  }
  return result;
}

function getAuthHeaders() {
  const token = localStorage.getItem('token'); // assuming token is stored here
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

export async function authGet(path) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: getAuthHeaders(),
  });
  return await handleResponse(res);
}

export async function authPost(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(body),
  });
  return await handleResponse(res);
}

export async function authDelete(path) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return await handleResponse(res);
}

export async function authPatch(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(body),
  });
  return await handleResponse(res);
}

export async function authPut(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(body),
  });
  return await handleResponse(res);
}


export const loginUser = async (credentials) => {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  // const data = await res.json();
  // if (!res.ok) throw new Error(data.message || 'Login failed');
  // return data;

  return await handleResponse(res);
};

export const registerUser = async (formData) => {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  });

  // const data = await res.json();
  // if (!res.ok) throw new Error(data.message || 'Registration failed');
  // return data;

  return await handleResponse(res);
};