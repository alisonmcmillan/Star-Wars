import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Modal, Button } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import SearchInput from '../SearchInput'; // Make sure this component is available

const SpaceshipsScreen = () => {
  const [starship, setStarship] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStarship, setSelectedStarship] = useState(null);

  useEffect(() => {
    if (!searchTerm) return;

    setLoading(true);
    fetch(`https://www.swapi.tech/api/starships/${searchTerm}`)
      .then((res) => res.json())
      .then((data) => {
        setStarship(data.result?.properties || null);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [searchTerm]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    setError(null);
  };

  const handleSwipe = (item) => {
    setSelectedStarship(item);
    setModalVisible(true);
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
      <ScrollView>
        <View style={styles.content}>
          <Text style={styles.title}>Starship Information</Text>
          {starship ? (
            <Swipeable
              renderRightActions={() => (
                <Text style={styles.swipeText}>Swipe to view</Text>
              )}
              onSwipeableRightOpen={() => handleSwipe(starship)}
            >
              <View style={styles.item}>
                <Text>Name: {starship.name}</Text>
                <Text>Model: {starship.model}</Text>
                <Text>Manufacturer: {starship.manufacturer}</Text>
                <Text>Cost in Credits: {starship.cost_in_credits}</Text>
                <Text>Passengers: {starship.passengers}</Text>
                <Text>Hyperdrive Rating: {starship.hyperdrive_rating}</Text>
              </View>
            </Swipeable>
          ) : (
            searchTerm && (
              <Text>No data available for starship {searchTerm}</Text>
            )
          )}
        </View>
      </ScrollView>
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>
            {selectedStarship
              ? `You swiped on: ${selectedStarship.name}`
              : 'No starship selected'}
          </Text>
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
  content: {
    flex: 1,
    alignItems: 'center',
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  item: {
    padding: 15,
    backgroundColor: '#f0f0f0',
    marginBottom: 10,
    borderRadius: 5,
    borderColor: '#ddd',
    borderWidth: 1,
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
    marginBottom: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default SpaceshipsScreen;
