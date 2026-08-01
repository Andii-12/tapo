import type { PaymentProviderStatus } from "@/types";
import {
  createBylInvoice,
  getBylInvoice,
  isBylConfigured,
} from "@/lib/payment/byl-client";
import {
  checkQPayInvoice,
  createQPayInvoice,
  isQPayConfigured,
} from "@/lib/payment/qpay-client";

export type PaymentProviderName = "mock" | "byl" | "qpay";

export interface CreatePaymentInput {
  readingId: string;
  amount: number;
  currency: string;
  paymentRef: string;
  description?: string;
}

export interface PaymentBankLink {
  name: string;
  link: string;
  logo?: string;
  description?: string;
}

export interface CreatePaymentResult {
  provider: PaymentProviderName;
  paymentRef: string;
  providerTransactionId: string;
  qrPayload: string;
  qrImage?: string;
  checkoutUrl?: string;
  bankUrls?: PaymentBankLink[];
  status: PaymentProviderStatus;
}

export interface PaymentProvider {
  name: PaymentProviderName;
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

export class BylPaymentProvider implements PaymentProvider {
  name = "byl" as const;

  async createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult> {
    if (!isBylConfigured()) {
      throw new Error(
        "Byl тохиргоо дутуу байна. BYL_TOKEN болон BYL_PROJECT_ID шалгана уу."
      );
    }

    const invoice = await createBylInvoice({
      amount: input.amount,
      description:
        input.description ||
        `ТАРО төлбөр · ${input.paymentRef} · ${input.amount} ${input.currency}`,
    });

    return {
      provider: "byl",
      paymentRef: input.paymentRef,
      providerTransactionId: invoice.id,
      qrPayload: invoice.url,
      checkoutUrl: invoice.url,
      status: "pending",
    };
  }

  async checkPayment(providerTransactionId: string): Promise<PaymentProviderStatus> {
    const invoice = await getBylInvoice(providerTransactionId);
    return invoice.status === "paid" ? "paid" : "pending";
  }
}

export class QPayPaymentProvider implements PaymentProvider {
  name = "qpay" as const;

  async createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult> {
    if (!isQPayConfigured()) {
      throw new Error(
        "QPay тохиргоо дутуу байна. PAYMENT_USERNAME, PAYMENT_PASSWORD, QPAY_INVOICE_CODE шалгана уу."
      );
    }

    const invoice = await createQPayInvoice({
      senderInvoiceNo: input.paymentRef,
      description:
        input.description ||
        `ТАРО төлбөр · ${input.paymentRef} · ${input.amount} ${input.currency}`,
      amount: input.amount,
    });

    return {
      provider: "qpay",
      paymentRef: input.paymentRef,
      providerTransactionId: invoice.invoiceId,
      qrPayload: invoice.qrText,
      qrImage: invoice.qrImage,
      checkoutUrl: invoice.shortUrl,
      bankUrls: invoice.bankUrls,
      status: "pending",
    };
  }

  async checkPayment(providerTransactionId: string): Promise<PaymentProviderStatus> {
    const result = await checkQPayInvoice(providerTransactionId);
    return result.count > 0 ? "paid" : "pending";
  }
}

const mockSingleton = new MockPaymentProvider();
const bylSingleton = new BylPaymentProvider();
const qpaySingleton = new QPayPaymentProvider();

export function getPaymentProvider(): PaymentProvider {
  const provider = process.env.PAYMENT_PROVIDER || "mock";
  if (provider === "byl") return bylSingleton;
  if (provider === "qpay") return qpaySingleton;
  return mockSingleton;
}

export function getProviderByName(name: PaymentProviderName): PaymentProvider {
  if (name === "byl") return bylSingleton;
  if (name === "qpay") return qpaySingleton;
  return mockSingleton;
}

export function getMockPaymentProvider(): MockPaymentProvider {
  return mockSingleton;
}
