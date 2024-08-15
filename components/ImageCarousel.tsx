import { ScreenWidth } from "@rneui/base";
import React, { useState } from "react";
import { View, Image } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import AnimatedDotsCarousel from "react-native-animated-dots-carousel";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";

const ImageCarousel = ({ data, theme }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const renderCarouselItem = ({ item }) => (
    <View style={{ width: ScreenWidth, height: ScreenWidth }}>
      <Image
        source={{ uri: item }}
        style={{
          alignSelf: "center",
          borderRadius: 20,
          width: ScreenWidth * 0.9,
          height: ScreenWidth * 0.9 * 1.25,
          resizeMode: "cover",
        }}
      />
    </View>
  );

  return (
    <View style={{ alignItems: "center" }}>
      {data?.length > 0 ? (
        <Carousel
          panGestureHandlerProps={{
            activeOffsetX: [-10, 10],
          }}
          data={data}
          renderItem={renderCarouselItem}
          width={ScreenWidth}
          height={ScreenWidth * 1.25}
          loop={false}
          onProgressChange={(offsetProgress, absoluteProgress) => {
            const index = Math.round(absoluteProgress);
            setCurrentIndex(index);
          }}
        />
      ) : null}
      {data?.length > 1 ? (
        <AnimatedDotsCarousel
          length={data.length}
          currentIndex={currentIndex}
          maxIndicators={2}
          activeIndicatorConfig={{
            color: theme.colors.black,
            margin: 3,
            opacity: 1,
            size: 8,
          }}
          inactiveIndicatorConfig={{
            color: theme.colors.black,
            margin: 3,
            opacity: 0.5,
            size: 6,
          }}
          decreasingDots={[
            {
              config: {
                color: theme.colors.black,
                margin: 3,
                opacity: 0.5,
                size: 6,
              },
              quantity: 1,
            },
          ]}
        />
      ) : null}
    </View>
  );
};

export default ImageCarousel;
