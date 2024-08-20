import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import http from 'http';
import { Server } from 'socket.io';
import cookieParser from 'cookie-parser';
import googleAuthRoutes from './routes/googleAuthRoutes.js';
import userRouter from './routes/userRouter.js';
import productRouter from './routes/productRoutes.js';
import orderRouter from './routes/orderRoutes.js';
import FlouciRouter from './routes/Flouci.js';
import stripeRouter from './routes/Stripe.js';
import SupportRouter from './routes/SupportRouter.js';
import Conversation from './models/Support.js';
import cors from 'cors';
import bodyParser from 'body-parser';
import { isAdmin, isAuth, isSellerOrAdmin } from './utils.js';

import { fileURLToPath } from "url";


dotenv.config()

const __filename = fileURLToPath(import.meta.url);

mongoose.connect(process.env.MONGODB_URL)
.then(()=>
{console.log("connect to db" )})
.catch((err)=>{
    console.log(err.message)
})

const app = express()
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Initialiser Passport
app.use(googleAuthRoutes);
app.use(express.json(), express.urlencoded({ extended: true }), cors());


app.use('/api/users', userRouter);
app.use('/api/products', productRouter);
app.use('/api/orders', orderRouter)
app.use('/api', FlouciRouter)
app.use('/api/stripe',stripeRouter)
app.use('/api/support',SupportRouter)

app.get('/api/check-auth', isAuth, (req, res) => {
    res.json({ authenticated: true, message: 'User is authenticated' });
  });
app.get('/api/check-admin',isAuth , isAdmin, (req, res) => {
    res.json({ authenticated: true, message: 'User admin is authenticated' });
  });
  app.get('/api/check-selleOradmin',isAuth , isSellerOrAdmin, (req, res) => {
    res.json({ authenticated: true, message: 'User has access' });
  });

app.get('/api/config/paypal', (req, res) => {
    res.send(process.env.PAYPAL_CLIENT_ID || 'sb');
  });

app.get('developers.flouci.com/api/generate_payment',(req , res)=>{

})
app.get('/api/config/google', (req, res) => {
    res.send(process.env.GOOGLE_API_key || 'sb');
  });




// Gestion des erreurs 404
app.use((err, req, res, next) => {
    res.status(500).send({ message: err.message });
  });
// Middleware pour servir les fichiers statiques
const dirname = path.resolve();
app.use('/uploads', express.static(path.join(dirname, '/uploads')));
const __dirname = path.dirname(__filename);
// Use the client app
app.use(express.static(path.join(__dirname, "../client/build")));

// Render client for any path
app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "../client/build" , "index.html"))
);

// Middleware pour la gestion des erreurs
app.use((error, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: error.message,
    });
});


// Port d'écoute du serveur
const PORT = process.env.PORT || 5000;
const httpServer = http.Server(app);
const io = new Server(httpServer, {  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    allowedHeaders: ['*'],
    credentials: true,
  },
 });
const users = [];
const tidioApiKey = 'your-private-api-key';


