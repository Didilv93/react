import React from "react";
import './style.css';

const getsortedIcon = (desc?: boolean) => {
  if (desc === false) return '▲';
  if (desc === true) return '▼';
  return '';
};

type TableHeaderProps = {
  columns: { key: string, label: string }[];
  sort: { key: string, desc: boolean };
  onClick?: (key: string) => void;
};

export default ({ columns, sort, onClick }: TableHeaderProps) => {
  const sortedIcon = getsortedIcon(sort.desc);
  return (
    <thead className="table-header">
      <tr className="table-row">
        {columns.map((item, index) => (
          <th className="table-header-cell" key={`${item.key}-${index}`}>
            <div className="action" onClick={() => onClick?.(item.key)}>
              {item.label} {sort.key === item.key ? sortedIcon : ''}
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );
};