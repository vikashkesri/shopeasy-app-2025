import { useEffect, useState } from 'react';
import Layout from '../../components/Layout/Layout';
import AdminMenu from '../../components/Layout/AdminMenu';
import toast from 'react-hot-toast';
import axios from "axios";
import CategoryForm from '../../components/Form/CategoryForm';
import { useAuth } from "../../context/auth";
import { Modal } from 'antd';

const CreateCategory = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [auth] = useAuth(); 
  const token = auth?.token; 
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(null);
  const [updateName, setUpdateName] = useState("");

  // Fetch or get all categories
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:5000/api/v1/category/get-category"
      );
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to fetch categories");
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  // Create category
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return toast.error("You are not logged in");

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/v1/category/create-category",
        { name },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (data.success) {
        toast.success(`${name} created successfully`);
        setName("");
        getAllCategory();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Create category error:", error.response?.data || error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  // Update category
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!token) return toast.error("You are not logged in");

    try {
      const { data } = await axios.put(
        `http://localhost:5000/api/v1/category/update-category/${selected._id}`,
        { name: updateName },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success(`${updateName} updated successfully`);
        setSelected(null);
        setUpdateName("");
        setVisible(false);
        getAllCategory();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Update category error:", error.response?.data || error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  // Delete category
  const handleDelete = async (id) => {
    if (!token) return toast.error("You are not logged in");

    try {
      const { data } = await axios.delete(
        `http://localhost:5000/api/v1/category/delete-category/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success("Category deleted successfully");
        getAllCategory();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Delete category error:", error.response?.data || error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <Layout title={"Dashboard - Create Category"}>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1>Manage Category</h1>

            <div className="p-3 w-50">
              <CategoryForm handleSubmit={handleSubmit} value={name} setValue={setName} />
            </div>

            <div>
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map(c => (
                    <tr key={c._id}>
                      <td>{c.name}</td>
                      <td>
                        <button 
                          className="btn btn-primary ms-2"
                          onClick={() => {
                            setVisible(true);
                            setUpdateName(c.name);
                            setSelected(c);
                          }}
                        >
                          Edit
                        </button>
                        <button 
                          className="btn btn-danger ms-2"
                          onClick={() => handleDelete(c._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Modal 
              onCancel={() => setVisible(false)} 
              footer={null}
              open={visible}
            >
              <CategoryForm 
                value={updateName} 
                setValue={setUpdateName} 
                handleSubmit={handleUpdate}
              />
            </Modal>

          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateCategory;
