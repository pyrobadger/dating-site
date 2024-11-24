// src/components/Messages.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Messages = () => {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const fetchMessages = async () => {
            const token = localStorage.getItem('token');

            if (!token) return;

            try {
                const response = await axios.get('http://localhost:3000/messages/1', { // Replace with actual user ID logic
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMessages(response.data);
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        fetchMessages();
    }, []);

    return (
        <div>
            <h2>Your Messages</h2>
            {messages.length > 0 ? (
                messages.map((msg) => (
                    <div key={msg.message_id}>
                        <p><strong>{msg.sender_username}:</strong> {msg.message_content}</p>
                    </div>
                ))
            ) : (
                <p>No messages found.</p>
            )}
        </div>
    );
};

export default Messages;
