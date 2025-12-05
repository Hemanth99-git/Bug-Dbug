
import React, { useState } from 'react';

export interface TodoItem {
  id: string;
  task: string;
  date: string;
  completed: boolean;
}

export const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [task, setTask] = useState<string>('');
  const [date, setDate] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!task.trim() || !date) {
      return;
    }

    const newTodo: TodoItem = {
      id: crypto.randomUUID(),
      task: task.trim(),
      date,
      completed: false,
    };

    setTodos([...todos, newTodo]);
    setTask('');
    setDate('');
  };

  const toggleComplete = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-100 mb-6">Todo List</h2>
      
      {/* Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="date-input" className="block text-sm font-medium text-gray-300 mb-2">
              Date
            </label>
            <input
              id="date-input"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label htmlFor="task-input" className="block text-sm font-medium text-gray-300 mb-2">
              Task
            </label>
            <input
              id="task-input"
              type="text"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="Enter your task..."
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            Add Task
          </button>
        </div>
      </form>

      {/* Todo List */}
      {todos.length > 0 ? (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-200 mb-3">Your Tasks</h3>
          {todos.map((todo) => (
            <div
              key={todo.id}
              className="flex items-center justify-between bg-gray-700 rounded-md p-4 hover:bg-gray-600 transition-colors"
            >
              <div className="flex items-center flex-1">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleComplete(todo.id)}
                  className="w-5 h-5 text-blue-600 bg-gray-600 border-gray-500 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
                />
                <div className="ml-4 flex-1">
                  <p className={`text-gray-100 ${todo.completed ? 'line-through text-gray-400' : ''}`}>
                    {todo.task}
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    {new Date(todo.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="ml-4 px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded transition-colors duration-200"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-400">
          <p>No tasks yet. Add one above!</p>
        </div>
      )}
    </div>
  );
};
