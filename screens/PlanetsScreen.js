import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import SearchInput from '../SearchInput';

const PlanetsScreen = () => {
  // State to hold planet data, loading status, search input, and error
  const [planetData, setPlanetData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch planet data from the API on component mount or when searchTerm changes
  useEffect(() => {
    // Avoid fetching if searchTerm is empty
    if (!searchTerm) return;

    setLoading(true); // Start loading on search
    fetch(`https://www.swapi.tech/api/planets/${searchTerm}`)
      .then((res) => res.json())
      .then((data) => {
        setPlanetData(data.result?.properties || null); // Save the relevant data or set null if not found
        setLoading(false); // Set loading to false when data is fetched
      })
      .catch((err) => {
        setError(err); // Set error state if the fetch fails
        setLoading(false); // Set loading to false if there's an error
      });
  }, [searchTerm]); // Dependency array includes searchTerm

  // Handle the search input submission
  const handleSearch = (term) => {
    setSearchTerm(term); // Update the searchTerm state with the input
    setError(null); // Clear any previous error
  };

  // Render loading state, error state, or planet data
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
        <Text style={styles.title}>Planet Information</Text>
        {planetData ? (
          <>
            <Text>Name: {planetData.name}</Text>
            <Text>Climate: {planetData.climate}</Text>
            <Text>Diameter: {planetData.diameter} km</Text>
            <Text>Population: {planetData.population}</Text>
            <Text>Terrain: {planetData.terrain}</Text>
          </>
        ) : (
          searchTerm && <Text>No data available for planet {searchTerm}</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start',
    alignItems: 'center',
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
  errorText: {
    color: 'red',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default PlanetsScreen;


