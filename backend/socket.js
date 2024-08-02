import { Server } from 'socket.io';
import messageService from './services/message.service.js';
import MessageDTO from './models/dto/message.dto.js';
import { config } from './config/config.js';

const CUSTOMER_SERVICE_EMAIL = config.CUSTOMER_SERVICE_EMAIL;
let socket;
let usersOnline = [];

export function initSocket(httpServer) {
    socket = new Server(httpServer);
    setEvent(socket);
}

function setEvent(socket) {
    socket.on('connection', async (socketClient) => {
        console.log(`SOCKETID: <${socketClient.id}> conectado.`);
        
        socketClient.on('user-info', (data) => {
            // Check if users already exist. Online update socket.id in case already exists.
            let user = usersOnline.findIndex(u => u.email === data.email);
            if (user === -1) {
                usersOnline.push({
                    socketID: data.socketID,
                    email: data.email
                });
            }
            else { usersOnline[user].socketID = data.socketID; }

            // Send welcome message
            socket.to(data.socketID).emit('welcome-message', new MessageDTO({
                email: data.email,
                body: 'Hola! ¿Necesitas ayuda con algo?',
                timestamp: Date.now(),
                type: 'system'
            }));
        });

        // New message arrived from socket
        socketClient.on('send-message', (data) => {
            const newMessage = {
                email: data.email,
                body: data.body,
                timestamp: Date.now(),
            };
            if (data.type === 'system') { newMessage.type = data.type; }
            else { newMessage.type = 'user'; }

            // Emit new message to admin (Customer Service) and to the specific user
            let userTarget = usersOnline.find(u => u.email === data.email);
            let adminTarget = usersOnline.find(u => u.email === CUSTOMER_SERVICE_EMAIL);
            if (userTarget) { // User should exists and be connected
                socket.to(userTarget.socketID).emit('receive-message', new MessageDTO(newMessage));
                // If admin (Customer Service) is connected, send him/her the message too
                if (adminTarget) { socket.to(adminTarget.socketID).emit('receive-message', new MessageDTO(newMessage)); }
            }
            messageService.create(newMessage);
        });

        socketClient.on('disconnect', () => {
            console.log(`SOCKETID: <${socketClient.id}> desconectado.`);
            usersOnline = usersOnline.filter(u => u.socketID !== socketClient.id);
        });
    });
}

// Used for disconnection when users click sign.out button
export function socketClientDisconnect(email) {
    let socketID = usersOnline.find(u => u.email === email).socketID;
    const socketClient = socket.sockets.sockets.get(socketID);
    socketClient.disconnect(true);
}