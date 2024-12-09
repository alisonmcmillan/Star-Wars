import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TextInput } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { Swipeable } from 'react-native-gesture-handler';

const SpaceshipsScreen = () => {
  const [spaceships, setSpaceships] = useState([]);
  const [filteredSpaceships, setFilteredSpaceships] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isConnected, setIsConnected] = useState(true);

  // Monitor network status
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

    return () => unsubscribe(); // Cleanup the listener
  }, []);

  // Fetch spaceship data when network is connected
  useEffect(() => {
    if (!isConnected) {
      return;
    }

    fetch('https://www.swapi.tech/api/starships')
      .then((res) => res.json())
      .then((data) => {
        setSpaceships(data.results || []);
        setFilteredSpaceships(data.results || []); // Initialize with all spaceships
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [isConnected]);

  // Handle search input change
  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term === '') {
      // If search term is empty, show all spaceships
      setFilteredSpaceships(spaceships);
    } else {
      // Filter spaceships based on the search term
      const filtered = spaceships.filter((spaceship) =>
        spaceship.name.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredSpaceships(filtered);
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
          uri: 'data:image/jpeg;base64,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', // Replace with an appropriate image URL
        }}
        resizeMode="cover"
      />
      
      {/* Search input */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search spaceships..."
        value={searchTerm}
        onChangeText={handleSearch}
      />

      {/* Display filtered spaceships */}
      <ScrollView>
        {filteredSpaceships.map((spaceship, index) => (
          <Swipeable
            key={index}
            renderRightActions={() => <Text style={styles.swipeText}>Swipe Me!</Text>}
            onSwipeableRightOpen={() => console.log(`Swiped on: ${spaceship.name}`)}
          >
            <View style={styles.item}>
              <Text style={styles.itemText}>{spaceship.name}</Text>
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

export default SpaceshipsScreen;

