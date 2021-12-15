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
