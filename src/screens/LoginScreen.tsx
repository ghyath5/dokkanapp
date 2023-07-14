import React, {useState} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
} from 'react-native';
import {useAuth} from '../context/AuthContext';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
const LoginScreen: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const {signIn} = useAuth();
  const handleLogin = () => {
    signIn(username, password);
  };

  return (
    <View style={styles.container}>
      <View style={styles.userIconContainer}>
        <FontAwesomeIcon color={'white'} size={50} name="user-o" />
      </View>
      <View style={styles.formContainer}>
        <TextInput
          placeholderTextColor={'gray'}
          style={styles.input}
          placeholder="اسم المستخدم"
          onChangeText={setUsername}
          value={username}
        />
        <TextInput
          placeholderTextColor={'gray'}
          style={styles.input}
          placeholder="كلمة المرور"
          onChangeText={setPassword}
          value={password}
          secureTextEntry
          autoCapitalize="none"
          autoComplete="off"
          autoCorrect={false}
        />
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.buttonText}>دخول</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  userIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ccc',
    marginBottom: 20,
    marginTop: 0,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    width: '80%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
    color: 'black',
  },
  loginButton: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
