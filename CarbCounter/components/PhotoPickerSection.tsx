import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { Image, SafeAreaView, StyleSheet, View, TouchableOpacity, Alert } from 'react-native';
import * as imagePicker from 'expo-image-picker';
import { Fontisto } from '@expo/vector-icons';

const PhotoPickerSection = forwardRef((props, ref) => {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const pickImageAsync = async () => {
    try {
      const result = await imagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        setSelectedPhoto(result.assets[0].uri);
      } else {
        Alert.alert("No image selected", "You did not select an image.");
      }
    } catch (error) {
      console.error("Error picking an image:", error);
      Alert.alert("Error", "An error occurred while picking an image.");
    }
  };

  useImperativeHandle(ref, () => ({
    openImagePicker: pickImageAsync
  }));

  const handleRemovePhoto = () => {
    setSelectedPhoto(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      {selectedPhoto ? (
        <View style={styles.previewContainer}>
          <Image source={{ uri: selectedPhoto }} style={styles.image} />
          <TouchableOpacity style={styles.button} onPress={handleRemovePhoto}>
            <Fontisto name="trash" size={36} color="black" />
          </TouchableOpacity>
        </View>
      ) : null}
    </SafeAreaView>
  );
});

export default PhotoPickerSection;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewContainer: {
    alignItems: 'center',
  },
  image: {
    width: 300,
    height: 400,
    borderRadius: 15,
  },
  button: {
    marginTop: 20,
    backgroundColor: 'gray',
    borderRadius: 25,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
