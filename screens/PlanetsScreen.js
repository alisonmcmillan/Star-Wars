import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal, Button, Image } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import SearchInput from '../SearchInput';

const PlanetsScreen = () => {
  const [planetData, setPlanetData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    if (!searchTerm) return;

    fetch(`https://www.swapi.tech/api/planets/?search=${searchTerm}`)
      .then((res) => res.json())
      .then((data) => {
        setPlanetData(data.results || []);
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
      {/* Image at the top of the screen */}
      <Image
        style={styles.image}
        source={{
          uri: 'https://galacticsabers.co/wp-content/uploads/2023/07/mattgallodesigns_planets_in_space_inspired_by_star_wars_hyper_r_52d158e5-0fc1-4d86-8ecd-6d58ecbf3a69.png', // Replace with an appropriate Star Wars image URL
        }}
        resizeMode="cover"
      />
      <SearchInput onSubmit={handleSearch} />
      <ScrollView>
        {planetData.map((planet, index) => (
          <Swipeable
            key={index}
            renderRightActions={() => <Text style={styles.swipeText}>Swipe Me!</Text>}
            onSwipeableRightOpen={() => handleSwipe(planet)}
          >
            <View style={styles.item}>
              <Text style={styles.itemText}>{planet.name}</Text>
            </View>
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
  image: {
    width: '100%',
    height: 200,  // Adjust based on the image aspect ratio
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
    marginBottom: 20,
  },
});

export default PlanetsScreen;

