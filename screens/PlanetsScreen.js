import React, { useState, useEffect } from 'react';
import {  View, Text, StyleSheet, ScrollView, Modal, Button, Image, Alert, } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { Swipeable } from 'react-native-gesture-handler';
import SearchInput from '../SearchInput';

const PlanetsScreen = () => {
  const [planetData, setPlanetData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isConnected, setIsConnected] = useState(true);

  // Monitor network status
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

    return () => unsubscribe(); // Cleanup the listener
  }, []);

  useEffect(() => {
    if (!isConnected) {
      Alert.alert('Network Error', 'No internet connection detected.');
      return;
    }

    if (!searchTerm) return;

    fetch(`https://www.swapi.tech/api/planets/?search=${searchTerm}`)
      .then((res) => res.json())
      .then((data) => {
        setPlanetData(data.results || []);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [searchTerm, isConnected]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleSwipe = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
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
    height: 200,
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
