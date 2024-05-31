import React, { useState } from 'react';

function Contact() {
    const [title, setTitle] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        const todoItem = { title, isComplete: false };

         const response = await fetch('https://localhost:7171/api/Todo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(todoItem),
            });
            setTitle(''); // Clear input after successful submission
        console.log(response)
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Add a new todo"
            />
            <button type="submit">Submit</button>
        </form>
    );
}



export default Contact;
