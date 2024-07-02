// src/context/SignalRContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import * as signalR from '@microsoft/signalr';

const SignalRContext = createContext();

export const SignalRProvider = ({ children }) => {
    const [connection, setConnection] = useState(null);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl("https://localhost:7223/notificationHub", {
                withCredentials: true // Ensure credentials are included
            })
            .build();

        newConnection.start()
            .then(() => {
                console.log("SignalR Connected.");
                newConnection.on("ReceiveNotification", (user, message) => {
                    setNotifications(prevNotifications => [...prevNotifications, { user, message }]);
                });
            })
            .catch(err => {
                console.error("SignalR Connection Error: ", err);
                setTimeout(() => newConnection.start(), 5000); // Retry connection every 5 seconds
            });

        setConnection(newConnection);

        return () => {
            if (newConnection) {
                newConnection.stop();
            }
        };
    }, []);

    const sendNotification = async (user, message) => {
        if (connection.state !== signalR.HubConnectionState.Connected) {
            console.warn("Connection not established. Retrying...");
            await connection.start(); // Ensure the connection is started
        }

        try {
            await connection.invoke("SendNotification", user, message);
        } catch (err) {
            console.error("Send Notification Error: ", err);
        }
    };

    return (
        <SignalRContext.Provider value={{ notifications, sendNotification }}>
            {children}
        </SignalRContext.Provider>
    );
};

export const useSignalR = () => useContext(SignalRContext);
