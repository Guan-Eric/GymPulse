import React, { useState } from "react";
import { Button, Icon } from "@rneui/themed"; // Assuming you're using Button and Icon components from a library like react-native-elements
import { Camera, CameraType, CameraView } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { SaveFormat, manipulateAsync } from "expo-image-manipulator";
import { View, Text, StyleSheet } from "react-native";
import { router } from "expo-router";

function CameraScreen() {
  const [camera, setCamera] = useState<CameraView>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [type, setType] = useState<CameraType>("back");

  const getPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === "granted");
  };

  const takePicture = async () => {
    if (camera) {
      let photo = await camera.takePictureAsync();
      let editedImage = await manipulateAsync(
        photo.uri,
        [{ resize: { width: photo.width, height: photo.height } }],
        { compress: 1, format: SaveFormat.PNG, base64: false }
      );
      router.push({
        pathname: "/(camera)/create",
        params: { image: editedImage.uri },
      });
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 5],
      quality: 1,
    });

    if (!result.canceled) {
      router.push({
        pathname: "/(camera)/create",
        params: { image: result.assets[0].uri },
      });
    }
  };

  React.useEffect(() => {
    getPermission();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return (
      <View>
        <Text>No access to camera</Text>
        <Button onPress={getPermission} title="Grant Permission" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <CameraView
        style={{ flex: 1, justifyContent: "flex-end" }}
        facing={type}
        ref={(ref) => setCamera(ref)}
      >
        <View style={styles.buttonContainer}>
          <Button
            type="clear"
            icon={<Icon name="image-outline" type="material-community" />}
            onPress={pickImage}
          />
          <Button
            type="clear"
            icon={<Icon name="circle-slice-8" type="material-community" />}
            onPress={takePicture}
          />
          <Button
            type="clear"
            icon={<Icon name="camera-flip-outline" type="material-community" />}
            onPress={() => {
              setType(type === "back" ? "front" : "back");
            }}
          />
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingBottom: 20,
  },
});

export default CameraScreen;
