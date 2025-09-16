import { useState, useEffect } from "react";
import axios from "axios";
import { server } from "../config"; // ✅ import server

const useCategory = () => {
  const [categories, setCategories] = useState([]);

  const getCategories = async () => {
    try {
      const { data } = await axios.get(`${server}/api/v1/category/get-category`);
      if (data?.success) setCategories(data.category);
    } catch (error) {
      console.log("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  return categories;
};

export default useCategory;
