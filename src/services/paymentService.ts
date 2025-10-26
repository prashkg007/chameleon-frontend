import config from '../config';
import authService from './authService';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface CreateOrderResponse {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
}

interface CreditsBalanceResponse {
  userId: string;
  credits: number;
  totalPurchased: number;
}

class PaymentService {
  private apiBaseUrl = config.api.baseUrl;

  private razorpayLoadingPromise: Promise<void> | null = null;

  private loadRazorpayScript(): Promise<void> {
    if (typeof window !== 'undefined' && window.Razorpay) {
      return Promise.resolve();
    }
    if (this.razorpayLoadingPromise) return this.razorpayLoadingPromise;

    this.razorpayLoadingPromise = new Promise<void>((resolve, reject) => {
      const existing = document.querySelector(
        'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
      ) as HTMLScriptElement | null;
      if (existing && (window as any).Razorpay) {
        resolve();
        return;
      }
      const script = existing ?? document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Razorpay'));
      if (!existing) document.head.appendChild(script);
    });

    return this.razorpayLoadingPromise;
  }

  async createOrder(amount: number, credits: number): Promise<CreateOrderResponse> {
    const accessToken = authService.getAccessToken();
    if (!accessToken) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${this.apiBaseUrl}/api/payments/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ amount, credits }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create order');
    }

    return response.json();
  }

  async fetchCredits(): Promise<number> {
    const accessToken = authService.getAccessToken();
    if (!accessToken) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${this.apiBaseUrl}/api/credits/balance`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch credits');
    }

    const data: CreditsBalanceResponse = await response.json();
    return data.credits;
  }


  async createOrderAndRedirect(
    amount: number,
    credits: number,
    planName: string
  ): Promise<void> {
    try {
      // Load Razorpay script first
      await this.loadRazorpayScript();

      // Create order
      const order = await this.createOrder(amount, credits);

      // Get user info
      const userInfo = authService.getUserInfo();

      // Build success and failure URLs - redirect back to home page
      const baseUrl = window.location.origin;
      const successUrl = `${baseUrl}/?payment=success&amount=${amount}&credits=${credits}`;
      const failureUrl = `${baseUrl}/?payment=failed`;

      // Configure Razorpay options for direct redirect
      const options = {
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'StealthBuddy Credits',
        description: `Purchase ${planName}`,
        order_id: order.orderId,
        prefill: {
          name: userInfo?.name || '',
          email: userInfo?.email || '',
        },
        theme: {
          color: '#3B82F6',
        },
        handler: async (response: any) => {
          console.log('Payment successful:', response);
          // Redirect to home page with success status
          window.location.href = `${successUrl}&payment_id=${response.razorpay_payment_id}&order_id=${response.razorpay_order_id}`;
        },
        modal: {
          ondismiss: () => {
            // User cancelled payment, redirect back to home
            console.log('Payment cancelled by user');
            window.location.href = `${baseUrl}/?payment=cancelled`;
          },
        },
      };

      // Open Razorpay checkout
      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', (response: any) => {
        console.error('Payment failed:', response);
        // Redirect to home page with error
        window.location.href = `${failureUrl}&error=${encodeURIComponent(response.error?.description || 'Payment failed')}`;
      });
      razorpay.open();
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }
}

const paymentService = new PaymentService();
export default paymentService;

