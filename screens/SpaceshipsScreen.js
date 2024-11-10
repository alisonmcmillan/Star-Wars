// PlanetsScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

function PlanetsScreen() {
  return (
    <View style={styles.container}>
      <Text>Spaceships Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PlanetsScreen;
