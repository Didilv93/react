import TableHeader from "../tableHeader";
import TableRow from "../tableRow";

export default ({ columns, data, sort, handleSort }) => {
  return (
    <table style={{ margin: 'auto', borderCollapse: 'collapse', width: '80%' }}>
      <TableHeader columns={columns} sort={sort} onClick={handleSort} />
      <tbody>
        {data.map((item) => (
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
  );
}