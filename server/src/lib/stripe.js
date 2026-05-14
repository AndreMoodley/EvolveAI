import Stripe from 'stripe';
import { env } from '../config/env.js';

let _stripe = null;

export function getStripe() {
  if (!_stripe) {
    if (!env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not configured. Soul Escrow features are unavailable.');
    }
    _stripe = new Stripe(env.STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' });
  }
  return _stripe;
}
