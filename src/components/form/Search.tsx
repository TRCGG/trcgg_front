import { IoSearchSharp } from "react-icons/io5";

interface SearchProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch: (value: string) => void;
  placeholder?: string;
}

const Search = ({ value, onChange, onSearch, placeholder }: SearchProps) => {
  const handleSearch = () => {
    onSearch(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch(value.trim());
    }
  };

  return (
    <div className="flex bg-darkBg2 pl-3 pr-1 py-2">
      <input
        value={value}
        onChange={onChange}
        className="bg-transparent items-center text-white text-xl flex-grow outline-none"
        placeholder={placeholder || ""}
        onKeyDown={handleKeyDown}
      />
      <IoSearchSharp
        className="text-white cursor-pointer w-[32px] h-[32px]"
        onClick={handleSearch}
      />
    </div>
  );
};

export default Search;
