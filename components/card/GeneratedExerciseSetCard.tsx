import { Card } from "@rneui/themed";
import { View, Text, StyleSheet } from "react-native";
import { GeneratedExercise } from "../types";

interface GeneratedExerciseSetCardProps {
  exercise: GeneratedExercise;
  theme: any;
}

const GeneratedExerciseSetCard: React.FC<GeneratedExerciseSetCardProps> = ({
  exercise,
  theme,
}) => {
  return (
    <Card
      containerStyle={[
        styles.card,
        {
          backgroundColor: theme.colors.grey0,
          borderColor: theme.colors.grey0,
        },
      ]}
    >
      <View style={styles.exerciseHeader}>
        <Text style={[styles.exerciseText, { color: theme.colors.black }]}>
          {exercise.name}
        </Text>
      </View>
      <View style={styles.setRow}>
        <Text style={[styles.setText, { color: theme.colors.black }]}>
          Sets: {exercise.sets} Reps: {exercise.reps}
        </Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    margin: 20,
  },
  exerciseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  setRow: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  exerciseText: {
    fontSize: 18,
    fontFamily: "Lato_400Regular",
  },
  setText: {
    fontSize: 16,
    fontFamily: "Lato_400Regular",
  },
});

export default GeneratedExerciseSetCard;
