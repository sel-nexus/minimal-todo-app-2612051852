import { useRef, useState } from 'react';

/** Render and manage the in-session task list. */
export default function App() {
  const [inputValue, setInputValue] = useState('');
  const [todos, setTodos] = useState([]);
  const nextId = useRef(1);

  /** Add a nonblank task and clear the entry field. */
  function addTodo(event) {
    event.preventDefault();
    const title = inputValue.trim();

    if (title === '') {
      return;
    }

    const todo = {
      id: nextId.current,
      title,
      completed: false,
    };
    nextId.current += 1;
    setTodos((currentTodos) => [...currentTodos, todo]);
    setInputValue('');
  }

  /** Toggle completion for only the selected task. */
  function toggleTodo(id) {
    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  }

  /** Remove only the selected task. */
  function deleteTodo(id) {
    setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== id));
  }

  return (
    <main className="page-shell">
      <section className="todo-card" aria-labelledby="page-title">
        <p className="eyebrow">A LITTLE MORE DONE</p>
        <h1 id="page-title">Todo App</h1>
        <p className="intro">A clear space for what’s next.</p>

        <form className="task-form" onSubmit={addTodo}>
          <label className="visually-hidden" htmlFor="todo-input">
            Add a task
          </label>
          <input
            id="todo-input"
            data-testid="todo-input"
            type="text"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            placeholder="What needs doing?"
            autoComplete="off"
          />
          <button data-testid="add-button" type="submit">
            Add
          </button>
        </form>

        {todos.length === 0 && (
          <p className="empty-state" data-testid="empty-state">
            No tasks yet.
          </p>
        )}

        <ul className="todo-list" data-testid="todo-list" aria-label="Tasks">
          {todos.map((todo) => (
            <li
              className={`todo-item${todo.completed ? ' is-complete' : ''}`}
              data-testid={`todo-item-${todo.id}`}
              key={todo.id}
            >
              <input
                className="todo-checkbox"
                data-testid={`todo-checkbox-${todo.id}`}
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                aria-label={`Mark ${todo.title} ${todo.completed ? 'incomplete' : 'complete'}`}
              />
              <span
                className="todo-title"
                data-testid={`todo-title-${todo.id}`}
                style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
              >
                {todo.title}
              </span>
              <button
                className="delete-button"
                data-testid={`todo-delete-${todo.id}`}
                type="button"
                onClick={() => deleteTodo(todo.id)}
                aria-label={`Delete ${todo.title}`}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
