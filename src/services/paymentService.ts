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

  async initRazorpayCheckout(
    amount: number,
    credits: number,
    onSuccess: () => void,
    onFailure: (error: string) => void
  ): Promise<void> {
    try {
      // Create order
      const order = await this.createOrder(amount, credits);

      // Get user info
      const userInfo = authService.getUserInfo();

      // Configure Razorpay options
      const options = {
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'StealthBuddy Credits',
        description: `Purchase ${credits} credits`,
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
          // Payment successful - Razorpay will notify our webhook
          // We can optionally verify on frontend but webhook will handle credit addition
          onSuccess();
        },
        modal: {
          ondismiss: () => {
            onFailure('Payment cancelled');
          },
        },
      };

      // Open Razorpay checkout
      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', (response: any) => {
        console.error('Payment failed:', response);
        onFailure(response.error?.description || 'Payment failed');
      });
      razorpay.open();
    } catch (error) {
      console.error('Error initializing payment:', error);
      onFailure(error instanceof Error ? error.message : 'Failed to initialize payment');
    }
  }
}

const paymentService = new PaymentService();
export default paymentService;