io.on('connection', (socket) => {
    console.log('Connection', socket.id);

    socket.on('disconnect', () => {
        console.log('Socket disconnected:', socket.id);
        const user = users.find((x) => x.socketId === socket.id);
        if (user) {
            user.online = false;
            console.log('Offline', user.name);
            const admin = users.find((x) => x.isAdmin && x.online);
            if (admin) {
                io.to(admin.socketId).emit('updateUser', user);
            }
            Conversation.updateOne(
                { userId: user._id },
                { $set: { status: 'offline' } },
                (err, res) => {
                    if (err) {
                        console.error('Failed to update conversation status:', err);
                    } else {
                        console.log('Conversation status updated:', res.nModified);
                    }
                }
            );
        }
    });

    socket.on('onLogin', async (user) => {
    console.log('login')
        console.log('onLogin event received:', user);

        console.log('user')
        const updatedUser = {
            ...user,
            online: true,
            socketId: socket.id,
            messages: [],
        };
        
        const existUser = users.find((x) => x._id === updatedUser._id);
        if (existUser) {
            existUser.socketId = socket.id;
            existUser.online = true;
        } else {
            users.push(updatedUser);
        }
        console.log('Online', user.name);
        const admin = users.find((x) => x.isAdmin && x.online);
        if (admin) {
            io.to(admin.socketId).emit('updateUser', updatedUser);
        }
        if (updatedUser.isAdmin) {
            io.to(updatedUser.socketId).emit('listUsers', users);
        }
        // Mise à jour du statut de la conversation lors de la connexion de l'utilisateur
        Conversation.updateOne(
            { userId: updatedUser._id },
            { $set: { status: 'online' } },
            { upsert: true },
            (err, res) => {
                if (err) {
                    console.error('Failed to update conversation status:', err);
                } else {
                    console.log('Conversation status updated:', res.nModified);
                }
            }
        );
         // Récupération et envoi des messages en attente
    const conversation = await Conversation.findOne({ userId: updatedUser._id });
    if (conversation && conversation.messages && conversation.messages.length > 0) {
        for (const message of conversation.messages) {
            io.to(updatedUser.socketId).emit('message', message);
        }
    }
    });

    socket.on('onUserSelected', (user) => {
        console.log('onUserSelected event received:', user);
        const admin = users.find((x) => x.isAdmin && x.online);
        if (admin) {
            const existUser = users.find((x) => x._id === user._id);
            io.to(admin.socketId).emit('selectUser', existUser);
        }
    });

    socket.on('onMessage', async (data) => {
        console.log('onMessage event received:', data);
    
        // 1. Validation et parsing des données reçues
        let messageData;
        if (typeof data === 'string') {
            try {
                messageData = JSON.parse(data); // Parse si les données sont reçues sous forme de chaîne
            } catch (error) {
                console.error('Failed to parse string data:', error);
                return;
            }
        } else {
            messageData = data; // Sinon, utilisez les données directement
        }
    
        // 2. Validation de la structure des données
        if (typeof messageData !== 'object' || !messageData.data) {
            console.error('Received data is not properly structured:', messageData);
            return;
        }
    
        const message = messageData.data;
        console.log('Parsed message data:', message);
    
        // 3. Conversion de isAdmin en booléen
        message.isAdmin = message.isAdmin === 'true' || message.isAdmin === true;
    
        // 4. Vérification des champs requis
        if (!message.body || !message._id) {
            console.error('Message is missing required fields:', message);
            return;
        }
    
        // 5. Création du message complet avec horodatage et expéditeur
        const completeMessage = {
            ...message,
            timestamp: new Date(),
            sender: message.isAdmin ? 'admin' : 'user' ,
            content : message.body
        };
    
        // 6. Enregistrement du message dans la base de données
        await Conversation.updateOne(
            { userId: message._id },
            { $push: { messages: completeMessage },
              $set: { status: 'open', sessionId: socket.id } },
            { upsert: true }
        );
    
        // 7. Envoi du message à l'autre partie si en ligne
        if (message.isAdmin) {
            // Envoi du message à l'utilisateur si en ligne
            const user = users.find((x) => x._id === message._id && x.online);
            if (user) {
                io.to(user.socketId).emit('message', completeMessage);
                console.log('Sending message to user:', user);
            } else {
                console.log('User is offline, message will be delivered when they come online.');
            }
        } else {
            // Envoi du message à l'administrateur si en ligne
            const admin = users.find((x) => x.isAdmin && x.online);
            if (admin) {
                io.to(admin.socketId).emit('message', completeMessage);
                console.log('Sending message to admin:', admin);
            } else {
                console.log('Admin is offline, message will be delivered when they come online.');
            }
        }
     // Envoi du message à Tidio
     sendToTidio(completeMessage)
     .then(response => {
         console.log('Tidio response:', response);

         // Si Tidio répond, on arrête ici
         if (response.status === 'success') {
             return;
         }

         // Si Tidio ne répond pas, redirigez le message à l'admin
         if (!message.isAdmin) {
             const admin = users.find((x) => x.isAdmin && x.online);
             if (admin) {
                 io.to(admin.socketId).emit('message', completeMessage);
                 console.log('Redirecting message to admin:', admin);
             } else {
                 console.log('Admin is offline, message will be delivered when they come online.');
             }
         }
     })
     .catch(err => {
         console.error('Error sending message to Tidio:', err);

         // En cas d'erreur avec Tidio, redirigez le message à l'admin
         if (!message.isAdmin) {
             const admin = users.find((x) => x.isAdmin && x.online);
             if (admin) {
                 io.to(admin.socketId).emit('message', completeMessage);
                 console.log('Redirecting message to admin:', admin);
             } else {
                 console.log('Admin is offline, message will be delivered when they come online.');
             }
         }
     });
});
})
httpServer.listen(PORT, () => {
    console.log(`Serve at http://localhost:${PORT}`);
});