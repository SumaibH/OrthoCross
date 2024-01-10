import { Video } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import React, { useEffect, useState } from 'react';
import { Animated, Image, LogBox, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Entypo, FontAwesome, Foundation, Ionicons } from 'react-native-vector-icons';
LogBox.ignoreAllLogs();

const MainApp = () => {
  const [image, setImage] = useState(null);
  const [mediaPlay, setMediaPlay] = useState(false)
  const [distance, setDistance] = useState(-50)
  const [area,setArea]=useState(72)
  //image picker code
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      // aspect: [4, 5],
    });
    if (!result.canceled) {
      setImage(result.uri);
      setMediaPlay(true)
    }
  };

  // vedio picker code

  const [getvideo, setGetVideo] = useState(null);
  const video = React.useRef(null);
  const videoA = React.useRef(null);
  const [status, setStatus] = React.useState({});
  const [statusA, setStatuA] = React.useState({});

  const pickVideo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
    });

    if (!result.canceled) {
      const asset = await MediaLibrary.createAssetAsync(result.uri);
      setGetVideo(asset.uri);
      setMediaPlay(false)
    }
  };

  useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access media library is required to pick videos.');
      }
    })();
  }, []);

  useEffect(() => {
  }, [getvideo]);
  // zoom effect code image 
  const [duration, setDuration] = useState(1000); // Initial duration in milliseconds
  const zoomValue = new Animated.Value(1);
  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(zoomValue, {
          toValue: 2.2,
          duration: duration, // Use the duration state variable
          useNativeDriver: true,
        }),
        Animated.timing(zoomValue, {
          toValue: 1,
          duration: duration, // Use the duration state variable
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    // Cleanup the animation when the component unmounts
    return () => {
      animation.stop();
    };
  }, [duration]);

  const handleIncreaseDuration = () => {
    setDuration(duration + 500); // Increase the duration by 500 milliseconds
  };

  const handleDecreaseDuration = () => {
    if (duration > 500) {
      setDuration(duration - 500); // Decrease the duration by 500 milliseconds (minimum 500)
    }
  };
  //distance code for vedio
  const IncreaseDuration = () => {
    setDistance(distance + 0.5); // Increase the duration by 500 milliseconds
    // setArea(area +3)
  };

  const Decreasedistance = () => {
    setDistance(distance - 0.5);
  };
  const Increasearea=()=>{
    setArea(area +1)
  }
  const Decreasearea=()=>{
    setArea(area -1)
  }
  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      <View style={{ width: "100%", flexDirection: "row" }}>
        <View style={{ width: "7%", zIndex:1 }}>
          <View style={{ width: "100%", height: "50%",justifyContent: "space-around" }}>
          <TouchableOpacity style={{alignSelf: 'center',justifyContent:"center",width:45,height:45,borderRadius:50,}} onPress={pickImage}>
              <Ionicons name="images-sharp" size={15} color="#1B1B1B" style={{alignSelf:"center"}} />
             </TouchableOpacity>
             <TouchableOpacity style={{alignSelf: 'center',justifyContent:"center",width:45,height:45,borderRadius:50}} onPress={pickVideo}>
              <Entypo name="video" size={20} color="#1B1B1B"  style={{alignSelf:"center"}} />
             </TouchableOpacity>
          </View>
          <View style={{ width: "100%", height: "50%",justifyContent: "space-around" }}>
          <TouchableOpacity  style={{alignSelf: 'center',justifyContent:"center",width:45,height:45,borderRadius:50}} onPress={IncreaseDuration}>
              <FontAwesome name="minus" size={20} color="#1B1B1B" style={{alignSelf:"center"}}/>
            </TouchableOpacity>
            <TouchableOpacity  style={{alignSelf: 'center',justifyContent:"center",width:45,height:45,borderRadius:50}} onPress={Decreasedistance}>
            <FontAwesome name="plus" size={20} color="#1B1B1B"  style={{alignSelf:"center"}}/>
            </TouchableOpacity>
          </View>
        </View>
        {/* ----------------------------------middle screen------------------------------------ */}
        <View style={{ width: "86%", justifyContent:"center" }}>
        {mediaPlay == true?
          <View style={styles.boxContainer}>
           <Animated.View style={[styles.boxLeft, {left:distance}, { transform: [{ scale: zoomValue },
            { translateX: zoomValue.interpolate({ inputRange: [1, 2.5], outputRange: [0, area] }) }
            ,] }]}>{image && <Image source={{ uri: image }} resizeMode="contain" style={styles.image} />}</Animated.View>
            <Animated.View style={[styles.box, {right:distance} ,{ transform: [{ scale: zoomValue },   
              { translateX: zoomValue.interpolate({ inputRange: [1, 2.5], outputRange: [ 0,-area] }) }] }]}>{image && <Image source={{ uri: image }} resizeMode="contain" style={styles.image} />}</Animated.View>
           
          </View>:
          <>
             <View style={styles.boxContainer}>
              <Animated.View style={[styles.boxLeft,{left:distance}, { transform: [{ scale: zoomValue },
              { translateX: zoomValue.interpolate({ inputRange: [1, 2], outputRange: [0, area] }) }
              ] }]}>
            <Video
            style={styles.video}
            source={{uri: getvideo,}}
            isMuted
            shouldPlay
            isLooping
            resizeMode="contain"
           
          />
              </Animated.View>
          
        
          <Animated.View style={[styles.box, {right:distance}, { transform: [{ scale: zoomValue }, { translateX: zoomValue.interpolate({ inputRange: [1, 2], outputRange: [ 0,-area] }) }] }]}>
            <Video
            style={styles.video}
            source={{uri: getvideo,}}
            shouldPlay
            isLooping
            resizeMode="contain"
          />
          </Animated.View>
          </View>
          </>}

        </View>
        {/* last screen */}
        <View style={{ width: "7%", }}>
        <View style={{ width: "100%",  height: "50%",justifyContent: "space-around" }}>
        <TouchableOpacity  style={{alignSelf: 'center',justifyContent:"center",width:45,height:45,borderRadius:50}} onPress={handleIncreaseDuration}>
              <Foundation name="zoom-out" size={20} color="#1B1B1B" style={{alignSelf:"center"}}/>
            </TouchableOpacity>
            <TouchableOpacity  style={{alignSelf: 'center',justifyContent:"center",width:45,height:45,borderRadius:50}} onPress={handleDecreaseDuration}>
            <Foundation name="zoom-in" size={20} color="#1B1B1B"  style={{alignSelf:"center"}}/>
            </TouchableOpacity>
        </View>
        <View style={{ width: "100%", height: "50%",justifyContent: "space-around" }}>


        <TouchableOpacity  style={{alignSelf: 'center',justifyContent:"center",width:45,height:45,borderRadius:50}} onPress={Increasearea}>
              <Entypo name="controller-fast-forward" size={20} color="#1B1B1B" style={{alignSelf:"center"}}/>
            </TouchableOpacity>
            <TouchableOpacity  style={{alignSelf: 'center',justifyContent:"center",width:45,height:45,borderRadius:50}} onPress={Decreasearea}>
            <Entypo name="controller-fast-backward" size={20} color="#1B1B1B"  style={{alignSelf:"center"}}/>
            </TouchableOpacity>
        </View>

        </View>

      </View>
    </View>
  );
}

export default MainApp

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    flexDirection: "row"
    // alignItems: 'center',
    // justifyContent: 'center',
    // Set your desired background color

  },
  video: {
    flex: 1,
    // alignSelf: 'center',
    // width: "90%",
    // height: 150,
    bottom: 10
  },
  buttons: {
    paddingTop: "5%",
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    height: 200,
  },
  boxLeft: {
    width: "12%",
    // left:distance,
    height: 200
  },
  box: {
    width: "12%",
    // right:distance,
    height: 200
  },
  image: {
    flex: 1,
    // width: undefined,
    // height: undefined,
  },
})