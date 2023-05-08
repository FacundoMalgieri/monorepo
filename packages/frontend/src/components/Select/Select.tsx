import React, { ChangeEventHandler, useMemo } from "react";

import styles from "./Select.module.scss";

type SelectProps = {
  selected: string;
  onChange: ChangeEventHandler<HTMLSelectElement>;
};

const Select = ({ selected, onChange }: SelectProps) => {
  const selectOptions = useMemo(
    () => [
      {
        label: "USD",
        value: "usd",
      },
      {
        label: "EUR",
        value: "eur",
      },
    ],
    []
  );

  return (
    <select value={selected} className={styles.select} onChange={onChange}>
      {selectOptions.map((e) => (
        <option value={e.value} key={e.value}>
          {e.label.toUpperCase()}
        </option>
      ))}
    </select>
  );
};

export default Select;
