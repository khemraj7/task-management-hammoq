import assert from 'node:assert/strict';
import { afterEach, beforeEach, test } from 'node:test';
import { createApp } from '../src/app.js';

let server;
let baseUrl;

beforeEach(async () => {
  const instance = createApp({ taskRepository: createMemoryTaskRepository() });
  server = instance.app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}/api/tasks`;
});

afterEach(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
});

function createMemoryTaskRepository() {
  const tasks = new Map();
  let nextId = 1;
  const makeId = () => String(nextId++).padStart(24, '0');

  return {
    async findAll() {
      return [...tasks.values()].reverse();
    },
    async findById(id) {
      return tasks.get(id) ?? null;
    },
    async create(input) {
      const task = {
        id: makeId(),
        ...input,
        completed: false,
        createdAt: new Date().toISOString()
      };
      tasks.set(task.id, task);
      return task;
    },
    async update(id, changes) {
      const current = tasks.get(id);
      if (!current) return null;
      const updated = { ...current, ...changes };
      tasks.set(id, updated);
      return updated;
    },
    async delete(id) {
      return tasks.delete(id);
    }
  };
}

async function request(path = '', options) {
  return fetch(`${baseUrl}${path}`, options);
}

test('creates a task and returns it in the task list', async () => {
  const createResponse = await request('', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: '  Plan project  ', description: 'First task' })
  });
  const created = await createResponse.json();

  assert.equal(createResponse.status, 201);
  assert.equal(created.title, 'Plan project');
  assert.equal(created.description, 'First task');
  assert.equal(created.completed, false);

  const listResponse = await request();
  assert.deepEqual(await listResponse.json(), [created]);
});

test('rejects a task without a title', async () => {
  const response = await request('', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: '  ' })
  });

  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), { error: 'Title is required.' });
});

test('updates a task and marks it complete', async () => {
  const createResponse = await request('', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: 'Write tests' })
  });
  const created = await createResponse.json();
  const updateResponse = await request(`/${created.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: 'Write API tests', completed: true })
  });

  assert.equal(updateResponse.status, 200);
  assert.deepEqual(await updateResponse.json(), {
    ...created,
    title: 'Write API tests',
    completed: true
  });
});

test('rejects invalid IDs and returns not found for unknown tasks', async () => {
  const invalidIdResponse = await request('/not-an-id', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed: true })
  });
  const updateResponse = await request('/ffffffffffffffffffffffff', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed: true })
  });
  const deleteResponse = await request('/ffffffffffffffffffffffff', { method: 'DELETE' });

  assert.equal(invalidIdResponse.status, 400);
  assert.equal(updateResponse.status, 404);
  assert.equal(deleteResponse.status, 404);
});

test('deletes an existing task', async () => {
  const createResponse = await request('', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: 'Remove this task' })
  });
  const created = await createResponse.json();

  assert.equal((await request(`/${created.id}`, { method: 'DELETE' })).status, 204);
  assert.deepEqual(await (await request()).json(), []);
});
