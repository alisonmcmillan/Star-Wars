import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

const PlanetsScreen = () => {
  // State to hold planet data and loading status
  const [planetData, setPlanetData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch planet data from the API on component mount
  useEffect(() => {
    fetch("https://www.swapi.tech/api/planets/1")
      .then((res) => res.json())
      .then((data) => {
        setPlanetData(data.result.properties);  // Save the relevant data to state
        setLoading(false);  // Set loading to false when data is fetched
      })
      .catch((err) => {
        setError(err);  // Set error state if the fetch fails
        setLoading(false);  // Set loading to false if there's an error
      });
  }, []);  // Empty dependency array to run once when the component mounts

  // Render loading state, error state, or planet data
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>Error: {error.message}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
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
        <Text>No data available</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default PlanetsScreen;


