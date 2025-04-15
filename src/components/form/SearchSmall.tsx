import { IoSearchSharp } from "react-icons/io5";

interface SearchProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  placeholder?: string;
}

const SearchSmall = ({ value, onChange, onSearch, placeholder }: SearchProps) => {
  return (
    <div className="flex items-center bg-darkBg2 py-1 pl-2 rounded border border-border2 w-full md:w-[400px] h-[2.6rem]">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent items-center text-white text-md flex-grow outline-none"
        placeholder={placeholder || ""}
        onKeyDown={(e) => e.key === "Enter" && onSearch()}
      />
      <IoSearchSharp className="text-white text-[2rem] cursor-pointer" onClick={onSearch} />
    </div>
  );
};

export default SearchSmall;
