import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal, Button, Animated } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import SearchInput from '../SearchInput';

const PlanetsScreen = () => {
  const [planetData, setPlanetData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [animations, setAnimations] = useState([]); // Manage animations as state

  useEffect(() => {
    if (!searchTerm) return;

    fetch(`https://www.swapi.tech/api/planets/?search=${searchTerm}`)
      .then((res) => res.json())
      .then((data) => {
        const results = data.results || [];
        setPlanetData(results);

        // Create a new set of animation values for each result
        const newAnimations = results.map(() => new Animated.Value(0));
        setAnimations(newAnimations);

        // Trigger animations for all items
        Animated.stagger(100, newAnimations.map(anim => Animated.timing(anim, {
          toValue: 1, // End with opacity 1
          duration: 500,
          useNativeDriver: true,
        }))).start();
      });
  }, [searchTerm]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleSwipe = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <SearchInput onSubmit={handleSearch} />
      <ScrollView>
        {planetData.map((planet, index) => (
          <Swipeable
            key={index}
            renderRightActions={() => <Text style={styles.swipeText}>Swipe Me!</Text>}
            onSwipeableRightOpen={() => handleSwipe(planet)}
          >
            <Animated.View style={[styles.item, { opacity: animations[index] || 1 }]}>
              <Text style={styles.itemText}>{planet.name}</Text>
            </Animated.View>
          </Swipeable>
        ))}
      </ScrollView>
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>
            {selectedItem ? `You swiped on: ${selectedItem.name}` : 'No item selected'}
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
    marginBottom: 20,
  },
});

export default PlanetsScreen;

