import React from 'react'
import { NavLink } from 'react-router-dom'

const AdminMenu = () => {
  return (
    <div className="text-center">
      <div className="list-group">
        <h4>Admin Panel</h4>

        <NavLink
          to="/dashboard/admin/create-category"
          className={({ isActive }) =>
            isActive ? "list-group-item list-group-item-action active" : "list-group-item list-group-item-action"
          }
        >
          Create Category
        </NavLink>

        <NavLink
          to="/dashboard/admin/create-product"
          className={({ isActive }) =>
            isActive ? "list-group-item list-group-item-action active" : "list-group-item list-group-item-action"
          }
        >
          Create Product
        </NavLink>

        <NavLink
          to="/dashboard/admin/products"
          className={({ isActive }) =>
            isActive ? "list-group-item list-group-item-action active" : "list-group-item list-group-item-action"
          }
        >
          Products
        </NavLink>

        <NavLink
          to="/dashboard/admin/orders"
          className={({ isActive }) =>
            isActive ? "list-group-item list-group-item-action active" : "list-group-item list-group-item-action"
          }
        >
          Orders
        </NavLink>

        <NavLink
          to="/dashboard/admin/users"
          className={({ isActive }) =>
            isActive ? "list-group-item list-group-item-action active" : "list-group-item list-group-item-action"
          }
        >
          Users
        </NavLink>
      </div>
    </div>
  )
}

export default AdminMenu
