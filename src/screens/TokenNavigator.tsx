import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  Animated,
} from "react-native";
import tw from "twrnc";
import {
  createStackNavigator,
  StackCardStyleInterpolator,
} from "@react-navigation/stack";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { Screen } from "../components/Screen";
import { TokenRow } from "../components/TokenRow";

type RootStackParamList = {
  List: {};
  Detail: { id: string };
};

const Stack = createStackNavigator<RootStackParamList>();

function FullScreenLoadingIndicator() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <ActivityIndicator />
    </View>
  );
}

async function fetchTokenData(count = 20) {
  const url = `https://gist.githubusercontent.com/tidvn/9d1984149391e734302a7b820eb90c07/raw/cd62e81e8be1c50924b0402bfed35c8307e3691c/contact.json`;
  // https://randomuser.me/api/0.8/?results=20
  return fetch(url).then((r) => r.json());
}

function useTokenData() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    async function fetch() {
      setLoading(true);
      const data = await fetchTokenData();
      setData(data);
      setLoading(false);
    }

    fetch();
  }, []);

  return { data, loading };
}

function List({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "List">) {
  const { data, loading } = useTokenData();

  const handlePressTokenRow = (id: string) => {
    navigation.push("Detail", { id });
  };

  if (loading) {
    return <FullScreenLoadingIndicator />;
  }

  const ItemSeparatorComponent = () => (
    <View
      style={{ marginVertical: 8, borderColor: "#eee", borderBottomWidth: 1 }}
    />
  );

  return (
    <Screen>
      <FlatList
        style={{ flex: 1 }}
        data={data}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={ItemSeparatorComponent}
        renderItem={({ item }) => {
          return (
            <TokenRow
              key={item.id}
              id={item.id}
              name={item.name}
              phone={item.phone}
              imageUrl="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              onPress={handlePressTokenRow}
            />
          );
        }}
      />
    </Screen>
  );
}

function Detail({
  route,
}: NativeStackScreenProps<RootStackParamList, "Detail">) {
  const { data, loading } = useTokenData();
  const { id } = route.params;
  if (loading) {
    return <FullScreenLoadingIndicator />;
  }

  const item = data.find((d) => d.id === id);

  if (!item) {
    return null;
  }

  return (
    <Screen>
      <View style={tw`bg-yellow-100 items-center justify-center p-4`}>
        <Image source={{ uri: `https://cdn-icons-png.flaticon.com/512/3135/3135715.png` }} style={tw`w-8 h-8 rounded m-4`} />
        <Text style={tw`font-bold text-lg`}>{item.name}</Text>
        <Text style={tw`font-bold text-lg`}>{item.phone}</Text>
        <Text style={tw`font-bold text-lg`}>{item.publickey}</Text>
        <Text style={tw`font-bold text-lg`}>{item.telegram}</Text>
        <Text style={tw`font-bold text-lg`}>{item.email}</Text>
        <Text style={tw`font-bold text-lg`}>{item.website}</Text>       
      </View>
    </Screen>
  );
}

const forSlide: StackCardStyleInterpolator = ({
  current,
  next,
  inverted,
  layouts: { screen },
}) => {
  const progress = Animated.add(
    current.progress.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
      extrapolate: "clamp",
    }),
    next
      ? next.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
          extrapolate: "clamp",
        })
      : 0,
  );

  return {
    cardStyle: {
      transform: [
        {
          translateX: Animated.multiply(
            progress.interpolate({
              inputRange: [0, 1, 2],
              outputRange: [
                screen.width, // Focused, but offscreen in the beginning
                0, // Fully focused
                screen.width * -0.3, // Fully unfocused
              ],
              extrapolate: "clamp",
            }),
            inverted,
          ),
        },
      ],
    },
  };
};

export const TokenListNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        animationEnabled: true,
        cardStyleInterpolator: forSlide,
      }}
    >
      <Stack.Screen
        name="List"
        component={List}
        options={{ title: "Contact list" }}
      />
      <Stack.Screen
        name="Detail"
        component={Detail}
        options={{ title: "Detail" }}
      />
    </Stack.Navigator>
  );
};
