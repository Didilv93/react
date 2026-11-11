import { useCallback, useEffect, useMemo, useState } from 'react';
import { Invoice } from '../../../interfaces/invoices';
import invoiceService from '../../../services/invoice';
import TableHeader from '../../organims/tableHeader';
import TableRow from '../../organims/tableRow';
import useInvoices from '../../../hooks/useInvoices';
import { sortBy } from '../../../utils/sort';
import { INVOICE_STATUS } from '../../../utils/enum/invoice';
import { parseNumber } from '../../../utils/parse/number';
import { filterByText } from '../../../utils/filter/text';
import Search from '../../molecules/search';

const COLUMNS = [
  {
    key: 'id',
    label: 'ID',
  },
  {
    key: 'vendor',
    label: 'Vendor',
  },
  {
    key: 'amount',
    label: 'Amount',
  },
  {
    key: 'date',
    label: 'Date',
  },
  {
    key: 'status',
    label: 'Status',
  }
];

const parseDictionary: { [key: string]: typeof parseNumber } = {
  id: parseNumber,
  amount: parseNumber,
}

const getStatusLabel = (status: INVOICE_STATUS) => {
  switch (status) {
    case INVOICE_STATUS.VALID:
      return 'Valid';
    case INVOICE_STATUS.DUPLICATE:
      return 'Duplicate';
    default:
      return '';
  }
}

export default function InvoiceDashboard(): React.JSX.Element {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [sort, setSort] = useState({ key: COLUMNS[0].key, desc: false });
  const [search, setSearch] = useState('');

  const { isValidInvoice } = useInvoices(invoices);

  const handleSort = (key: string) => {
    setSort((prev) => ({
      key,
      desc: prev.key === key ? !prev.desc : false,
    }));
  }

  const handleSearch = useCallback((value: string) => {
    setSearch(value);
  }, []);

  useEffect(() => {
    setInvoices(invoiceService.getInvoices());
  }, []);

  const filteredInvoices = useMemo(() => (
    filterByText(invoices, search, 'vendor')
  ), [invoices, search]);

  const data = useMemo(() => (
    sortBy(
      filteredInvoices.map((invoice) => ({
        id: invoice.id,
        vendor: invoice.vendor,
        amount: invoice.amount,
        date: invoice.date,
        status: isValidInvoice(invoice) ? INVOICE_STATUS.VALID : INVOICE_STATUS.DUPLICATE,
      })),
      sort.desc,
      sort.key as keyof Invoice,
      { parser: parseDictionary[sort.key] }
    )
  ), [filteredInvoices, isValidInvoice, sort.desc, sort.key]);

  return (
    <div style={{ display: 'flex', width: '100%', flexDirection: 'column', padding: '2rem', alignItems: 'center' }}>
      <div style={{ display: 'flex', margin: '2rem 0rem', maxWidth: '800px', flexDirection: 'column' }}>
        <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ textAlign: 'center' }}>Invoice Dashboard</h1>
          <Search onChange={handleSearch} />
        </div>
        <div style={{ width: '800px', height: '500px', overflow: 'auto' }} >
          <table style={{ margin: 'auto', borderCollapse: 'collapse', width: '80%' }}>
            <TableHeader columns={COLUMNS} sort={sort} onClick={handleSort} />
            <tbody>
              {data.map((invoice) => (
                <TableRow
                  data={[
                    invoice.id, invoice.vendor, invoice.amount,
                    invoice.date, getStatusLabel(invoice.status),
                  ]}
                  id={invoice.id}
                  isValid={invoice.status === INVOICE_STATUS.VALID}
                  key={invoice.id}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
