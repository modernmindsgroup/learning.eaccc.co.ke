import paystack from "paystack";

if (!process.env.PAYSTACK_SECRET_KEY) {
  throw new Error("PAYSTACK_SECRET_KEY environment variable is required");
}

const paystackClient = paystack(process.env.PAYSTACK_SECRET_KEY);

export interface PaymentData {
  email: string;
  amount: number; // in cents (multiply by 100 for USD)
  currency?: string;
  reference?: string;
  callback_url?: string;
  metadata?: Record<string, any>;
}

export interface PaymentResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export interface VerificationResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    domain: string;
    status: string;
    reference: string;
    amount: number;
    message: string | null;
    gateway_response: string;
    paid_at: string;
    created_at: string;
    channel: string;
    currency: string;
    ip_address: string;
    metadata: Record<string, any>;
    customer: {
      id: number;
      first_name: string | null;
      last_name: string | null;
      email: string;
      customer_code: string;
      phone: string | null;
      metadata: Record<string, any>;
      risk_action: string;
    };
    authorization: {
      authorization_code: string;
      bin: string;
      last4: string;
      exp_month: string;
      exp_year: string;
      channel: string;
      card_type: string;
      bank: string;
      country_code: string;
      brand: string;
      reusable: boolean;
      signature: string;
    };
  };
}

export class PaystackService {
  async initializePayment(paymentData: PaymentData): Promise<PaymentResponse> {
    try {
      console.log("Initializing payment with data:", {
        email: paymentData.email,
        amount: paymentData.amount,
        currency: paymentData.currency || "USD",
        reference: paymentData.reference
      });

      const response = await paystackClient.transaction.initialize({
        email: paymentData.email,
        amount: paymentData.amount,
        currency: paymentData.currency || "USD",
        reference: paymentData.reference,
        callback_url: paymentData.callback_url,
        metadata: paymentData.metadata,
      });

      console.log("Paystack response:", response);
      return response.body as PaymentResponse;
    } catch (error) {
      console.error("Paystack initialization error:", error);
      throw error;
    }
  }

  async verifyPayment(reference: string): Promise<VerificationResponse> {
    try {
      const response = await paystackClient.transaction.verify(reference);
      return response.body as VerificationResponse;
    } catch (error) {
      console.error("Paystack verification error:", error);
      throw new Error("Failed to verify payment");
    }
  }

  async listTransactions(customer?: string, status?: string, from?: string, to?: string) {
    try {
      const response = await paystackClient.transaction.list({
        customer,
        status,
        from,
        to,
      });
      return response.body;
    } catch (error) {
      console.error("Paystack list transactions error:", error);
      throw new Error("Failed to list transactions");
    }
  }
}

export const paystackService = new PaystackService();