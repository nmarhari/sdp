import PhotoPickerSection from '@/components/PhotoPickerSection';
import PhotoPreviewSection from '@/components/PhotoPreviewSection';
import { AntDesign } from '@expo/vector-icons';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { useRef, useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type PhotoPickerRef = {
  openImagePicker: () => void;
};

export default function Camera({ onClose }: { onClose: () => void }) {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState<any>(null);
  const cameraRef = useRef<CameraView | null>(null);
  const photoPickerRef = useRef<PhotoPickerRef | null>(null);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  }

  const handleTakePhoto = async () => {
    if (cameraRef.current) {
      const options = {
        quality: 1,
        base64: true,
        exif: false,
      };
      const takenPhoto = await cameraRef.current.takePictureAsync(options);

      if (takenPhoto?.uri) {
        setPhoto(takenPhoto);
        console.log("Captured photo URI:", takenPhoto.uri);
        await uploadPhoto(takenPhoto.uri); // takenphoto URI
      }
    }
  };

  const handleOpenPhotoPicker = async () => {
    if (photoPickerRef.current) {
      await photoPickerRef.current.openImagePicker();
    }
  };

  const handlePhotoSelected = async (selectedPhotoUri: string) => {
    console.log("Selected photo URI:", selectedPhotoUri);
    await uploadPhoto(selectedPhotoUri); // upload photo URI
  };

  const handleRetakePhoto = () => setPhoto(null);

  
  const uploadPhoto = async (photoUri: string) => {
    // const formData = new FormData();

    const response = await fetch(photoUri);
    const blob = await response.blob();

    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = async () => {
      const base64Image = reader.result;
      // console.log(base64Image)
      const payload = {
        image: base64Image,
      };
      try{
        const response = await fetch('http://127.0.0.1:5000/upload-image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
        if (!response.ok) {
          const errorText = await response.text();
          console.error("Server error:", errorText);
          throw new Error(`Upload failed: ${response.status}`);
        };
        const result = await response.json();
        console.log('Response from server:', result);
      } catch (error) {
          console.error('Error uploading photo:', error.message || error);
      }
    }
    reader.onerror = (error) => {
      console.error("Error reading file as Base64:", error);
    };
  }
    
  
  //   formData.append('image', {
  //     uri: photoUri,
  //     name: 'photo.jpg', // You can change the filename if needed
  //     type: 'image/jpeg', // Ensure this matches file type
  //   } as any); // Use `as any` to bypass TypeScript's strict type checking
  
  //   console.log(formData)

  //   try {
  //     const response = await fetch('http://localhost:5000/upload-image', {//!!! use command prompt type "ipconfig"(Windows) to check your IP address 
  //       method: 'POST',                                                       //For Example: http://<replace with Your IP address>:5000/upload-image
  //       body: formData,
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //       },
  //     });
  
  //     const result = await response.json();
  //     console.log('Response from server:', result);
  //   } catch (error) {
  //     console.error('Error uploading photo:', error);
  //   }
  // };
  

  if (photo) {
    return (
      <PhotoPreviewSection
        photo={photo}
        handleRetakePhoto={handleRetakePhoto}
      />
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Ionicons name="close" size={36} color="white" />
      </TouchableOpacity>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.albumButton} onPress={handleOpenPhotoPicker}>
            <AntDesign name="picture" size={32} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleTakePhoto}>
            <AntDesign name="camera" size={32} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <AntDesign name="retweet" size={32} color="black" />
          </TouchableOpacity>
        </View>
      </CameraView>
      <PhotoPickerSection ref={photoPickerRef} onPhotoSelected={handlePhotoSelected} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    bottom: 80,
    left: 20,
    right: 20,
  },
  albumButton: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  button: {
    width: 70,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'gray',
    borderRadius: 35,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 15,
    padding: 5,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
})