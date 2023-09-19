import { Text, Pressable, StyleSheet, Image, View } from "react-native";

type Props = {
  id: string;
  name: string;
  phone: string;
  imageUrl: string;
  onPress: (id: string) => void;
};

export function TokenRow({ id, name, phone, imageUrl, onPress }: Props) {
  return (
    <Pressable onPress={() => onPress(id)} style={styles.container}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Image source={{ uri: imageUrl }} style={styles.image} />
        <Text style={styles.name}>{name}</Text>
      </View>
      <Text style={styles.phone}>{phone}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  image: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "500",
  },
  phone: {
    fontSize: 18,
  },
});