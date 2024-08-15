import Stripe from 'stripe';
import express from 'express';
import Order from '../models/OrderModel.js';
import bodyParser from 'body-parser';
import { isAuth } from '../utils.js';
import expressAsyncHandler from 'express-async-handler';

const stripeRouter = express.Router()

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

stripeRouter.post("/create-checkout-session", isAuth ,async (req, res) => {
    const { orderId, totalPrice, orderItems } = req.body;
  
    // Créer un client Stripe
    const customer = await stripe.customers.create({
      metadata: {
        userId: req.user._id,
        orderId,
        order: JSON.stringify(orderItems),
      },
    });
  
    // Configurer les articles de ligne
    const line_items = orderItems.map((item) => {
      return {
        price_data: {
          currency: "eur",
          product_data: {
            name: item.name,
            images: [item.image],
            description: item.description,
            metadata: {
              id: item.product,
            },
          },
          unit_amount: totalPrice * 100,

          unit_amount: item.price*100 ,

        },
        quantity: item.qty,
      };
    });
  
    // Créer la session de paiement
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      customer: customer.id,
      success_url: `${process.env.CLIENT_URL}/checkout-success`,
      cancel_url: `${process.env.CLIENT_URL}/cart`,
    });
  
    // Envoyer l'URL de la session au client
    res.send({ url: session.url });
  });



  // Route Webhook pour traiter les événements Stripe
// Match the raw body to content type application/json
stripeRouter.post('/webhook', bodyParser.raw({type: 'application/json'}), expressAsyncHandler(async(req, res) => {
  const event = req.body;
  
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('PaymentIntent was successful!');
      break;
    case 'payment_method.attached':
      const paymentMethod = event.data.object;
      console.log('PaymentMethod was attached to a Customer!');
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
      const orderId = session.metadata.orderId;
      const order = await Order.findById(orderId);

      if (order) {
          order.isPaid = true;
          order.paidAt = Date.now();
          await order.save();
      }
  
  res.status(200).json({ received: true });
}))

export default stripeRouter