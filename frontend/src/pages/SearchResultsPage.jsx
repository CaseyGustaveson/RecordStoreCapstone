import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Pagination } from '@mui/material';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
const SEARCH_API_URL = `${API_URL}/products/search`;

const SearchResultsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const response = await axios.get(`${SEARCH_API_URL}?page=${currentPage}&limit=${itemsPerPage}`);
        console.log('API Response:', response.data); // Log API response for debugging
        setResults(response.data?.results || []);
        setTotalPages(response.data?.totalPages || 1);
      } catch (error) {
        console.error('Error fetching search results:', error); // Log error details
        setError('Failed to fetch search results');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearchResults();
  }, [currentPage, itemsPerPage]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <Box padding={2}>
      <Typography variant="h4" gutterBottom>
        Search Results
      </Typography>
      {isLoading ? (
        <Typography variant="body1">Loading...</Typography>
      ) : (
        <>
          {error ? (
            <Typography variant="body1" color="error">
              {error}
            </Typography>
          ) : (
            <>
              <Grid container spacing={2} marginTop={2}>
                {results.length ? (
                  results.map((result) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={result.id}>
                      <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="space-between"
                        padding={2}
                        border="1px solid #ccc"
                        borderRadius={5}
                        height="100%"
                      >
                        <Typography variant="h5">{result.name}</Typography>
                        <Typography variant="body1">{result.description}</Typography>
                        <Typography variant="body1">${result.price}</Typography>
                      </Box>
                    </Grid>
                  ))
                ) : (
                  <Typography>No results found</Typography>
                )}
              </Grid>
              <Box display="flex" justifyContent="center" marginTop={2}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                />
              </Box>
            </>
          )}
        </>
      )}
    </Box>
  );
};

export default SearchResultsPage;
