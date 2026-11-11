import React, { memo } from "react";
import { TData } from "../../../types/data";

type TableRowProps = {
  id: string | number;
  data: TData[];
  isValid: boolean; 
};

const TableRow = ({ data, isValid }: TableRowProps & { isValid: boolean }) => (
  <tr style={{ backgroundColor: isValid ? 'white' : 'lightcoral' }}>
    {data.map((item, index) => (
      <td key={`${item}-${index}`}>{item}</td>
    ))}
  </tr>
);

export default memo(TableRow, (prevProps, nextProps) => (
  prevProps.id === nextProps.id
  && prevProps.isValid === nextProps.isValid
));