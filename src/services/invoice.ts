import { invoices } from "../mock/invoices";
import { Invoice } from "../interfaces/invoices";

class InvoiceService {
  private static instance: InvoiceService;
  private constructor() { }

  getInvoices(): Invoice[] {
    return invoices;
  }

  static getInstance(): InvoiceService {
    if (!InvoiceService.instance) {
      InvoiceService.instance = new InvoiceService();
    }
    return InvoiceService.instance;
  }
}

export default InvoiceService.getInstance();