import React from "react";
import debounce from "lodash.debounce";

interface IProps {
  searchTerm: string;
  handleSearchTerm: (searchTerm: string) => void;
}

export default function Search({ searchTerm, handleSearchTerm }: IProps) {
  const [search, setSearch] = React.useState("");

  React.useEffect(() => {
    setSearch(searchTerm);
  }, []);

  const debounceCallback = React.useCallback(
    debounce((searchTerm) => {
      handleSearchTerm(searchTerm);
    }, 500),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    debounceCallback(e.target.value);
  };

  return (
    <div>
      <input
        name="search"
        placeholder="Type here..."
        onChange={handleSearchChange}
        value={search}
      />
    </div>
  );
}
