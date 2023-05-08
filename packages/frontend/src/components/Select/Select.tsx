import React, { ChangeEventHandler } from "react";

import styles from "./Select.module.scss";

type SelectProps = {
  selected: string;
  elements: Record<string, string>[];
  onChange: ChangeEventHandler<HTMLSelectElement>;
};

const Select = ({ selected, elements, onChange }: SelectProps) => (
  <select value={selected} className={styles.select} onChange={onChange}>
    {elements.map((e) => (
      <option value={e.value} key={e.value}>
        {e.label.toUpperCase()}
      </option>
    ))}
  </select>
);

export default Select;
