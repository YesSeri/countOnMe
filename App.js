import React, { useState } from 'react';
import { TextInput, View, Vibration, Text, StyleSheet } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Constants from 'expo-constants';

import Title from './components/Title'
import { primaryColor, secondaryColor, tertiaryColor } from './components/ColorConstants'
import CustomButton from './components/CustomButtons'

let workTimeMin = 25;
let workTimeSec = 0;
let restTimeMin = 5;
let restTimeSec = 0;
const DURATION = 800; 

const Stack = createStackNavigator();

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    width: '100%',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerAppContainer: {
    width: '95%',
    height: '98%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  titleStyle: {
    textAlign: 'center',
    fontSize: 70, 
    fontWeight: "900",
    borderRadius: 10,
    color: primaryColor, 
  },
  textInputContainer: {
    flexDirection: 'row',
    paddingBottom: 10,
  },
  countdownStyle: {
    fontSize: 100,
  },
  instructionTextStyle: {
    fontSize: 50,
  },
  buttonContainer: {
    width: '95%',
    paddingBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  bigButtonStyle: {
    width: '95%',
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
      count: workTimeMin * 60 + workTimeSec,
    };
  }

  toggleCountdown(){
    if (this.isCounting !== undefined){
      this.pauseCountdown()
    } else {
      this.startCountdown()
    }
  }

  pauseCountdown(){
    clearInterval(this.isCounting)
    this.isCounting = undefined;
  }

  startCountdown = () =>{
    this.isCounting = setInterval(this.countdown, 1000)
  }

  countdown = () => {
    if (this.state.count !== 0) {
      this.setState({
        count: this.state.count - 1,
      })
    } else if (this.state.resting === false) {
      Vibration.vibrate(DURATION)
      this.setState({
        count: restTimeMin * 60 + restTimeSec,
        resting: true,
      })
    } else {
      Vibration.vibrate(DURATION)
      this.setState({
        count: workTimeMin * 60 + workTimeSec,
        resting: false,
      })
    }
  }

  resetCountdown = () => {
    if (this.isCounting !== undefined){
      this.pauseCountdown()
    }
    this.setState({
      count: workTimeMin * 60 + workTimeSec,
    })
  }

  setWorkTimeMin(value) {
    workTimeMin = parseInt(value)
  }
  
  setWorkTimeSec(value) {
    workTimeSec = parseInt(value)
  }

  setRestTimeMin(value) {
    restTimeMin = parseInt(value)
  }

  setRestTimeSec(value) {
    restTimeSec = parseInt(value)
  }

  render() {
    const {navigation} = this.props;
    return (
      <View style={styles.appContainer}>
        <View style={styles.innerAppContainer}>
          <Title style={styles.titleStyle} resting={this.state.resting} isCounting={this.isCounting} />
          <Text style={styles.countdownStyle} >
            {parseInt(this.state.count / 60)}
            :
            {this.state.count % 60 < 10 ? '0' + this.state.count % 60: this.state.count % 60}
          </Text>
          <View style={styles.buttonContainer}>
            <CustomButton 
              style={styles.bigButtonStyle} 
              title="Toggle" onPress={() => this.toggleCountdown()} 
            />
          </View>
          <View style={styles.buttonContainer}>
            <CustomButton 
              style={[styles.smallButtonStyle, { backgroundColor: secondaryColor }]} 
              title="Reset" onPress={() => this.resetCountdown()} 
            />
            <CustomButton 
              style={[styles.smallButtonStyle, { backgroundColor: tertiaryColor }]} 
              title="Settings" onPress={() => 
                navigation.navigate('Settings', { 
                  setWorkTimeMin: this.setWorkTimeMin,
                  setWorkTimeSec: this.setWorkTimeSec,
                  setRestTimeMin: this.setRestTimeMin,
                  setRestTimeSec: this.setRestTimeSec,
                  resetCountdown: this.resetCountdown,
                })} 
            />
          </View>
        </View>
      </View>
    );
  }
}

function SettingsScreen(props) {
  const { navigation } = props
  const { setWorkTimeSec, setWorkTimeMin, setRestTimeSec, setRestTimeMin, resetCountdown } = props.route.params
  const [madeChanges, setMadeChanges] = useState(false);
  let workMinChanged, workSecChanged, restMinChanged, restSecChanged
  workMinChanged = workSecChanged = restMinChanged = restSecChanged = false
  function goBack(){
    console.log( workMinChanged)
    if (workSecChanged && !workMinChanged){
      setWorkTimeMin(0)
    } else if (!workSecChanged && workMinChanged){
      setWorkTimeSec(0)
    } else if (restSecChanged && !restMinChanged){
      setRestTimeMin(0)
    } else if (!restSecChanged && restMinChanged){
      setRestTimeSec(0)
    }
    if (madeChanges){
      resetCountdown()
    }
    navigation.navigate('Home')
  }
  return(
    <View style={styles.appContainer}>
      <View style={styles.innerAppContainer}>
        <Title style={styles.titleStyle} />
        <View style={styles.textInputContainer}>
          <TextInput 
            style={{margin: 10}}
            placeholder="Work (min)" 
            keyboardType="numeric"
            onChangeText={value => { setMadeChanges(true) ; setWorkTimeMin(value) ; workMinChanged = true }
          }
          />
          <TextInput 
            style={{margin: 10}}
            placeholder="Work (sec)" 
            keyboardType="numeric"
            onChangeText={value => { setMadeChanges(true) ; setWorkTimeSec(value) ; workSecChanged = true }
          }
          />
        </View>
        <View style={styles.textInputContainer}>
          <TextInput 
            style={{margin: 10}}
            placeholder="Rest (min)" 
            keyboardType="numeric"
            onChangeText={value => { setMadeChanges(true) ; setRestTimeMin(value) ; restMinChanged = true }
          }
          />
          
          <TextInput 
            style={{margin: 10}}
            placeholder="Rest (sec)" 
            keyboardType="numeric"
            onChangeText={value => { setMadeChanges(true) ; setRestTimeSec(value) ; restMinChanged = true }
          }
          />
        </View>
        <CustomButton 
          style={styles.bigButtonStyle}
          title="Back" onPress={() => goBack() } 
        />
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