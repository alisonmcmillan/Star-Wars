import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import SearchInput from '../SearchInput';

const FilmsScreen = () => {
  const [filmData, setFilmData] = useState(null); // To store film data
  const [loading, setLoading] = useState(true);  // To handle loading state
  const [error, setError] = useState(null); // To store any error
  const [searchTerm, setSearchTerm] = useState(''); // To store the search term

  // Fetching data when the component mounts or when searchTerm changes
  useEffect(() => {
    // Avoid fetching if searchTerm is empty
    if (!searchTerm) return;

    setLoading(true); // Start loading on search
    fetch(`https://www.swapi.tech/api/films/${searchTerm}`) // Fetch film based on searchTerm
      .then((res) => res.json())
      .then((data) => {
        setFilmData(data.result?.properties || null); // Save the film data or set null if not found
        setLoading(false); // Set loading to false once data is fetched
      })
      .catch((err) => {
        setError(err); // Handle error if the fetch fails
        setLoading(false); // Set loading to false if there's an error
      });
  }, [searchTerm]); // Run useEffect when searchTerm changes

  // Handle search input submission
  const handleSearch = (term) => {
    setSearchTerm(term); // Update the searchTerm state with the input
    setError(null); // Clear any previous error
  };

  // Render loading state, error state, or film data
  if (loading && searchTerm) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error.message}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SearchInput onSubmit={handleSearch} />
      <View style={styles.content}>
        <Text style={styles.title}>Film Information</Text>
        {filmData ? (
          <>
            <Text style={styles.text}>Title: {filmData.title}</Text>
            <Text style={styles.text}>Director: {filmData.director}</Text>
            <Text style={styles.text}>Producer: {filmData.producer}</Text>
            <Text style={styles.text}>Release Date: {filmData.release_date}</Text>
            <Text style={styles.text}>Opening Crawl: {filmData.opening_crawl}</Text>
          </>
        ) : (
          searchTerm && <Text>No data available for film {searchTerm}</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default FilmsScreen;

