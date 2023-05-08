import React, { ChangeEvent, FC, useMemo } from "react";

import { SortType } from "App";

import styles from "./RadioButtons.module.scss";

type RadioButtonsProps = {
  onSortChange: (sort: SortType) => void;
  sortBy: SortType;
};

const RadioButtons: FC<RadioButtonsProps> = ({ onSortChange, sortBy }) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newSort = event.target.value as SortType;
    onSortChange(newSort);
  };

  const sortOptions: { label: string; value: SortType }[] = useMemo(
    () => [
      { label: "Oldest added", value: "ASC" },
      { label: "Newest added", value: "DSC" },
      { label: "Favorites", value: "FAV" },
    ],
    []
  );

  return (
    <div className={styles.container}>
      {sortOptions.map(({ label, value }) => (
        <label key={value}>
          <input
            type="radio"
            name="sort"
            value={value}
            checked={sortBy === value}
            onChange={handleChange}
          />
          {label}
        </label>
      ))}
    </div>
  );
};

export default RadioButtons;
