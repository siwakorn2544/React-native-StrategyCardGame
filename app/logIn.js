import React, {useState, useEffect} from 'react';
import {dataCheck, createUser} from './database/User'
import {SafeAreaView,StyleSheet, View, Text, Button, Image} from 'react-native';

import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-community/google-signin';

import auth from '@react-native-firebase/auth';


function App ({ navigation }) {
  const [loggedIn, setloggedIn] = useState(false);
  const [user, setUser] = useState([]);

  const _signIn = async () => {
    console.log('Start SignIn . . .');
    try {
      await GoogleSignin.hasPlayServices();
      const {accessToken, idToken} = await GoogleSignin.signIn();
      setloggedIn(true);

      const credential = auth.GoogleAuthProvider.credential(
        idToken,
        accessToken,
      );
      await auth().signInWithCredential(credential);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        console.log('Cancel');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Signin in progress');
        // operation (f.e. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('PLAY_SERVICES_NOT_AVAILABLE');
        // play services not available or outdated
      } else {
        // some other error happened
        console.log('error code: '+error.code)
      }
    }
  };
  function onAuthStateChanged(user) {
    setUser(user);
    if (user) setloggedIn(true);
  }

  const signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      auth()
        .signOut()
        .then(() => alert('Your are signed out!'));
      setloggedIn(false);
      setUser([]);
    } catch (error) {
      console.error(error);
    }
  };

  const checkData_User = async () => {
    let exists = await dataCheck(user.uid);
    if (!exists){
      //create new player
      await createUser(user.uid, user.displayName); 
    }
    // await _storeData()
    await navigation.navigate('Main', {UID: user.uid});
  }

  useEffect(() => {
    GoogleSignin.configure({
      scopes: ['email'], // what API you want to access on behalf of the user, default is email and profile
      webClientId:
      "363246296384-gl6ar5f3sq3ajjnoqh8olmqptl6vkqur.apps.googleusercontent.com", // client ID of type WEB for your server (needed to verify user ID and offline access)
      offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
    });
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  return (
    <View style={styles.bg}>
      <SafeAreaView>
          <View style={styles.body}>
            <View style={styles.sectionContainer}>
              {!loggedIn && (
                <GoogleSigninButton
                  style={{width: 192, height: 48}}
                  size={GoogleSigninButton.Size.Wide}
                  color={GoogleSigninButton.Color.Dark}
                  onPress={_signIn}
                />
              )}
            </View>            
            <View style={styles.buttonContainer}>
              {!user && <Text>You are currently logged out</Text>}
              {user && (
                <View >
                  <Text>Welcome {user.displayName}</Text>
                  <Image source={{uri: user.photoURL}} style={styles.iconUser}/>
                  <View>
                    <TouchableOpacity 
                     onPress= { checkData_User }
                     style={styles.buttonPlay}>
                       <Text style={styles.textinbutton}> Start Game</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                    onPress={signOut}
                    style={styles.buttonlogout}>
                      <Text style={styles.textinbutton}> Log out</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
         </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: 'white',
  },
  body: {
    backgroundColor: 'white',
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent:'center'
  },
  buttonContainer: {
    alignSelf: 'center',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: 'black',
  },
  highlight: {
    fontWeight: '700',
  },
  iconUser: {
    margin: 15,
    width: 66,
    height: 58,
    alignSelf: "center"
  },
  buttonPlay:{
    borderWidth:3,
    borderColor:'green',
    backgroundColor:'green',
    borderRadius:2,
    margin:10,
    paddingHorizontal: 30,
    paddingVertical: 5
  },
  buttonlogout:{
    borderWidth:3,
    borderColor:'red',
    backgroundColor:'red',
    borderRadius:2,
    margin:10,
    paddingHorizontal: 30,
    paddingVertical: 5
  },
  textinbutton:{
    color:"#FFFFFF",
    fontWeight:'bold',
    textAlign:'center'
  }
});

export default App;