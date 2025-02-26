import { IoSearchSharp } from "react-icons/io5";
import { useState } from "react";

const Search = ({ onSearch }: { onSearch: (query: string) => void }) => {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    onSearch(query);
  };

  return (
    <div className="flex bg-darkBg2 p-3">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="bg-transparent items-center text-white text-xl flex-grow outline-none"
        placeholder="닉네임을 입력하세요"
      />
      <IoSearchSharp className="text-white text-3xl" onClick={handleSearch} />
    </div>
  );
};

export default Search;
