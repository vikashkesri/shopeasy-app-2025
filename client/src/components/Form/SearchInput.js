// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { useSearch } from "../../context/search";

// const SearchInput = () => {
//   const [keyword, setKeyword] = useState("");
//   const [values, setValues] = useSearch();
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!keyword.trim()) return; // prevent empty searches

//     try {
//       const { data } = await axios.get(
//         `http://localhost:5000/api/v1/product/search?keyword=${keyword}`
//       );

//       // Don't rely only on data.success
//       if (data?.results) {
//         setValues({
//           ...values,
//           keyword,
//           results: data.results,
//         });
//         navigate("/search");
//       } else {
//         setValues({
//           ...values,
//           keyword,
//           results: [],
//         });
//         navigate("/search");
//       }
//     } catch (error) {
//       console.log("Search Error:", error);
//     }
//   };

//   return (
//     <form className="d-flex" onSubmit={handleSubmit}>
//       <input
//         type="search"
//         value={keyword}
//         onChange={(e) => setKeyword(e.target.value)}
//         placeholder="Search products..."
//         className="form-control me-2"
//       />
//       <button className="btn btn-outline-primary" type="submit">
//         Search
//       </button>
//     </form>
//   );
// };

// export default SearchInput;


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSearch } from "../../context/search";

const SearchInput = () => {
  const [keyword, setKeyword] = useState("");
  const [search, setSearch] = useSearch(); // renamed for clarity
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!keyword.trim()) return; // prevent empty searches

    try {
      const { data } = await axios.get(
        `http://localhost:5000/api/v1/product/search?keyword=${keyword}`
      );

      // update search context with results
      setSearch({
        ...search,
        keyword,
        results: data?.results || [],
      });

      navigate("/search");
    } catch (error) {
      console.log("Search Error:", error);
    }
  };

  return (
    <form className="d-flex" onSubmit={handleSubmit}>
      <input
        type="search"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Search products..."
        className="form-control me-2"
      />
      <button className="btn btn-outline-primary" type="submit">
        Search
      </button>
    </form>
  );
};

export default SearchInput;
