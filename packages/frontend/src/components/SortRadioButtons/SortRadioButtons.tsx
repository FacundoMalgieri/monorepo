import React, { ChangeEvent } from "react";

import { SortType } from "App";

const sortOptions: { label: string; value: SortType }[] = [
  { label: "Older added", value: "ASC" },
  { label: "Newer added", value: "DSC" },
  { label: "Favorites", value: "FAV" },
];

const SortRadioButtons = ({
  onSortChange,
  sortBy,
}: {
  onSortChange: (sort: SortType) => void;
  sortBy: SortType;
}) => {
  const handleSortChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newSort = event.target.value as SortType;
    onSortChange(newSort);
  };

  return (
    <div>
      {sortOptions.map(({ label, value }) => (
        <label key={value}>
          <input
            type="radio"
            name="sort"
            value={value}
            checked={sortBy === value}
            onChange={handleSortChange}
          />
          {label}
        </label>
      ))}
    </div>
  );
};

export default SortRadioButtons;
