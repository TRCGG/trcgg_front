import { IoSearchSharp } from "react-icons/io5";

interface SearchProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  placeholder?: string;
}

const Search = ({ value, onChange, onSearch, placeholder }: SearchProps) => {
  return (
    <div className="flex bg-darkBg2 pl-3 pr-1 py-2">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent items-center text-white text-xl flex-grow outline-none"
        placeholder={placeholder || ""}
        onKeyDown={(e) => e.key === "Enter" && onSearch()}
      />
      <IoSearchSharp className="text-white cursor-pointer w-[32px] h-[32px]" onClick={onSearch} />
    </div>
  );
};

export default Search;
