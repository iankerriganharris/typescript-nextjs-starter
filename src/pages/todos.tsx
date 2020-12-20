import React, { useState } from 'react';
import { useMutation, useQuery } from 'react-query';

type TodoType = {
  text: string;
  isDone: boolean;
  id?: string;
};

const getTodos = async () =>
  fetch(`/api/todos`)
    .then((res) => res.json())
    .then((json) => json.data.map((d) => ({ id: d.id, ...d.attributes })));

export default function Todos() {
  const { status, data, refetch } = useQuery<TodoType[], any>(
    `todos`,
    getTodos,
  );

  const todos = data || [];
  const done = todos.filter((todo) => todo.isDone).length;

  const { mutate } = useMutation(async (value: any) =>
    fetch(`/api/todos`, {
      method: `POST`,
      body: JSON.stringify(value),
    })
      .then((res) => res.json())
      .then(refetch),
  );

  async function createTodo(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const { newTodoName: textField } = event.target as any;

    mutate({ data: { type: `todos`, attributes: { text: textField.value } } });
  }

  async function saveTodo(todo: TodoType) {
    console.log(`todo`, todo);
    await fetch(`/api/todos/${todo.id}`, {
      method: `PATCH`,
      body: JSON.stringify({
        data: { type: `todos`, id: todo.id, attributes: { ...todo } },
      }),
    }).then(() => refetch());
  }

  return (
    <div className="max-w-sm px-4 py-6 mx-auto bg-white rounded shadow-lg">
      <div className="flex items-center justify-between px-3">
        <h1 className="text-2xl font-bold">Todos</h1>

        <div className="text-blue-500">
          {status === `loading` && (
            <svg
              className="w-4 h-4 fill-current"
              viewBox="0 0 20 20"
              data-testid="saving"
            >
              <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1z" />
            </svg>
          )}
        </div>
      </div>

      <div className="mt-6">
        {status === `loading` ? (
          <p className="px-3 text-gray-500" data-testid="loading">
            Loading...
          </p>
        ) : (
          <div>
            <div className="px-3">
              <form onSubmit={createTodo} data-testid="new-todo-form">
                <input
                  type="text"
                  name="newTodoName"
                  placeholder="New todo"
                  className="block w-full px-3 py-2 placeholder-gray-500 bg-white rounded shadow focus:outline-none"
                />
              </form>
            </div>

            {todos.length > 0 ? (
              <ul className="mt-8">
                {todos.map((todo) => (
                  <Todo
                    todo={todo}
                    onChange={(e) => {
                      saveTodo({ ...todo, [e.target.name]: e.target.value });
                    }}
                    key={todo.id}
                  />
                ))}
              </ul>
            ) : (
              <p
                className="px-3 mt-16 text-lg text-center text-gray-500"
                data-testid="no-todos"
              >
                Everything&apos;s done!
              </p>
            )}

            <div className="flex justify-between px-3 mt-12 text-sm font-medium text-gray-500">
              {todos.length > 0 ? (
                <p>
                  {done} / {todos.length} complete
                </p>
              ) : null}
              {/* {done > 0 ? (
                <button
                  onClick={deleteCompleted}
                  className='font-medium text-blue-500 focus:outline-none focus:text-blue-300'
                >
                  Clear completed
                </button>
              ) : null} */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Todo({
  todo,
  onChange,
}: {
  todo: TodoType;
  onChange: ((event: React.ChangeEvent<HTMLInputElement>) => void) | undefined;
}) {
  const [isFocused, setIsFocused] = useState(false);
  const handleSubmit = () => {
    console.log(`handleSubmit`);
    // onChange()
  };

  return (
    <li
      className={`
        my-1 rounded focus:bg-white border-2 flex items-center relative
        ${isFocused ? `bg-white border-gray-300` : ``}
        ${!isFocused ? `border-transparent hover:bg-gray-200` : ``}
        ${!isFocused && todo.isDone ? `opacity-50` : ``}
      `}
      data-testid="todo"
    >
      <input
        type="checkbox"
        name="isDone"
        checked={todo.isDone}
        onChange={onChange}
        className="ml-2"
      />

      <form onSubmit={handleSubmit} className="relative w-full">
        <input
          type="text"
          name="text"
          value={todo.text}
          onChange={onChange}
          placeholder="New Todo"
          onFocus={() => setIsFocused(true)}
          onBlur={onChange}
          className={`
            bg-transparent focus:outline-none px-3 py-1 block w-full
            ${todo.isDone && !isFocused ? `line-through` : ``}
          `}
        />
      </form>
    </li>
  );
}
