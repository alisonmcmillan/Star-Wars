import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal, Button, ActivityIndicator, Animated, Image } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import SearchInput from '../SearchInput';

const SpaceshipsScreen = () => {
  const [spaceships, setSpaceships] = useState([]); // Store the list of spaceships
  const [loading, setLoading] = useState(false); // Handle loading state
  const [error, setError] = useState(null); // Handle any error
  const [searchTerm, setSearchTerm] = useState(''); // Store the search term
  const [modalVisible, setModalVisible] = useState(false); // Modal visibility
  const [selectedSpaceship, setSelectedSpaceship] = useState(null); // Store selected spaceship details
  const [animations, setAnimations] = useState([]); // Manage animations as state

  // Fetch spaceships based on the search term
  useEffect(() => {
    if (!searchTerm) return;

    setLoading(true);
    fetch(`https://www.swapi.tech/api/starships/?search=${searchTerm}`)
      .then((res) => res.json())
      .then((data) => {
        setSpaceships(data.result || []); // Save the spaceships array
        setLoading(false);

        // Create new animation values for each spaceship
        const newAnimations = data.result.map(() => new Animated.Value(0));
        setAnimations(newAnimations);

        // Trigger fade-in animation for each spaceship
        Animated.stagger(100, newAnimations.map((anim) =>
          Animated.timing(anim, {
            toValue: 1, // End with opacity 1
            duration: 500,
            useNativeDriver: true,
          })
        )).start();
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [searchTerm]);

  // Handle search input
  const handleSearch = (term) => {
    setSearchTerm(term);
    setError(null); // Clear any previous error
  };

  // Handle swipe action
  const handleSwipe = (spaceship) => {
    setSelectedSpaceship(spaceship);
    setModalVisible(true);
  };

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
      {/* Image at the top of the screen */}
      <Image
        style={styles.image}
        source={{
          uri: 'data:image/jpeg;base64,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', // Placeholder image
        }}
        resizeMode="cover"
      />
      <SearchInput onSubmit={handleSearch} />
      <ScrollView>
        {spaceships.length > 0 ? (
          spaceships.map((spaceship, index) => (
            <Swipeable
              key={index}
              renderRightActions={() => <Text style={styles.swipeText}>Swipe Me!</Text>}
              onSwipeableRightOpen={() => handleSwipe(spaceship.properties)}
            >
              <Animated.View style={[styles.item, { opacity: animations[index] || 1 }]}>
                <Text style={styles.itemText}>{spaceship.properties.name}</Text>
              </Animated.View>
            </Swipeable>
          ))
        ) : (
          searchTerm && <Text>No spaceships found for "{searchTerm}".</Text>
        )}
      </ScrollView>
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          {selectedSpaceship ? (
            <>
              <Text style={styles.modalText}>Name: {selectedSpaceship.name}</Text>
              <Text style={styles.modalText}>Model: {selectedSpaceship.model}</Text>
              <Text style={styles.modalText}>Manufacturer: {selectedSpaceship.manufacturer}</Text>
              <Text style={styles.modalText}>Crew: {selectedSpaceship.crew}</Text>
              <Text style={styles.modalText}>Passengers: {selectedSpaceship.passengers}</Text>
            </>
          ) : (
            <Text style={styles.modalText}>No spaceship selected</Text>
          )}
          <Button title="Close" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
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
    height: 200, // Adjust the height as needed
    marginBottom: 20,
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalText: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default SpaceshipsScreen;

