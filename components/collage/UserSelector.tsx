import React, { useCallback } from "react";
import { CollageFilters } from "../../types/filters";

export default function UserSelector({
  users,
  filters,
  setFilters,
}: {
  users: string[];
  filters: CollageFilters;
  setFilters: React.Dispatch<React.SetStateAction<CollageFilters>>;
}) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const players = Array.from(
        e.target.selectedOptions,
        (option) => option.value
      );
      setFilters({ ...filters, players });
    },
    [filters, setFilters]
  );

  return (
    <div className="flex flex-col items-center">
      <select multiple value={filters.players ?? users} onChange={handleChange}>
        {users.map((user) => (
          <option key={user}>{user}</option>
        ))}
      </select>
    </div>
  );
}
