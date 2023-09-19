import { useEffect, useState } from "react";
import { View, TextInput, Button, StyleSheet } from 'react-native';
function useTokenData() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>({});
  const publicKey = window.xnft.solana.publicKey.toString()
  async function fetchTokenData(count = 20) {
    const url = `https://xnft-api-server.xnfts.dev/v1/users/fromPubkey?publicKey=${publicKey}`;
    return fetch(url).then((r) => r.json());
  }
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
const ProfileScreen = () => {
  const { data, loading } = useTokenData();
  const wallet = window.xnft.solana
  const [formData, setformData] = useState({
    name :'',
    phone:'',
    email:'',
    publickey:'',
    telegram:'',
    website:''
  }); 

  useEffect(() => {
    handleChange('publickey', wallet.publicKey.toString())
    if (data.user) {
      handleChange('name', data.user.username)
    }
  }, [data]);

  

  const handleSave = () => {
    // console.log(formData)
    // console.log(wallet)
    // Đưa logic lưu thông tin cá nhân vào đây
    // Ví dụ: gửi yêu cầu API đến máy chủ để lưu thông tin
  };
  const handleChange = (fieldName: string, value: any) => {
    setformData({
      ...formData,
      [fieldName]: value,
    });
  };
  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Name"
        value={formData.name}
        onChangeText={(text) => handleChange('name', text)}
        style={styles.input}
      />
      <TextInput
        placeholder="Phone"
        value={formData.phone}
        onChangeText={(text) => handleChange('phone', text)}
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        value={formData.email}
        onChangeText={(text) => handleChange('email', text)}
        style={styles.input}
      />
      <TextInput
        placeholder="Public Key"
        value={formData.publickey}
        onChangeText={(text) => handleChange('publickey', text)}
        style={styles.input}
        
      />
      <TextInput
        placeholder="Telegram"
        value={formData.telegram}
        onChangeText={(text) => handleChange('telegram', text)}
        style={styles.input}
      />
      <TextInput
        placeholder="Website"
        value={formData.website}
        onChangeText={(text) => handleChange('website', text)}
        style={styles.input}
      />
      
      <Button title="Lưu" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginVertical: 10,
    paddingHorizontal: 10,
  },
});

export default ProfileScreen;
