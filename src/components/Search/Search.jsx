import SearchIcon from "../../assets/images/svg/search.svg";
import "./search.scss";
import Button from "../Button";
import { Fragment, useCallback, useEffect, useState } from "react";
import axios from "axios";
import { debounce } from "../../helpers/all";
import SearchDropdown from "../Dropdown/SearchDropdown";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Search = () => {
  const router = useRouter();
  const tabIndex = 1;
  const [query, setQuery] = useState("");
  const [results, setResults] = useState({
    videos: [],
    notes: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  let cancelToken;

  const fetchSearchResults = useCallback(
    debounce(async (searchTerm) => {
      if (!searchTerm) {
        setResults({ videos: [], notes: [] });
        return;
      }

      setLoading(true);
      setError(null);

      if (cancelToken) {
        cancelToken.cancel("Operation canceled due to new request.");
      }

      cancelToken = axios.CancelToken.source();

      try {
        const response = await axios.post(
          "/api/search",
          {
            search: searchTerm,
          },
          { cancelToken: cancelToken.token }
        );

        setResults(response.data.data);
      } catch (error) {
        if (axios.isCancel(error)) {
          console.error("Request canceled", error.message);
        }
        if (error?.response?.status === 401) {
          return router.push("/login");
        }
        setError(error.response?.data?.error || error.message);
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    if (query) {
      fetchSearchResults(query);
    } else {
      setResults({ videos: [], notes: [] });
    }
  }, [query, fetchSearchResults]);

  return (
    <Fragment>
      <div className={`dropdown cursor-pointer dropdown-start search-wrapper`}>
        <div className="searchBox flex items-center">
          <div className="inputField  w-full">
            <div className="rounded-0">
              <input
                id="search"
                type="text"
                className="lg:w-96 w-full input-sm"
                placeholder="Search for anything here..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Optional Button if needed */}
          {/* <Button
                        variant='btn-search'
                        iconPosition='left'
                        icon={SearchIcon}
                        size='btn-sm'
                        onClick={() => fetchSearchResults(query)}
                    /> */}
        </div>

        {query && (
          <ul
            tabIndex={tabIndex}
            className="dropdown-content z-10 menu p-2 mt-2 shadow bg-primary-content searchDropdown dropdown-tag"
          >
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}
            {!loading && !error && (
              <>
                {results.videos.length > 0 && (
                  <>
                    {results.videos.map((video) => (
                      <li key={video._id}>
                        <Link href={`/live_session/${video._id}`}>
                          {video.title} (Video)
                        </Link>
                      </li>
                    ))}
                  </>
                )}
                {results.notes.length > 0 && (
                  <>
                    {results.notes.map((note) => (
                      <li key={note._id}>
                        <Link href={`/notes/${note._id}`}>
                          {note.title} (Notes)
                        </Link>
                      </li>
                    ))}
                  </>
                )}

                {results.videos.length === 0 && results.notes.length === 0 ? (
                  <div>Data Not Available</div>
                ) : null}
              </>
            )}
          </ul>
        )}
      </div>
    </Fragment>
  );
};

export default Search;
