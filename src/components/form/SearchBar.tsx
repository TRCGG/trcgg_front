import { IoSearchSharp } from "react-icons/io5";

interface SearchProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  onFocus: () => void;
  placeholder?: string;
}

const SearchBar = ({ value, onChange, onSearch, onFocus, placeholder }: SearchProps) => {
  return (
    <div className="flex bg-darkBg2 pl-3 pr-1 py-2">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent items-center text-white flex-grow outline-none text-base sm:text-lg"
        placeholder={placeholder || ""}
        onKeyDown={(e) => e.key === "Enter" && onSearch()}
        onFocus={onFocus}
      />
      <IoSearchSharp className="text-white cursor-pointer w-[32px] h-[32px]" onClick={onSearch} />
    </div>
  );
};

export default SearchBar;
