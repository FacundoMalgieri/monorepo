import React, { ChangeEventHandler } from "react";

import styles from "./Select.module.scss";

type SelectProps = {
  elements: string[];
  onChange: ChangeEventHandler<HTMLSelectElement>;
};

const Select = ({ elements, onChange }: SelectProps) => (
  <select className={styles.select} onChange={onChange}>
    {elements.map((element) => (
      <option key={element}>{element}</option>
    ))}
  </select>
);

export default Select;
