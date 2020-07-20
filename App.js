import React, { useState } from 'react';
import { activateKeepAwake, deactivateKeepAwake } from 'expo-keep-awake';
import { TextInput, View, Vibration, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Constants from 'expo-constants';
import Title from './components/Title'
import FillingElement from './components/FillingElement'
import { scale, verticalScale, moderateScale } from './components/Scaling'
import { primaryColor, secondaryColor, darkColor } from './components/ColorConstants'
import CustomButton from './components/CustomButtons'

let workTime = 25;
let restTime = 5;
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
  
    fontSize: scale(75), 
    fontWeight: "900",
    borderRadius: 10,
    color: primaryColor, 
  },
  textInputContainer: {
    padding: scale(20),
  },
  textInputStyle: {
  },
  countdownStyle: {
    fontSize: scale(100),
    color: darkColor,
  },
  buttonContainer: {
    width: '95%',
    paddingBottom: 15,
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
      count: workTime * 60, 
    };
  }
  _activate = () => {
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
    clearInterval(this.isCounting)
    this.isCounting = undefined;
    this._deactivate()
  }

  startCountdown = () =>{
    this.isCounting = setInterval(this.countdown, 1000)
    this._activate
    activateKeepAwake()
  }

  countdown = () => {
    if (this.state.count !== 0) {
      this.setState({
        count: this.state.count - 1,
      })
    } else if (this.state.resting === false) {
      Vibration.vibrate(DURATION)
      this.setState({
        count: restTime * 60,
        resting: true,
      })
    } else {
      Vibration.vibrate(DURATION)
      this.setState({
        count: workTime * 60,
        resting: false,
      })
    }
  }

  resetCountdown = () => {
    this._deactivate()
    if (this.isCounting !== undefined){
      this.pauseCountdown()
    }
    this.setState({
      count: workTime * 60,
    })
  }

  setWorkTime (value) {
    workTime = parseInt(value)
  }
  
  setRestTime = (value) => {
    restTime = parseInt(value)
    this.setState({
      resting: false
    })
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
              style={[styles.smallButtonStyle, { backgroundColor: darkColor }]} 
              title="Settings" onPress={() => 
                navigation.navigate('Settings', { 
                  setWorkTime: this.setWorkTime,
                  setRestTime: this.setRestTime,
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
  const { setWorkTime, setRestTime, resetCountdown } = props.route.params
  const [madeChanges, setMadeChanges] = useState(false); 
  function goBack(){
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
            style={styles.textInputStyle}
            textAlign='center'
            placeholder="Work" 
            keyboardType="numeric"
            onChangeText={value => { setMadeChanges(true) ; setWorkTime(value) }
          }
          />
        </View>
          
        <View style={styles.textInputContainer}>
          <TextInput 
            style={styles.textInputStyle}
            textAlign='center'
            placeholder="Rest" 
            keyboardType="numeric"
            onChangeText={value => { setMadeChanges(true) ; setRestTime(value) }
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