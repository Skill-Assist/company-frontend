import { FC } from "react";

import styles from "./styles.module.scss";

const Search: FC<{ search: string; onSearch: (value: string) => void, placeholder: string }> = ({
  search,
  onSearch,
  placeholder,
}) => {
  return (
    <div className={styles.content}>
      <div className={styles.inputField}>
        <input
          placeholder={placeholder}
          type="text"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
        />
        <img src="/icons/search.svg" alt="search_icon" />
      </div>
    </div>
  );
};

export default Search;