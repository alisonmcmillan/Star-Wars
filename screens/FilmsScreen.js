import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal, Button, ActivityIndicator, Animated } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import SearchInput from '../SearchInput';

const FilmsScreen = () => {
  const [films, setFilms] = useState([]); // Store the list of films
  const [loading, setLoading] = useState(false); // Handle loading state
  const [error, setError] = useState(null); // Handle any error
  const [searchTerm, setSearchTerm] = useState(''); // Store the search term
  const [modalVisible, setModalVisible] = useState(false); // Modal visibility
  const [selectedFilm, setSelectedFilm] = useState(null); // Store selected film details
  const [animations, setAnimations] = useState([]); // Manage animations as state

  // Fetch films based on the search term
  useEffect(() => {
    if (!searchTerm) return;

    setLoading(true);
    fetch(`https://www.swapi.tech/api/films/?search=${searchTerm}`)
      .then((res) => res.json())
      .then((data) => {
        setFilms(data.result || []); // Save the films array
        setLoading(false);

        // Create new animation values for each film
        const newAnimations = data.result.map(() => new Animated.Value(0));
        setAnimations(newAnimations);

        // Trigger fade-in animation for each film
        Animated.stagger(100, newAnimations.map(anim => Animated.timing(anim, {
          toValue: 1, // End with opacity 1
          duration: 500,
          useNativeDriver: true,
        }))).start();
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
  const handleSwipe = (film) => {
    setSelectedFilm(film);
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
      <SearchInput onSubmit={handleSearch} />
      <ScrollView>
        {films.length > 0 ? (
          films.map((film, index) => (
            <Swipeable
              key={index}
              renderRightActions={() => <Text style={styles.swipeText}>Swipe Me!</Text>}
              onSwipeableRightOpen={() => handleSwipe(film.properties)}
            >
              <Animated.View style={[styles.item, { opacity: animations[index] || 1 }]}>
                <Text style={styles.itemText}>{film.properties.title}</Text>
              </Animated.View>
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
              <Text style={styles.modalText}>
                Opening Crawl: {selectedFilm.opening_crawl}
              </Text>
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

export default FilmsScreen;
