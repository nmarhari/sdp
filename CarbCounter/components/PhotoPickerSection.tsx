import React, { forwardRef, useImperativeHandle } from 'react';
import * as imagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

interface PhotoPickerSectionProps {
  onPhotoSelected?: (photoUri: string) => void;
}

const PhotoPickerSection = forwardRef((props: PhotoPickerSectionProps, ref) => {
  const pickImageAsync = async () => {
    try {
      const result = await imagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        const selectedPhotoUri = result.assets[0].uri;
        if (props.onPhotoSelected) {
          props.onPhotoSelected(selectedPhotoUri);
        }
      } else {
        Alert.alert("No image selected", "You did not select an image.");
      }
    } catch (error) {
      console.error("Error picking an image:", error);
      Alert.alert("Error", "An error occurred while picking an image.");
    }
  };

  useImperativeHandle(ref, () => ({
    openImagePicker: pickImageAsync,
  }));

  return null;
});

export default PhotoPickerSection;
