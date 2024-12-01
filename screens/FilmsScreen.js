import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal, Button, Image, Alert, ActivityIndicator } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { Swipeable } from 'react-native-gesture-handler';
import SearchInput from '../SearchInput';

const FilmsScreen = () => {
  const [films, setFilms] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isConnected, setIsConnected] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFilm, setSelectedFilm] = useState(null);
  const [loading, setLoading] = useState(false);

  // Monitor network connectivity
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

    return () => unsubscribe(); // Cleanup listener
  }, []);

  useEffect(() => {
    if (!isConnected) {
      Alert.alert('Network Error', 'No internet connection detected.');
      return;
    }

    if (!searchTerm) return;

    setLoading(true);
    fetch(`https://www.swapi.tech/api/films/?search=${searchTerm}`)
      .then((res) => res.json())
      .then((data) => {
        setFilms(data.result || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching films:', error);
        setLoading(false);
      });
  }, [searchTerm, isConnected]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleSwipe = (film) => {
    setSelectedFilm(film.properties);
    setModalVisible(true);
  };

  if (!isConnected) {
    return (
      <View style={styles.offlineContainer}>
        <Text style={styles.offlineText}>No internet connection. Please check your network.</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Image at the top of the screen */}
      <Image
        style={styles.image}
        source={{
          uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEpcTivo1VXx6VeVUaN1PGokUd7NQoF_75nQ&s', // Replace with an appropriate Star Wars image URL
        }}
        resizeMode="cover"
      />
      <SearchInput onSubmit={handleSearch} />
      <ScrollView>
        {films.length > 0 ? (
          films.map((film, index) => (
            <Swipeable
              key={index}
              renderRightActions={() => <Text style={styles.swipeText}>Swipe Me!</Text>}
              onSwipeableRightOpen={() => handleSwipe(film)}
            >
              <View style={styles.item}>
                <Text style={styles.itemText}>{film.properties.title}</Text>
              </View>
            </Swipeable>
          ))
        ) : (
          searchTerm && <Text>No films found for "{searchTerm}".</Text>
        )}
      </ScrollView>
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          {selectedFilm ? (
            <>
              <Text style={styles.modalText}>Title: {selectedFilm.title}</Text>
              <Text style={styles.modalText}>Director: {selectedFilm.director}</Text>
              <Text style={styles.modalText}>Producer: {selectedFilm.producer}</Text>
              <Text style={styles.modalText}>Release Date: {selectedFilm.release_date}</Text>
            </>
          ) : (
            <Text style={styles.modalText}>No film selected</Text>
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
    marginBottom: 10,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FilmsScreen;
