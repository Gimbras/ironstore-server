const router = require("express").Router();   
// This is your test secret API key.
const stripe = require("stripe")('sk_test_51K70eID3605ZP0sFszdsAgDS2UU41PBnvr6m4d2ojnHhK1IfykvybYmuWYxdVyAvDDXPKkI7IGIUSBds8B8RfSif00rXTcG0VE');

const calculateOrderAmount = (items) => {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  return 1400;
};

router.post("/create-payment-intent", async (req, res) => {
  const { items } = req.body;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: "eur",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});



module.exports = router;




// const YOUR_DOMAIN = 'http://localhost:5005';
// const stripe = require('stripe')('sk_test_51K70eID3605ZP0sFszdsAgDS2UU41PBnvr6m4d2ojnHhK1IfykvybYmuWYxdVyAvDDXPKkI7IGIUSBds8B8RfSif00rXTcG0VE');


// app.post('/create-checkout-session', async (req, res) => {
//   const session = await stripe.checkout.sessions.create({
//     line_items: [
//       {
//         // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
//         price: '{{PRICE_ID}}',
//         quantity: 1,
//       },
//     ],
//     mode: 'payment',
//     success_url: `${YOUR_DOMAIN}/?success=true`, //process.env try this here 
//     cancel_url: `${YOUR_DOMAIN}?canceled=true`,
//   });

//   res.redirect(303, session.url);
// });
