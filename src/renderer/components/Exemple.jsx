import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { increment } from '../store/slices/exampleSlice';

function Example() {
  const [message, setMessage] = useState('');
  const count = useSelector((state) => state.example.value);
  const dispatch = useDispatch();

  // Style avec des classes Tailwind-like
  const buttonStyle = `
    px-4 py-2 m-2
    bg-blue-500
    text-white
    rounded
    hover:bg-blue-600
    transition-colors
  `;

  const cardStyle = `
    p-6 
    max-w-sm 
    mx-auto 
    bg-white 
    rounded-xl 
    shadow-md 
    flex flex-col 
    items-center 
    space-y-4
  `;

  const handleSendMessage = () => {
    // Utilise l'API exposée par le preload
    window.electron.sendMessage('example-channel', 'Hello from React!');
  };

  return (
    <div className={cardStyle}>
      <h2 className="text-xl font-bold">Example Component</h2>
      
      {/* Section Redux */}
      <div className="text-center">
        <p>Redux Counter: {count}</p>
        <button 
          className={buttonStyle}
          onClick={() => dispatch(increment())}
        >
          Increment Counter
        </button>
      </div>

      {/* Section Electron IPC */}
      <div className="text-center">
        <button 
          className={buttonStyle}
          onClick={handleSendMessage}
        >
          Send Message to Main Process
        </button>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="border rounded px-2 py-1 mt-2"
          placeholder="Type a message..."
        />
      </div>

      {/* Section d'informations */}
      <div className="text-sm text-gray-600">
        <p>Running in: {process.env.NODE_ENV}</p>
        <p>Platform: {window.navigator.platform}</p>
      </div>
    </div>
  );
}

export default Example;