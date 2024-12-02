import { CameraCapturedPicture } from 'expo-camera';
import React from 'react';
import { Button, SafeAreaView, Image, StyleSheet, View, Alert } from 'react-native';
import * as MediaLibrary from 'expo-media-library';

const PhotoPreviewSection = ({
    photo,
    handleRetakePhoto,
}: {
    photo: CameraCapturedPicture;
    handleRetakePhoto: () => void;
}) => {
    const handleSavePhoto = async () => {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status === 'granted') {
            try {
                await MediaLibrary.saveToLibraryAsync(photo.uri);
                Alert.alert(
                    'Photo saved to camera roll!',
                    '',
                    [
                        {
                            text: 'OK',
                            onPress: handleRetakePhoto,
                        },
                    ],
                    { cancelable: false }
                );
            } catch (error) {
                console.error('Error saving photo:', error);
            }
        } else {
            Alert.alert('Permission to access camera roll is required!');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.box}>
                <Image
                    style={styles.previewContainer}
                    source={{ uri: 'data:image/jpg;base64,' + photo.base64 }}
                />
            </View>

            <View style={styles.buttonContainer}>
                {/* Delete button */}
                <Button title="Delete" onPress={handleRetakePhoto} />
                {/* Save button */}
                <Button title="Save" onPress={handleSavePhoto} />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
    },
    box: {
        borderRadius: 15,
        padding: 1,
        width: '95%',
        backgroundColor: 'darkgray',
        justifyContent: 'center',
        alignItems: 'center',
    },
    previewContainer: {
        width: '95%',
        height: '85%',
        borderRadius: 15,
    },
    buttonContainer: {
        marginTop: '4%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
});

export default PhotoPreviewSection;
