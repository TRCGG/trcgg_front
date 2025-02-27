import { IoSearchSharp } from "react-icons/io5";
import { useState } from "react";

interface SearchProps {
  onSearch: (value: string) => void;
  placeholder?: string;
}

const SearchSmall = ({ onSearch, placeholder }: SearchProps) => {
  const [value, setValue] = useState("");

  const handleSearch = () => {
    onSearch(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch(value.trim());
    }
  };

  return (
    <div className="flex items-center bg-darkBg2 py-1 pl-2 rounded border border-border2 w-80 h-[2.6rem]">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="bg-transparent items-center text-white text-md flex-grow outline-none"
        placeholder={placeholder || ""}
        onKeyDown={handleKeyDown}
      />
      <IoSearchSharp className="text-white text-[2rem] cursor-pointer" onClick={handleSearch} />
    </div>
  );
};

export default SearchSmall;
