import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { useRoute } from '@react-navigation/native';

const PlanetDetailScreen = () => {
  const route = useRoute();
  const { planetId } = route.params; // Get the planet ID passed through the navigation
  const [planetDetail, setPlanetDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch planet details
  useEffect(() => {
    fetch(`https://www.swapi.tech/api/planets/${planetId}`)
      .then((res) => res.json())
      .then((data) => {
        setPlanetDetail(data.result.properties);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching planet detail:', error);
        setIsLoading(false);
      });
  }, [planetId]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!planetDetail) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Unable to fetch planet data.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Planet Image (optional, can replace with an appropriate image if needed) */}
      <Image
        style={styles.image}
        source={{
          uri: 'https://path/to/planet-image.jpg', // Replace with an appropriate planet image
        }}
        resizeMode="cover"
      />

      <Text style={styles.title}>{planetDetail.name}</Text>
      <Text style={styles.detail}>Rotation Period: {planetDetail.rotation_period}</Text>
      <Text style={styles.detail}>Orbital Period: {planetDetail.orbital_period}</Text>
      <Text style={styles.detail}>Diameter: {planetDetail.diameter} km</Text>
      <Text style={styles.detail}>Climate: {planetDetail.climate}</Text>
      <Text style={styles.detail}>Gravity: {planetDetail.gravity}</Text>
      <Text style={styles.detail}>Terrain: {planetDetail.terrain}</Text>
      <Text style={styles.detail}>Surface Water: {planetDetail.surface_water}</Text>
      <Text style={styles.detail}>Population: {planetDetail.population}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  detail: {
    fontSize: 18,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
});

export default PlanetDetailScreen;

