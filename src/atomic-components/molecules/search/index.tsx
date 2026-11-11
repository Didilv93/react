import { useCallback, useState } from "react";
import Textfield from "../../atoms/textfield";
import { debounce } from "../../../utils/debounce";

export default ({ onChange }: { onChange: (value: string) => void }) => {
  const [value, setValue] = useState('');

  const handleSearchDebounced = useCallback(debounce((newValue: string) => {
    onChange(newValue);
  }, 300), [onChange]);

  const handleSearch = (newValue: string) => {
    setValue(newValue);
    handleSearchDebounced(newValue);
  }

  return (<Textfield value={value} onChange={handleSearch} />);
};