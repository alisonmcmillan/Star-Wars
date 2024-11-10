import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

const SpaceshipsScreen = () => {
  // Set up state for storing starship data
  const [starship, setStarship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data when the component mounts
  useEffect(() => {
    // You can replace '9' with any other valid starship ID you want to fetch
    const starshipId = 9; 

    fetch(`https://www.swapi.tech/api/starships/${starshipId}`)
      .then((res) => res.json())
      .then((data) => {
        setStarship(data.result.properties); // Assuming API returns starship data in this structure
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
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
        <Text>Error: {error.message}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{starship.name}</Text>
      <Text>Model: {starship.model}</Text>
      <Text>Manufacturer: {starship.manufacturer}</Text>
      <Text>Cost in Credits: {starship.cost_in_credits}</Text>
      <Text>Passengers: {starship.passengers}</Text>
      <Text>Hyperdrive Rating: {starship.hyperdrive_rating}</Text>
      {/* Add more properties as needed */}
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

export default SpaceshipsScreen;
