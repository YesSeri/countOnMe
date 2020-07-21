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

let workTime = 25;
let restTime = 5;
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

  startCountdown(){
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
        </View>
        <View style={styles.smallerBoxContainer}>
          <CustomButton 
            style={styles.bigButtonStyle}
            title="Back" onPress={() => goBack() } 
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
