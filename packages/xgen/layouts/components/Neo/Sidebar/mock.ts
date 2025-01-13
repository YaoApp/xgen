export const mockContextFiles = [
	{
		name: 'document.pdf',
		type: 'PDF',
		thumbUrl: undefined
	},
	{
		name: 'screenshot.png',
		type: 'IMG',
		thumbUrl: 'https://placehold.co/60/000000/FFF'
	},
	{
		name: 'very-long-filename-example.txt',
		type: 'TXT',
		thumbUrl: undefined
	}
]

export const mockMessages = [
	{
		role: 'assistant',
		content: "Hello! I'm an AI assistant. How can I help you today?"
	},
	{
		role: 'user',
		content: 'Can you help me write a React component for a simple Todo List?'
	},
	{
		role: 'assistant',
		content: `I'll help you create a simple Todo List component with basic add and delete functionality:

\`\`\`tsx
import { useState } from 'react';

interface Todo {
  id: number;
  text: string;
}

const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState('');

  const addTodo = () => {
    if (input.trim()) {
      setTodos([...todos, { id: Date.now(), text: input }]);
      setInput('');
    }
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div>
      <div>
        <input 
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Add new task..."
        />
        <button onClick={addTodo}>Add</button>
      </div>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            {todo.text}
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
\`\`\`

This component implements the following features:
1. Add new todo items
2. Display all todo items in a list
3. Delete specific todo items

You can use this component directly or extend it with additional styling and functionality as needed.`
	},
	{
		role: 'user',
		content: 'Thanks! The code is very clear. Can you add a completion status feature?'
	},
	{
		role: 'assistant',
		content: "Of course! I'll modify the code to add a toggle completion status feature:"
	}
]
