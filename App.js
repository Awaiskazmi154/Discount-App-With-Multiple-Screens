import React, { Component, useState, useEffect } from 'react';
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  Button,
  Alert,
  TouchableHighlight,
  ScrollView,
} from 'react-native';

import { FontAwesome } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Constants from 'expo-constants';

// You can import from local files
import AssetExample from './components/AssetExample';

const StartScreen = ({ navigation, route }) => {
  const [getErrorMsg1, setErrorMsg1] = useState('');
  const [getErrorMsg2, setErrorMsg2] = useState('');
  const [getPressed, setPressed] = useState(false);
  const [getPriceList, setPriceList] = useState([]);
  const [getDiscountList, setDiscountList] = useState([]);
  const [getFinalPriceList, setFinalPriceList] = useState([]);
  const [getOriginalPrice, setOriginalPrice] = useState('');
  const [getDiscountPercent, setDiscountPercent] = useState('');
  const [getFinalPrice, setFinalPrice] = useState(
    (getOriginalPrice - (getOriginalPrice * getDiscountPercent) / 100).toFixed(
      2
    )
  );

  const addItem = () => {
    setPriceList([
      ...getPriceList,
      { key: Math.random().toString(), data: getOriginalPrice },
    ]);
    setDiscountList([
      ...getDiscountList,
      { key: Math.random().toString(), data: getDiscountPercent },
    ]);
    setFinalPriceList([
      ...getFinalPriceList,
      {
        key: Math.random().toString(),
        data: (
          getOriginalPrice -
          (getOriginalPrice * getDiscountPercent) / 100
        ).toFixed(2),
      },
    ]);
    setPressed(true);
  };
  useEffect(() => {
    if (route.params?.returnPriceList && route.params?.returnDiscountList) {
      setPriceList(route.params.returnPriceList);
      setDiscountList(route.params.returnDiscountList);
      setFinalPriceList(route.params.returnFinalPriceList);
      navigation.setParams({ returnPriceList: undefined });
      navigation.setParams({ returnDiscountList: undefined });
      navigation.setParams({ returnFinalPriceList: undefined });
    }
  });
  const validateDiscount = (value) => {
    if (value >= 0 && value <= 100) {
      setDiscountPercent(value), setErrorMsg2(''), setPressed(false);
    } else if (value.includes('-')) {
      setErrorMsg2('No negative Numbers allowed');
      setDiscountPercent('');
    } else if (value > 100) {
      setErrorMsg2('Discount % can not be greater than 100');
      setDiscountPercent('');
    }
  };

  const validateOriginalPrice = (value) => {
    if (value >= 0) {
      setOriginalPrice(value), setErrorMsg1(''), setPressed(false);
    } else if (value.includes('-')) {
      setErrorMsg1('No negative Numbers allowed');
      setOriginalPrice('');
    }
  };

  navigation.setOptions({
    headerRight: () => (
      <View style={{ paddingRight: 10 }}>
        <FontAwesome
          name="history"
          size={24}
          color="black"
          onPress={() =>
            navigation.navigate('HistoryScreen', {
              itemPrice: getPriceList,
              itemDiscount: getDiscountList,
              itemFinalPrice: getFinalPriceList,
            })
          }
        />
      </View>
    ),
  });

  return (
    <View style={styles.container}>
      <Text>Enter Original Price</Text>
      <TextInput
        style={styles.input}
        keyboardType={'number-pad'}
        placeholder={'e.g. 500'}
        maxLength={8}
        textAlign={'center'}
        onChangeText={(val) => validateOriginalPrice(val)}
      />
      <Text style={{ color: 'red', padding: '3%' }}>{getErrorMsg1}</Text>
      <Text>Enter Discount % </Text>
      <TextInput
        style={styles.input}
        keyboardType={'number-pad'}
        placeholder={'e.g. 20'}
        maxLength={5}
        textAlign={'center'}
        onChangeText={(val) => validateDiscount(val)}
      />
      <Text style={{ color: 'red', padding: '3%' }}>{getErrorMsg2}</Text>
      <Text style={[{ textAlign: 'center' }]}>
        {getDiscountPercent != '' && getOriginalPrice !== '' ? (
          <View>
            <Text style={styles.result}>
              You Save : {(getOriginalPrice * getDiscountPercent) / 100}
            </Text>
            <Text style={styles.result}>
              Final Price :{' '}
              {(
                getOriginalPrice -
                (getOriginalPrice * getDiscountPercent) / 100
              ).toFixed(2)}
            </Text>
          </View>
        ) : (
          ''
        )}
      </Text>

      <CustomButton
        disabled={
          getDiscountPercent != '' && getOriginalPrice !== '' ? false : true
        }
        text={'Save Details'}
        textSize={16}
        textColor={'white'}
        onPressEvent={addItem}
        pressed={getPressed}
      />
      <View></View>
    </View>
  );
};
const HistoryScreen = ({ navigation, route }) => {
  const [getPriceHistoryList, setPriceHistoryList] = useState(
    route.params.itemPrice
  );
  const [getDiscountHistoryList, setDiscountHistoryList] = useState(
    route.params.itemDiscount
  );
  const [getFinalPriceHistoryList, setFinalPriceHistoryList] = useState(
    route.params.itemFinalPrice
  );

  const [getL, setL] = useState([
    route.params.itemPrice,
    route.params.itemDiscount,
    route.params.itemFinalPrice,
  ]);
  const [getM, setM] = useState([1]);

  const deleteItem = (e) => {
    if (e[0].key == getPriceHistoryList[0].key) {
      setPriceHistoryList(() =>
        getPriceHistoryList.filter((item) => item.key != e[0].key)
      );
    }

    if (e[0].key == getDiscountHistoryList[0].key) {
      setDiscountHistoryList(() =>
        getDiscountHistoryList.filter((item) => item.key != e[0].key)
      );
    }

    if (e[0].key == getFinalPriceHistoryList[0].key) {
      setFinalPriceHistoryList(() =>
        getFinalPriceHistoryList.filter((item) => item.key != e[0].key)
      );
    }
  };

  const deleteList = () => {
    setPriceHistoryList([]);
    setDiscountHistoryList([]);
    setFinalPriceHistoryList([]);
  };

  navigation.setOptions({
    headerLeft: () => (
      <View style={{ paddingLeft: 10 }}>
        <FontAwesome
          name="long-arrow-left"
          size={20}
          color="grey"
          onPress={() => {
            navigation.navigate('StartScreen', {
              returnPriceList: getPriceHistoryList,
              returnDiscountList: getDiscountHistoryList,
              returnFinalPriceList: getFinalPriceHistoryList,
            });
          }}
        />
      </View>
    ),
    headerRight: () => (
      <View style={{ paddingRight: 10 }}>
        <FontAwesome
          name="trash"
          size={24}
          color="black"
          onPress={() => {
            setPriceHistoryList([]);
            setDiscountHistoryList([]);
            setFinalPriceHistoryList([]);
          }}
        />
      </View>
    ),
  });

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <ScrollView style={styles.modalView}>
        <View style={styles.modalText}>
          <Text style={{ fontWeight: 'bold' }}>Original Price</Text>
          <Text style={{ fontWeight: 'bold' }}>Discount %</Text>
          <Text style={{ fontWeight: 'bold' }}>Final Price</Text>
          <Text style={{ fontWeight: 'bold' }}>Remove</Text>
        </View>
        {getM.map((item) => (
          <View style={styles.modalText}>
            <View>
              {getPriceHistoryList.map((item) => (
                <Text>
                  {item.data}
                  {console.log(item.key)}
                  {'\n'}
                </Text>
              ))}
            </View>
            <View>
              {getDiscountHistoryList.map((item) => (
                <Text>
                  {item.data}
                  {console.log(item.key)}
                  {'\n'}
                </Text>
              ))}
            </View>
            <View>
              {getFinalPriceHistoryList.map((item) => (
                <Text>
                  {item.data}
                  {console.log(item.key)}
                  {'\n'}
                </Text>
              ))}
            </View>
            <View>
              {getFinalPriceHistoryList.map((item) => (
                <Button
                  title={'X'}
                  onPress={() => {
                    getL.forEach(deleteItem);
                  }}>
                  {'\n'}
                </Button>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const CustomButton = (props) => {
  if (props.disabled || props.pressed) {
    var btnColor = 'grey';
  } else {
    btnColor = '#F194FF';
  }
  return (
    <TouchableHighlight
      activeOpacity={0.5}
      onPress={props.onPressEvent}
      disabled={props.disabled || props.pressed}>
      <View style={{ ...styles.saveButton, backgroundColor: btnColor }}>
        <Text
          style={{
            fontSize: props.textSize,
            color: props.textColor,
            padding: 10,
          }}>
          {props.text}
        </Text>
      </View>
    </TouchableHighlight>
  );
};
const Stack = createStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={'StartScreen'}>
        <Stack.Screen
          name="StartScreen"
          component={StartScreen}
          options={{ title: 'Discount App Home', headerTitleAlign: 'center' }}
        />
        <Stack.Screen
          name="HistoryScreen"
          component={HistoryScreen}
          options={{ title: 'History', headerTitleAlign: 'center' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
  },
  input: {
    borderWidth: 1,
    borderColor: '#777',
    padding: 8,
    margin: 10,
    width: '60%',
  },
  result: {
    textAlign: 'center',
    fontWeight: '500',
    fontSize: 30,
    paddingBottom: '5%',
  },
  modalView: {
    textAlign: 'center',
    margin: 25,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    paddingBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  saveButton: {
    backgroundColor: '#F194FF',
    borderRadius: 20,
    padding: 10,
    margin: 5,
    elevation: 2,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
