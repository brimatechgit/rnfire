/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState} from 'react';
import type {Node} from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import firestore from '@react-native-firebase/firestore';

import auth from '@react-native-firebase/auth';


const App: () => Node = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const userText = 'Nothing to show yet';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  // If null, no SMS has been sent
  const [confirm, setConfirm] = useState(null);

  const [code, setCode] = useState('');

  // Handle the button press
  async function signInWithPhoneNumber(phoneNumber) {
    const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
    setConfirm(confirmation);
  }

  async function confirmCode() {
    try {
      await confirm.confirm(code);
    } catch (error) {
      console.log('Invalid code.');
    }
  }

  async function getUser(){
  

    //creates users with passw and email
    auth()
      .createUserWithEmailAndPassword('jane2.doe@example.com', 'SuperSecretPassword!')
      .then(() => {
        console.log('User account created & signed in!');
        firestore()
      .collection('users')
      .add({
        name: 'Ada Auth 2',
        email: 'jane2.doe@example.com',
      })
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          console.log('That email address is already in use!');
        }

        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!');
        }

        console.error(error);
      });
    
    //one time read of the users collection in db
    const usersCollection = await firestore().collection('users').get();

    console.log(usersCollection.size)
    
    //get users in users collection
    firestore()
      .collection('users')
      .get()
      .then(querySnapshot => {
        console.log('Total users: ', querySnapshot.size);

        querySnapshot.forEach(documentSnapshot => {
          //displays user id and document field data
          console.log('User ID: ', documentSnapshot.id, documentSnapshot.data());

          
          //fetch user email
          console.log(documentSnapshot.get("email"))
        });
      });
  }

   
  return (
    <SafeAreaView style={backgroundStyle}>
      <Text>{userText}</Text>

      {/* press to push and pull from db */}
      <Button
      title='get from db'
      onPress={getUser}
      ></Button>

      <Button
        title="Phone Number Sign In"
        onPress={() => signInWithPhoneNumber('+270790544224')}
      />
  
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
