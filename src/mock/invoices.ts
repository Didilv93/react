import { Invoice } from "../interfaces/invoices";

const vendors = [
  "Amazon",
  "Google",
  "Meta",
  "Microsoft",
  "Apple",
  "Netflix",
  "Adobe",
  "Slack",
  "Salesforce",
  "Stripe",
  "Notion",
  "Figma",
  "GitHub",
  "Atlassian",
  "Mailchimp"
];

const generateInvoices = (): Invoice[] => {
  const invoices: Invoice[] = [];
  const startDate = new Date("2024-01-01");
  
  // Criar alguns casos de repetição (mesmo vendor, amount e date)
  const duplicatePatterns = [
    { vendor: "Amazon", amount: 500, days: 10 },
    { vendor: "Google", amount: 1200, days: 45 },
    { vendor: "Meta", amount: 750, days: 90 },
    { vendor: "Microsoft", amount: 2000, days: 150 },
    { vendor: "Apple", amount: 1500, days: 200 }
  ];
  
  for (let i = 1; i <= 1000; i++) {
    let randomVendor: string;
    let randomAmount: number;
    let randomDays: number;
    
    // 10% de chance de usar um padrão duplicado
    if (Math.random() < 0.1 && duplicatePatterns.length > 0) {
      const pattern = duplicatePatterns[Math.floor(Math.random() * duplicatePatterns.length)];
      randomVendor = pattern.vendor;
      randomAmount = pattern.amount;
      randomDays = pattern.days;
    } else {
      randomVendor = vendors[Math.floor(Math.random() * vendors.length)];
      randomAmount = Math.floor(Math.random() * 5000) + 50;
      randomDays = Math.floor(Math.random() * 365);
    }
    
    const invoiceDate = new Date(startDate);
    invoiceDate.setDate(invoiceDate.getDate() + randomDays);
    
    invoices.push({
      id: String(i),
      vendor: randomVendor,
      amount: randomAmount,
      date: invoiceDate.toISOString().split("T")[0]
    });
  }
  
  return invoices;
};

export const invoices: Invoice[] = generateInvoices();