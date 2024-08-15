import express from 'express';
import axios from 'axios';
import Order from '../models/OrderModel.js';
import Product from "../models/ProductModel.js";
import { isAuth } from '../utils.js';
import nodemailer from 'nodemailer';



const FlouciRouter = express.Router()

FlouciRouter.post('/payment/:id' ,isAuth , async(req, res)=>{
    const url = "https://developers.flouci.com/api/generate_payment"
    const id = req.params.id
    const {totalPrice} = req.body 

   
    const payload = {
    "app_token": process.env.FLOUCI_JETON_PUBLIC, 
    "app_secret": process.env.FLOUCI_JETON_PRIVE,
    "amount": totalPrice*100 ,
    "accept_card": "true",
    "session_timeout_secs": 1200,
    "success_link": `http://localhost:3000/success/${id}`,
    "fail_link": "http://localhost:3000/fail",
    "developer_tracking_id": "5faa840a-a0ff-4aaa-af14-9e240c05b792"
    }
    
    try {
        const result = await axios.post(url, payload);
        res.send(result.data)
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur lors de la génération du paiement');
    }
});

FlouciRouter.post('/verify/:id/:payment_id',isAuth,async(req,res)=>{
    const id = req.params.id
    const payment_id = req.params.payment_id
    const url = `https://developers.flouci.com/api/verify_payment/${payment_id}`

    try {
        const result = await axios.get(url , {
            headers : {
                'Content-Type': 'application/json' , 
                'apppublic':process.env.FLOUCI_JETON_PUBLIC ,
                'appsecret': process.env.FLOUCI_JETON_PRIVE
            }
        })
        if(result.data.result.status){
            const order = await Order.findById(id);
            if(order){
                order.isPaid = true ,
                order.paidAt = Date.now()

                //gerer le stock
                for (const item of order.orderItems) {
                    const product = await Product.findById(item.product._id);
                    
                    console.log("Product Details:", product);
                    console.log("Product ID:", item.product._id);
                    console.log("Initial Count in Stock:", product.countInStock);
                    
                    product.countInStock -= item.qty;
                    console.log("Updated Count in Stock after reducing by", item.qty, ":", product.countInStock);
                    
                    await product.save();
                    console.log("Product saved successfully.");
                    console.log("------------------------------------------------------------");
                  }
                  
                    //send mail confirmation
                let config = {
                    service: 'gmail', // your email domain
                    auth: {
                        user: process.env.NODEJS_GMAIL_APP_USER,   // your email address
                        pass: process.env.NODEJS_GMAIL_APP_PASSWORD // your password
                       
                    },
                  }
                  let transporter = nodemailer.createTransport(config);

      let message = {
        from: 'jarraykais1@gmail.com', // sender address
        to:`${req.user.email}`, // list of receivers
        subject: `Succès de la commande`, // Subject line
        html: ` 
         <h1>Confirmation de commande</h1>
      <p>Bonjour,</p>
      <p>Votre commande a été traitée avec succès.</p>
      <h2>Détails de la commande:</h2>
      <p><strong>Code de commande:</strong> ${order._id}</p>
      <p><strong>Date:</strong> ${new Date(order.paidAt).toLocaleDateString('fr-TN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'Africa/Tunis',
      })}</p>
      <p><strong>Total:</strong> ${order.totalPrice} TND</p>
      <p><strong>Méthode de paiement:</strong> ${order.paymentMethod === 'Cash on Delivery' ? 'Paiement en espèces' : 'Carte de crédit'}</p>
      <p>Merci pour votre achat !</p> 
        
        `,
    };
    transporter.sendMail(message, (error, info) => {
        if (error) {
            console.error('Erreur lors de l\'envoi de l\'email: ', error);
            return res.status(500).json({ msg: "Erreur lors de l'envoi de l'email de confirmation." });
        } else {
            console.log('Email envoyé: ' + info.response);
        }
    });
                const updatedOrder = await order.save()
               
                return res.send({massage : 'payment reussit' , order : updatedOrder}) 
                
            }
            else {
                return res.status(400).json({message : 'commande non trouvée'})
            }
        
           }
           else {
           
            return res.status(400).json({ message: 'Échec du paiement' });
        }
        
    } catch (error) {
        

        res.status(400).json({msg : 'la commande  n\'est pas encore payée'})
    }
    
})

export default FlouciRouter