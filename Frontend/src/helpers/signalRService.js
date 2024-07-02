import * as signalR from "@microsoft/signalr";

const connection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:7223/notificationHub")
    .build();

export const startConnection = () => {
    connection.start().catch(err => console.error("SignalR Connection Error: ", err));
};

export const sendNotification = (user, message) => {
    connection.invoke("SendNotification", user, message).catch(err => console.error("Send Notification Error: ", err));
};

export const onReceiveNotification = (callback) => {
    connection.on("ReceiveNotification", callback);
};
