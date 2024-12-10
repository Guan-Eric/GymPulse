import React from "react";
import { Button, Icon } from "@rneui/themed";
import { router } from "expo-router";

const BackButton: React.FC = ({}) => {
  return (
    <Button
      onPress={() => router.back()}
      style={{ alignSelf: "flex-start" }}
      type="clear"
    >
      <Icon name="chevron-left" size={30} />
    </Button>
  );
};

export default BackButton;
