import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import styles from "./SearchBar.module.css";

/*
  SEARCH BAR COMPONENT
  ---------------------
  A simple search input. When submitted, it navigates the user
  to /browse?q=<searchTerm> using react-router's useNavigate.

  In Phase 3, the BrowsePage will READ the "?q=" param from the URL
  and use it to filter the pet list.
*/
function SearchBar() {
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();    // prevents page refresh
    const q = e.target.search.value.trim();
    if (q) {
      navigate(`/browse?q=${encodeURIComponent(q)}`);
    } else {
      navigate("/browse");
    }
  }

  return (
    <form className={styles.searchbar} onSubmit={handleSubmit} role="search">
      <div className={styles.searchbar__inner}>
        <FaSearch className={styles.searchbar__icon} />
        <input
          id="search"
          name="search"
          type="text"
          placeholder="Search by name, breed, or location..."
          className={styles.searchbar__input}
          autoComplete="off"
        />
        <button type="submit" className={`btn btn-primary ${styles.searchbar__btn}`}>
          Search
        </button>
      </div>
    </form>
  );
}

export default SearchBar;