import Stripe from 'stripe';


export const stripe = new Stripe(process.env.STRIPE_API_PRIVATE_KEY!,{
    typescript:true,
    apiVersion:"2024-06-20"
});