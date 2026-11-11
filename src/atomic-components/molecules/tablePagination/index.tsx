type TablePaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export const TablePagination = ({ page, totalPages, onPageChange }: TablePaginationProps) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'end', gap: '1rem', padding: '1rem' }}>
      <button onClick={() => onPageChange(page - 1)} disabled={page === 1}>
        Previous
      </button>
      <span>{`Page ${page} of ${totalPages}`}</span>
      <button onClick={() => onPageChange(page + 1)} disabled={page === totalPages}>
        Next
      </button>
    </div>
  );
};