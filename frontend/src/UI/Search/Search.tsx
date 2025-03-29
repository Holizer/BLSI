import classes from './Search.module.scss'
import { ReactComponent as SearchIcon } from '../../assets/icons/search.svg';

const Search = () => {
      return (
            <button className={classes.search}>
                  <SearchIcon className={classes.searchIcon}/>
            </button>
      );
};

export default Search;
