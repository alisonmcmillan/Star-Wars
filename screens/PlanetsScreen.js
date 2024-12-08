import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TextInput } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { Swipeable } from 'react-native-gesture-handler';

const PlanetsScreen = () => {
  const [planetData, setPlanetData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isConnected, setIsConnected] = useState(true);

  // Monitor network status
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

    return () => unsubscribe(); // Cleanup the listener
  }, []);

  // Fetch planets data when network is connected
  useEffect(() => {
    if (!isConnected) {
      return;
    }

    fetch('https://www.swapi.tech/api/planets')
      .then((res) => res.json())
      .then((data) => {
        setPlanetData(data.results || []);
        setFilteredData(data.results || []); // Initialize with all planets
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [isConnected]);

  // Handle search input change
  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term === '') {
      // If search term is empty, show all data
      setFilteredData(planetData);
    } else {
      // Filter data based on the search term
      const filtered = planetData.filter((planet) =>
        planet.name.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredData(filtered);
    }
  };

  if (!isConnected) {
    return (
      <View style={styles.offlineContainer}>
        <Text style={styles.offlineText}>No internet connection. Please check your network.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Image at the top of the screen */}
      <Image
        style={styles.image}
        source={{
          uri: 'data:image/jpeg;base64,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', // Replace with an appropriate Star Wars image URL
        }}
        resizeMode="cover"
      />
      
      {/* Search input */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search planets..."
        value={searchTerm}
        onChangeText={handleSearch}
      />

      {/* Display filtered planets */}
      <ScrollView>
        {filteredData.map((planet, index) => (
          <Swipeable
            key={index}
            renderRightActions={() => <Text style={styles.swipeText}>Swipe Me!</Text>}
            onSwipeableRightOpen={() => console.log(`Swiped on: ${planet.name}`)}
          >
            <View style={styles.item}>
              <Text style={styles.itemText}>{planet.name}</Text>
            </View>
          </Swipeable>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 20,
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 15,
  },
  item: {
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  itemText: {
    fontSize: 18,
  },
  swipeText: {
    color: 'red',
    fontWeight: 'bold',
    padding: 15,
  },
  offlineContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  offlineText: {
    fontSize: 20,
    color: '#ff0000',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

export default PlanetsScreen;
