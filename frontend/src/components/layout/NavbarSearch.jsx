import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

import Input from "../ui/Input";

function NavbarSearch({ mobile = false }) {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const value = search.trim();

    if (!value) return;

    navigate(`/catalogo?search=${encodeURIComponent(value)}`);

    setSearch("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`${mobile ? "flex" : "hidden lg:flex"} flex-1 px-8`}
    >
      <div className="relative w-full">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <Input
          type="text"
          placeholder="Buscar productos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-full border-gray-300 py-2.5 pl-11 pr-5 focus:border-violet-600"
        />
      </div>
    </form>
  );
}

export default NavbarSearch;