async function request(url, options) {
  const response = await fetch(url, options);
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || 'Could not complete the request.');
  }
  return response.status === 204 ? null : response.json();
}

export const taskApi = {
  list() {
    return request('/api/tasks');
  },
  create(task) {
    return request('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task)
    });
  },
  update(id, changes) {
    return request(`/api/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(changes)
    });
  },
  remove(id) {
    return request(`/api/tasks/${id}`, { method: 'DELETE' });
  }
};
