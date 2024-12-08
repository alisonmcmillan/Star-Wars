import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal, Button, Image, Alert, ActivityIndicator, TextInput } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { Swipeable } from 'react-native-gesture-handler';

const FilmsScreen = () => {
  const [films, setFilms] = useState([]);
  const [filteredFilms, setFilteredFilms] = useState([]);
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

  // Fetch films data
  useEffect(() => {
    if (!isConnected) {
      Alert.alert('Network Error', 'No internet connection detected.');
      return;
    }

    setLoading(true);
    fetch('https://www.swapi.tech/api/films')
      .then((res) => res.json())
      .then((data) => {
        setFilms(data.result || []);
        setFilteredFilms(data.result || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching films:', error);
        setLoading(false);
      });
  }, [isConnected]);

  // Handle search input change
  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term === '') {
      setFilteredFilms(films); // Reset to all films if no search term
    } else {
      const filtered = films.filter((film) =>
        film.properties.title.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredFilms(filtered);
    }
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
          uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEpcTivo1VXx6VeVUaN1PGokUd7NQoF_75nQ&s',
        }}
        resizeMode="cover"
      />
      
      {/* Search Input */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search films..."
        value={searchTerm}
        onChangeText={handleSearch}
      />
      
      <ScrollView>
        {filteredFilms.length > 0 ? (
          filteredFilms.map((film, index) => (
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
      
      {/* Film Modal */}
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
