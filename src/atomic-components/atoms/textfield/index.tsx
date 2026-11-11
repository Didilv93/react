type TextFieldProps = {
  value: string;
  onChange: (value: string) => void;
};

export default ({ value, onChange }: TextFieldProps) => (
  <input
    type="text"
    value={value}
    onChange={(e) => onChange(e.target.value)}
  />
);