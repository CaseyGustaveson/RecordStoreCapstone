import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';


const CategoryDetail = ({ match }) => {
  const { data: category, isLoading, error } = useQuery('category', async () => {
    const { data } = await axios.get(`/api/categories/${match.params.id}`);
    return data;
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div>
      <h2>{category.name}</h2>
      <ul>
        {category.products.map((product) => (
          <li key={product.id}>
            <Link to={`/products/${product.id}`}>{product.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CategoryDetail;