import React, {useState, useEffect} from 'react';
import {dataCheck, createUser} from './database/User'
import {SafeAreaView,StyleSheet, View, Text, Button, Image, TouchableOpacity, ImageBackground} from 'react-native';

import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-community/google-signin';
// import Icon from 'react-native-vector-icons/AntDesign';
import auth from '@react-native-firebase/auth';
import { useSelector, useDispatch } from "react-redux";
import { setuser } from './redux/userAction';


function App ({ navigation, route }) {
  const dispatch = useDispatch();
  // dispatch( setuser( "IT-KMITL" ) );
  const [loggedIn, setloggedIn] = useState(false);
  const [user, setUser] = useState([]);
  if(route.params){
    if(user.uid == route.params.haveplayed){
      alert("YOU LOSE")
    }else{
      alert("YOU WIN")
    }
    console.log(route)
  }
// ---------SignIN-----------
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
  // ---------SignIN-----------
  function onAuthStateChanged(user) {
    setUser(user);
    if (user) setloggedIn(true);
  }
// ---------SignOUT-----------
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
// ---------SignOUT-----------
  const checkData_User = async () => {
    let exists = await dataCheck(user.uid);
    if (!exists){
      //create new player
      await createUser(user.uid, user.displayName);
    }
    // await _storeData()
    dispatch( setuser( user.displayName, user.uid, user.photoURL ) );
    await navigation.navigate('Main');
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
      <ImageBackground source={require('./assets/imggif/2.gif')} resizeMode="cover" style={styles.imageBG}>
          <View style={styles.body}>
            <View >
              {/* Google SignIn */}
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
               {/* Google SignIn */}
              <View style={styles.buttonContainer}>
                {!user}
                {user && (
                  <View style={styles.UserView}> 
                       <Text style={styles.fontWelcome} >Welcome {user.displayName}</Text>
                          
                          <View style={styles.imgUser}>
                            <Image source={{uri: user.photoURL}} style={styles.iconUser}/>
                          </View>
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
         </View>
         </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },
  body: {
    flex: 1,
    flexDirection: 'column',
    justifyContent:'flex-end',  
    alignSelf: 'center',
  },
  imageBG:{
    flex:1, 
  },
  sectionContainer: {
    flex:1,
    flexDirection: 'column',
    marginTop: 32,
    paddingHorizontal: 24,
    alignItems: 'flex-end',
    alignSelf: 'center',
    justifyContent:'center',
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
    alignSelf: "center",
    backgroundColor:"white",
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
    textAlign:'center',
    fontFamily: "MEGLORIA",
    fontSize:20,
  },
  fontWelcome:{
    backgroundColor:'rgba(71, 66, 66, 0.5)',
    fontSize:20,
    borderRadius:10,
    fontFamily: "MEGLORIA"
  },
  imgUser:{
    backgroundColor:"rgba(83, 72, 79, 0.4)",
    marginTop:10,
    marginBottom:10,
    borderTopRightRadius:20,
    borderBottomLeftRadius:20,
  },
  UserView:{
  flex:1,
  justifyContent:'center',
  alignItems:'center'
  },
});

export default App;