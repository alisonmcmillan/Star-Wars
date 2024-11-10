import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

const FilmsScreen = () => {
  const [filmData, setFilmData] = useState(null); // To store film data
  const [loading, setLoading] = useState(true);  // To handle loading state

  useEffect(() => {
    // Fetching data when the component mounts
    fetch('https://www.swapi.tech/api/films/1') // Example endpoint for the first film
      .then((res) => res.json())
      .then((data) => {
        setFilmData(data.result.properties); // Save the film properties in the state
        setLoading(false); // Set loading to false once data is fetched
      })
      .catch((err) => {
        console.error(err);
        setLoading(false); // Handle any error
      });
  }, []);

  // Render the UI based on the loading state
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  // If data is loaded, display the film information
  return (
    <View style={styles.container}>
      {filmData && (
        <>
          <Text style={styles.title}>{filmData.title}</Text>
          <Text style={styles.text}>Director: {filmData.director}</Text>
          <Text style={styles.text}>Producer: {filmData.producer}</Text>
          <Text style={styles.text}>Release Date: {filmData.release_date}</Text>
          <Text style={styles.text}>Opening Crawl: {filmData.opening_crawl}</Text>
        </>
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
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default FilmsScreen;



