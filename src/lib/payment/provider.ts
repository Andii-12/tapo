import type { PaymentProviderStatus } from "@/types";

export interface CreatePaymentInput {
  readingId: string;
  amount: number;
  currency: string;
  paymentRef: string;
}

export interface CreatePaymentResult {
  provider: "mock" | "qpay";
  paymentRef: string;
  providerTransactionId: string;
  qrPayload: string;
  checkoutUrl?: string;
  status: PaymentProviderStatus;
}

export interface PaymentProvider {
  name: "mock" | "qpay";
  createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult>;
  checkPayment(providerTransactionId: string): Promise<PaymentProviderStatus>;
}

export class MockPaymentProvider implements PaymentProvider {
  name = "mock" as const;
  private paid = new Set<string>();

  async createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult> {
    const providerTransactionId = `MOCK-${input.paymentRef}`;
    return {
      provider: "mock",
      paymentRef: input.paymentRef,
      providerTransactionId,
      qrPayload: `MOCK_QR:${input.paymentRef}:${input.amount}${input.currency}`,
      checkoutUrl: `/api/payments/mock-pay?ref=${input.paymentRef}`,
      status: "pending",
    };
  }

  async checkPayment(providerTransactionId: string): Promise<PaymentProviderStatus> {
    return this.paid.has(providerTransactionId) ? "paid" : "pending";
  }

  markPaid(providerTransactionId: string) {
    this.paid.add(providerTransactionId);
  }
}

/** Adapter stub for QPay — wire real credentials in production */
export class QPayPaymentProvider implements PaymentProvider {
  name = "qpay" as const;

  async createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult> {
    // Placeholder for real QPay invoice creation
    return {
      provider: "qpay",
      paymentRef: input.paymentRef,
      providerTransactionId: `QPAY-PENDING-${input.paymentRef}`,
      qrPayload: `QPAY:${input.paymentRef}`,
      status: "pending",
    };
  }

  async checkPayment(): Promise<PaymentProviderStatus> {
    return "pending";
  }
}

const mockSingleton = new MockPaymentProvider();

export function getPaymentProvider(): PaymentProvider {
  const provider = process.env.PAYMENT_PROVIDER || "mock";
  if (provider === "qpay") return new QPayPaymentProvider();
  return mockSingleton;
}

export function getMockPaymentProvider(): MockPaymentProvider {
  return mockSingleton;
}
