import React, { useCallback, useEffect } from "react";
import { Invoice } from "../interfaces/invoices";
import { sortBy } from "../utils/sort";
import { groupByKeys } from "../utils/group";

const INVOICE_GROUPING_KEYS: (keyof Invoice)[] = ["vendor", "date", "amount"];

const getInvoiceGroupKey = (invoice: Invoice) => JSON.stringify(INVOICE_GROUPING_KEYS.map((k) => invoice[k]));

export default (invoices: Invoice[]) => {
  const [groupedInvoices, setGroupedInvoices] = React.useState<Map<string, Invoice[]>>(new Map());

  const isValidInvoice = useCallback((invoice: Invoice): boolean => {

    const mapKey = getInvoiceGroupKey(invoice);
    const group = groupedInvoices.get(mapKey);

    if (group && group.length > 1) return false;

    return true;
  }, [groupedInvoices]);

  useEffect(() => {
    setGroupedInvoices(
      groupByKeys(invoices, getInvoiceGroupKey)
    );
  }, [invoices]);

  return { isValidInvoice };
}