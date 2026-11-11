import react, { useState } from 'react';
export default (props: {
  defaultValue?: string;
  onChange: (value: string) => void;
}) => {
  const { defaultValue = '', onChange } = props;

  return (
    <input defaultValue={defaultValue} onChange={(e) => onChange(e.target.value)} />
  );
};