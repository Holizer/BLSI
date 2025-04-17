import { useState, useRef, useEffect } from 'react';
import classes from './Search.module.scss';
import { ReactComponent as SearchIcon } from '../../assets/icons/search.svg';

interface SearchProps {
      tableId: string;
      onSearch: (tableId: string, query: string) => void;
}

const Search = ({ tableId, onSearch }: SearchProps) => {
      const [isOpen, setIsOpen] = useState(false);
      const [query, setQuery] = useState('');
      const inputRef = useRef<HTMLInputElement>(null);
      const searchRef = useRef<HTMLDivElement>(null);

      const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setQuery(e.target.value);
            onSearch(tableId, e.target.value);
      };

      const toggleSearch = () => {
            setIsOpen(!isOpen);
      };

      useEffect(() => {
            if (isOpen && inputRef.current) {
                  inputRef.current.focus();
            }
      }, [isOpen]);

      return (
            <div className={`${classes.searchContainer} ${isOpen ? classes.open : classes.close}`} ref={searchRef}>
                  <input
                        ref={inputRef}
                        type="text"
                        placeholder="Поиск..."
                        onChange={handleChange}
                        value={query}
                        className={classes.searchInput}
                  />
                  <button className={classes.searchButton} onClick={toggleSearch}>
                        <SearchIcon className={classes.searchIcon} />
                  </button>
            </div>
      );
};

export default Search;