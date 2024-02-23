import { Camera, CameraType } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { manipulateAsync } from "expo-image-manipulator";
import { useState } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import { ScreenWidth } from "@rneui/base";

function CameraScreen({ navigation }) {
  const [type, setType] = useState(CameraType.back);
  const [camera, setCamera] = useState();
  const [permission, requestPermission] = Camera.useCameraPermissions();
  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  const takePicture = async () => {
    if (camera) {
      let result = await camera.takePictureAsync(null);
      if (!result.canceled) {
        editedImage = await manipulateAsync(
          result.uri,
          [{ resize: { width: ScreenWidth, height: ScreenWidth * 1.25 } }],
          { compress: 1, format: "png", base64: false }
        );
        if (editedImage) {
          navigation.navigate("CreatePost", { image: result.uri });
        }
      }
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
      navigation.navigate("CreatePost", { image: result.assets[0].uri });
    }
  };

  return (
    <View style={styles.container}>
      <Camera
        style={[
          styles.camera,
          { width: ScreenWidth, height: ScreenWidth * 1.25 },
        ]}
        type={type}
        ref={(ref) => setCamera(ref)}
      >
        <View style={styles.buttonContainer}>
          <Button
            title="Flip"
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}
          />
          <Button title="Take Picture" onPress={takePicture} />
          <Button title="Pick an image from camera roll" onPress={pickImage} />
        </View>
      </Camera>
    </View>
  );
}

export default CameraScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    marginBottom: 20,
    marginHorizontal: 20,
  },
});
