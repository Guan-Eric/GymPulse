import { Camera, CameraCapturedPicture, CameraType } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { SaveFormat, manipulateAsync } from "expo-image-manipulator";
import { useState } from "react";
import { Button, Icon } from "@rneui/themed";
import { StyleSheet, Text, View } from "react-native";
import { ScreenWidth } from "@rneui/base";
import { router } from "expo-router";

function CameraScreen() {
  const [type, setType] = useState<CameraType>(CameraType.back);
  const [camera, setCamera] = useState<Camera | null>();
  const [permission, requestPermission] = Camera.useCameraPermissions();
  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          We need your permission to use the camera
        </Text>
        <Button title="Grant Permission" onPress={requestPermission} />
      </View>
    );
  }

  const takePicture = async () => {
    if (camera) {
      let result: CameraCapturedPicture | null = await camera.takePictureAsync(
        null
      );
      if (result != null) {
        let editedImage = await manipulateAsync(
          result.uri,
          [{ resize: { width: ScreenWidth, height: ScreenWidth * 1.25 } }],
          { compress: 1, format: SaveFormat.PNG, base64: false }
        );
        if (editedImage) {
          router.push({
            pathname: "/(camera)/create",
            params: { image: result.uri },
          });
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
      router.push({
        pathname: "/(camera)/create",
        params: { image: result.assets[0].uri },
      });
    }
  };

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={type} ref={(ref) => setCamera(ref)}>
        <View style={styles.buttonContainer}>
          <Button type="clear" onPress={pickImage}>
            <Icon size={40} name="image-outline" type="material-community" />
          </Button>
          <Button type="clear" onPress={takePicture}>
            <Icon size={75} name="circle-slice-8" type="material-community" />
          </Button>
          <Button
            type="clear"
            onPress={() => {
              setType(
                type === CameraType.back ? CameraType.front : CameraType.back
              );
            }}
          >
            <Icon
              size={40}
              name="camera-flip-outline"
              type="material-community"
            />
          </Button>
        </View>
      </Camera>
    </View>
  );
}

export default CameraScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  camera: {
    flex: 1,
    justifyContent: "flex-end",
  },
  buttonContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingRight: 30,
    paddingLeft: 30,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  permissionText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
});
