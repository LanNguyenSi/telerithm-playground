import { getTelerithmClient, type LogEntry } from "./telerithm";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function runFailedLogin(): Promise<number> {
  const client = getTelerithmClient();
  
  const logs: LogEntry[] = [
    {
      level: "info",
      service: "auth-service",
      message: "Login attempt started",
      fields: { userId: "user_123", ip: "192.168.1.100" },
    },
    {
      level: "warn",
      service: "auth-service",
      message: "Invalid password attempt 1/3",
      fields: { userId: "user_123", attemptCount: 1 },
    },
    {
      level: "warn",
      service: "auth-service",
      message: "Invalid password attempt 2/3",
      fields: { userId: "user_123", attemptCount: 2 },
    },
    {
      level: "error",
      service: "auth-service",
      message: "Invalid password attempt 3/3",
      fields: { userId: "user_123", attemptCount: 3 },
    },
    {
      level: "error",
      service: "auth-service",
      message: "Account locked due to failed login attempts",
      fields: { userId: "user_123", lockDuration: "30m" },
    },
  ];

  await client.sendLogs(logs);
  return logs.length;
}

export async function runSlowCheckout(): Promise<number> {
  const client = getTelerithmClient();
  
  const logs: LogEntry[] = [
    {
      level: "info",
      service: "payment-service",
      message: "Checkout initiated",
      fields: { orderId: "ord_456", amount: 129.99, currency: "EUR" },
    },
    {
      level: "info",
      service: "payment-service",
      message: "Calling payment gateway",
      fields: { orderId: "ord_456", gateway: "stripe" },
    },
    {
      level: "warn",
      service: "payment-service",
      message: "Payment gateway response slow (>2s)",
      fields: { orderId: "ord_456", responseTime: 2300 },
    },
    {
      level: "error",
      service: "payment-service",
      message: "Payment gateway timeout",
      fields: { orderId: "ord_456", timeout: 5000 },
    },
    {
      level: "info",
      service: "payment-service",
      message: "Retrying payment",
      fields: { orderId: "ord_456", retryCount: 1 },
    },
    {
      level: "warn",
      service: "payment-service",
      message: "Retry response slow (>1s)",
      fields: { orderId: "ord_456", responseTime: 1400 },
    },
    {
      level: "info",
      service: "payment-service",
      message: "Payment successful",
      fields: { orderId: "ord_456", transactionId: "tx_789" },
    },
    {
      level: "info",
      service: "payment-service",
      message: "Order confirmed",
      fields: { orderId: "ord_456", status: "completed" },
    },
  ];

  await client.sendLogs(logs);
  return logs.length;
}

export async function runNormalTraffic(): Promise<number> {
  const client = getTelerithmClient();
  
  const services = ["api-gateway", "user-service", "product-service"];
  const logs: LogEntry[] = [];

  for (let i = 0; i < 100; i++) {
    const service = services[i % services.length];
    const level = i % 10 === 0 ? "warn" : "info";
    
    logs.push({
      level,
      service,
      message: level === "warn" 
        ? `Slow response detected: ${100 + i}ms`
        : `Request processed successfully`,
      fields: {
        requestId: `req_${i.toString().padStart(4, "0")}`,
        responseTime: 50 + Math.random() * 100,
        endpoint: `/api/v1/${service.split("-")[0]}`,
      },
    });
  }

  // Send in batches of 25 to avoid overwhelming the API
  for (let i = 0; i < logs.length; i += 25) {
    await client.sendLogs(logs.slice(i, i + 25));
    await sleep(100); // Small delay between batches
  }

  return logs.length;
}

export async function runPaymentError(): Promise<number> {
  const client = getTelerithmClient();
  
  const logs: LogEntry[] = [
    {
      level: "info",
      service: "payment-service",
      message: "Payment initiated",
      fields: { orderId: "ord_789", amount: 249.99, currency: "EUR" },
    },
    {
      level: "info",
      service: "payment-service",
      message: "Calling Stripe API",
      fields: { orderId: "ord_789", gateway: "stripe" },
    },
    {
      level: "error",
      service: "payment-service",
      message: "Stripe API error: card_declined",
      fields: { orderId: "ord_789", errorCode: "card_declined" },
    },
    {
      level: "error",
      service: "payment-service",
      message: "Payment failed: insufficient funds",
      fields: { orderId: "ord_789", reason: "insufficient_funds" },
    },
    {
      level: "warn",
      service: "payment-service",
      message: "Retrying payment (1/2)",
      fields: { orderId: "ord_789", retryCount: 1 },
    },
    {
      level: "error",
      service: "payment-service",
      message: "Retry failed: card_declined again",
      fields: { orderId: "ord_789", retryCount: 1 },
    },
    {
      level: "error",
      service: "payment-service",
      message: "Payment permanently failed — order cancelled",
      fields: { orderId: "ord_789", finalStatus: "cancelled" },
    },
    {
      level: "info",
      service: "payment-service",
      message: "Customer notified of payment failure",
      fields: { orderId: "ord_789", channel: "email" },
    },
  ];

  await client.sendLogs(logs);
  return logs.length;
}
