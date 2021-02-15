import { Stripe } from 'stripe';
import { SystemConfiguration } from '@backend/systemconfiguration';

const { apiKey, apiVersion }: any = SystemConfiguration.stripe;

export const stripe: Stripe = new Stripe(apiKey, { apiVersion });
