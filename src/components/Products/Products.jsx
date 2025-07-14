import React, { useEffect } from 'react';
import { AppContext } from '../../contexts/AppContext.jsx';

const Products = () => {

  const { API_BASE_URL } = React.useContext(AppContext);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/products`)
      .then(response => response.json())
      .then(data => {
        console.log('Products data:', data);
        // Here you can set the state to display the products in the table
      })
      .catch(error => {
        console.error('Error fetching products:', error);
      });
  }, []);


  return (
    <div>
      <h1>Products</h1>
      <table>
        <thead>
          <tr>
            {/* Table headers will be defined later */}
          </tr>
        </thead>
        <tbody>
          {/* Table rows will be populated later */}
        </tbody>
      </table>
    </div>
  );
};

export default Products;
