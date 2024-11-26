declare module 'midtrans-client' {
    interface ClientOptions {
      isProduction: boolean;
      serverKey: string;
      clientKey: string;
    }
  
    interface TransactionParam {
      transaction_details: {
        order_id: string;
        gross_amount: number;
      };
      item_details?: Array<{
        id: string;
        price: number;
        quantity: number;
        name: string;
      }>;
      customer_details?: {
        first_name?: string;
        last_name?: string;
        email?: string;
        phone?: string;
      };
      [key: string]: any;
    }
  
    interface TransactionResponse {
      status_code: string;
      status_message: string;
      transaction_id: string;
      order_id: string;
      gross_amount: string;
      payment_type: string;
      transaction_time: string;
      transaction_status: string;
      fraud_status: string;
      [key: string]: any;
    }
  
    class CoreApi {
      constructor(options: ClientOptions);
  
      charge(param: TransactionParam): Promise<TransactionResponse>;
      checkTransaction(orderId: string): Promise<TransactionResponse>;
      capture(transactionId: string): Promise<TransactionResponse>;
      refund(transactionId: string, params: any): Promise<TransactionResponse>;
      // Add other methods as needed
    }
  
    class Snap {
      constructor(options: ClientOptions);
  
      createTransaction(param: TransactionParam): Promise<TransactionResponse>;
      createTransactionRedirectUrl(param: TransactionParam): Promise<string>;
      createTransactionToken(param: TransactionParam): Promise<string>;
      // Add other methods as needed
    }
  
    export { CoreApi, Snap };
  }
  