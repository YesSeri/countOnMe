import React, { useState } from 'react';
import { activateKeepAwake, deactivateKeepAwake } from 'expo-keep-awake';
import { TextInput, View, Vibration, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Constants from 'expo-constants';
import Title from './components/Title'
import { scale } from './components/Scaling'
import { primaryColor, secondaryColor, lightColor, darkColor } from './components/ColorConstants'
import CustomButton from './components/CustomButtons'

const DURATION = 800; 
const Stack = createStackNavigator();

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    width: '100%',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: lightColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerAppContainer: {
    width: '95%',
    height: '98%',
    justifyContent: 'space-evenly',
    borderRadius: 10,
  },
  titleStyle: {
    fontSize: scale(65), 
    fontWeight: "900",
    borderRadius: 10,
    color: primaryColor, 
    textShadowColor: darkColor,
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius:3 
  },
  boxContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    width: '100%',
    height: '37%', 
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallerBoxContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    width: '100%',
    height: '20%', 
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInputContainer: {
    padding: scale(20),
  },
  countdownStyle: {
    fontSize: scale(100),
    color: darkColor,
    textShadowColor: darkColor,
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius:3 
  },
  bigButtonContainer: {
    marginBottom: 10,
    width: '95%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  smallButtonContainer: {
    width: '95%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  bigButtonStyle: { width: '95%',
       backgroundColor: primaryColor,
  },
  smallButtonStyle: {
    width: '45%',
  },
})

class HomeScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      resting: false,
      count: 25 * 60, 
      restTime: 5,
      workTime: 25,
    };
  }
  _activate = () => { // These two functions are used to stop the phone from going into sleep mode. 
    activateKeepAwake();
  };

  _deactivate = () => {
    deactivateKeepAwake();
  };

  toggleCountdown(){
    if (this.isCounting !== undefined){
      this.pauseCountdown()
    } else {
      this.startCountdown()
    }
  }

  pauseCountdown(){
    clearInterval(this.isCounting) // This pauses the function. Note the this.isCounting
    this.isCounting = undefined;
    this._deactivate()
  }

  startCountdown(){
    this.isCounting = setInterval(this.countdown, 1000) // Here the countdown is started with setInterval
    this._activate
    activateKeepAwake()
  }

  countdown = () => { // Runs every 1 sec. If count is not zero it counts down further, otherwise it switches mode between work and rest, and sets the correct time.
    if (this.state.count !== 0) {
      this.setState({
        count: this.state.count - 1,
      })
    } else {
      Vibration.vibrate(DURATION)
      const newTime = this.state.resting ? this.state.workTime : this.state.restTime
      this.setState({
        count: newTime * 60,
        resting: !this.state.resting,
      })
    }
  }

  resetCountdown = () => {
    this._deactivate() // Lets the phone enter sleep mode again, since countdown is no longer active. 
    if (this.isCounting !== undefined){
      this.pauseCountdown()
    }
    this.setState({
      count: this.state.workTime * 60,
    })
  }

  setWorkTime = (value) => {  // Very important that resetCountdown is a callback function, within setstate. Otherwise resetCountdown gets called before new state is set, and the app is shit. 
    this.setState({
      resting: false,
      workTime: parseInt(value),
    }, this.resetCountdown)
  }
  
  setRestTime = (value) => { 
    this.setState({
      resting: false,
      restTime: parseInt(value),
    }, this.resetCountdown())
  }

  render() {
    const {navigation} = this.props; // Needed for making navigation work. 
    return (
      <View style={styles.appContainer}>
        <View style={styles.innerAppContainer}>
          <View style={styles.boxContainer}>
            <Title 
              style={styles.titleStyle} 
              resting={this.state.resting} 
              isCounting={this.isCounting} 
            />
          </View>
          <View style={styles.boxContainer}>
            <Text style={styles.countdownStyle} >
              {parseInt(this.state.count / 60)} 
              :
              {this.state.count % 60 < 10 ? '0' + this.state.count % 60: this.state.count % 60}
            </Text>
          </View>
          <View style={styles.smallerBoxContainer}>
            <View style={styles.bigButtonContainer}>
              <CustomButton 
                style={styles.bigButtonStyle} 
                title="Toggle" 
                onPress={() => this.toggleCountdown()} 
              />
            </View>
            <View style={styles.smallButtonContainer}>
              <CustomButton 
                style={[styles.smallButtonStyle, { backgroundColor: secondaryColor }]} 
                title="Reset" 
                onPress={ () => this.resetCountdown()} 
              />
              <CustomButton 
                style={[styles.smallButtonStyle, { backgroundColor: darkColor }]} 
                title="Settings" onPress={() => 
                  navigation.navigate('Settings', { 
                    setWorkTime: this.setWorkTime,
                    setRestTime: this.setRestTime,
                    resetCountdown: this.resetCountdown,
                  })
                } 
              />
            </View>
          </View>
        </View>
      </View>
    );
  }
}

function SettingsScreen(props) { // Now that workTime and restTime is in state, it would be easy to implement seconds as an option. 
  const { navigation } = props
  const { setWorkTime, setRestTime } = props.route.params // Extracts the functions I sent through the navigation. 
  return(
    <View style={styles.appContainer}>
      <View style={styles.innerAppContainer}>
        <View style={styles.boxContainer}>
         <Title style={styles.titleStyle} />
        </View>
        <View style={styles.boxContainer}>
          <View style={styles.textInputContainer}>
            <TextInput 
              style={styles.textInputStyle}
              textAlign='center'
              placeholder="Work" 
              keyboardType="numeric"
              onChangeText={value => setWorkTime(value) }
            />
          </View>
          <View style={styles.textInputContainer}>
            <TextInput 
              style={styles.textInputStyle}
              textAlign='center'
              placeholder="Rest" 
              keyboardType="numeric"
              onChangeText={value => setRestTime(value) } 
            />
          </View>
        </View>
        <View style={styles.smallerBoxContainer}>
          <CustomButton 
            style={styles.bigButtonStyle}
            title="Back" onPress={() => 
              navigation.navigate('Home')
            } 
          />
        </View>
      </View>
    </View>
  )
}

class App extends React.Component{
  render(){
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} options={{headerShown: false}} />
          <Stack.Screen name="Settings" component={SettingsScreen} options={{headerShown: false}} />
        </Stack.Navigator>
      </NavigationContainer>
    )
  }
}

export default App;
