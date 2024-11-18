import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import SearchInput from '../SearchInput'; // Make sure this component is available

const SpaceshipsScreen = () => {
  // State for storing starship data, loading status, error, and search term
  const [starship, setStarship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // Search term for starship ID

  // Fetch starship data when the component mounts or when the search term changes
  useEffect(() => {
    if (!searchTerm) return; // Avoid fetching if searchTerm is empty

    setLoading(true); // Start loading when a search is initiated
    fetch(`https://www.swapi.tech/api/starships/${searchTerm}`)
      .then((res) => res.json())
      .then((data) => {
        setStarship(data.result?.properties || null); // Set data or null if not found
        setLoading(false); // Set loading to false when data is fetched
      })
      .catch((err) => {
        setError(err); // Set error state if fetch fails
        setLoading(false); // Set loading to false if there’s an error
      });
  }, [searchTerm]); // Fetch data whenever searchTerm changes

  // Handle the search input submission
  const handleSearch = (term) => {
    setSearchTerm(term); // Update the search term state
    setError(null); // Clear any previous errors
  };

  if (loading && searchTerm) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading Starship data...</Text>
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
        <Text style={styles.title}>Starship Information</Text>
        {starship ? (
          <>
            <Text>Name: {starship.name}</Text>
            <Text>Model: {starship.model}</Text>
            <Text>Manufacturer: {starship.manufacturer}</Text>
            <Text>Cost in Credits: {starship.cost_in_credits}</Text>
            <Text>Passengers: {starship.passengers}</Text>
            <Text>Hyperdrive Rating: {starship.hyperdrive_rating}</Text>
          </>
        ) : (
          searchTerm && <Text>No data available for starship {searchTerm}</Text>
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

export default SpaceshipsScreen;

