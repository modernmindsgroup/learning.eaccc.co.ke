import paystack from "paystack";

const paystackClient = process.env.PAYSTACK_SECRET_KEY 
  ? paystack(process.env.PAYSTACK_SECRET_KEY)
  : null;

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
    if (!paystackClient) {
      console.log("Paystack not configured - returning mock response for development");
      // In development, create a local simulation URL that will auto-complete
      const baseUrl = process.env.REPLIT_DOMAINS ? 
        `https://${process.env.REPLIT_DOMAINS.split(',')[0]}` : 
        'http://localhost:5000';
      
      return {
        status: true,
        message: "Development mode - payment simulation",
        data: {
          authorization_url: `${baseUrl}/api/payments/dev-simulate?reference=${paymentData.reference}&email=${paymentData.email}&amount=${paymentData.amount}`,
          access_code: "dev-access-code",
          reference: paymentData.reference || "dev-ref-" + Date.now()
        }
      };
    }

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

      console.log("Paystack response body:", response.body);
      console.log("Paystack response status:", response.status);
      
      // Handle both possible response formats
      const responseData = response.body || response;
      console.log("Response data type:", typeof responseData);
      console.log("Response data:", responseData);
      
      if (responseData && typeof responseData === 'object') {
        return responseData as PaymentResponse;
      }
      
      throw new Error("Invalid response format from Paystack");
    } catch (error) {
      console.error("Paystack initialization error:", error);
      throw error;
    }
  }

  async verifyPayment(reference: string): Promise<VerificationResponse> {
    if (!paystackClient) {
      console.log("Paystack not configured - returning mock verification for development");
      return {
        status: true,
        message: "Development mode - payment verification simulation",
        data: {
          id: 123456789,
          domain: "test",
          status: "success",
          reference: reference,
          amount: 5000,
          message: null,
          gateway_response: "Successful",
          paid_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          channel: "card",
          currency: "USD",
          ip_address: "127.0.0.1",
          metadata: {},
          customer: {
            id: 123,
            first_name: "Test",
            last_name: "User",
            email: "test@example.com",
            customer_code: "CUS_test123",
            phone: null,
            metadata: {},
            risk_action: "default"
          },
          authorization: {
            authorization_code: "AUTH_test123",
            bin: "408408",
            last4: "4081",
            exp_month: "12",
            exp_year: "2030",
            channel: "card",
            card_type: "visa",
            bank: "TEST BANK",
            country_code: "NG",
            brand: "visa",
            reusable: true,
            signature: "SIG_test123"
          }
        }
      };
    }

    try {
      console.log("Verifying payment with reference:", reference);
      const response = await paystackClient.transaction.verify(reference);
      console.log("Verification response:", response);
      console.log("Verification response.body:", response.body);
      console.log("Verification response.status:", response.status);
      
      // Handle both possible response formats like in initialization
      const responseData = response.body || response;
      console.log("Verification responseData:", responseData);
      
      if (responseData && typeof responseData === 'object') {
        return responseData as VerificationResponse;
      }
      
      throw new Error("Invalid verification response format from Paystack");
    } catch (error) {
      console.error("Paystack verification error:", error);
      throw error;
    }
  }

  async listTransactions(customer?: string, status?: string, from?: string, to?: string) {
    if (!paystackClient) {
      console.log("Paystack not configured - returning empty transactions for development");
      return {
        status: true,
        message: "Development mode - no transactions",
        data: []
      };
    }

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