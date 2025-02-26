import { IoSearchSharp } from "react-icons/io5";
import { useState } from "react";

interface SearchProps {
  onSearch: (value: string) => void;
  placeholder?: string;
}

const Search = ({ onSearch, placeholder }: SearchProps) => {
  const [value, setValue] = useState("");

  const handleSearch = () => {
    onSearch(value);
  };

  return (
    <div className="flex bg-darkBg2 p-3">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="bg-transparent items-center text-white text-xl flex-grow outline-none"
        placeholder={placeholder || ""}
      />
      <IoSearchSharp className="text-white text-3xl cursor-pointer" onClick={handleSearch} />
    </div>
  );
};

export default Search;
