import React from 'react';
import { SafeAreaView, StyleSheet, View, Image, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

function WelcomeScreen(props) {
    return (
        <View style={styles.container}>
            <LinearGradient
            colors={['#2a2a2a', '#111111' ]}
            style={styles.background}
            start={{ x: 1, y: 0 }}>
                <SafeAreaView style={styles.container}>
                    <Image style={{
                            resizeMode: 'contain',
                            height: 100,
                            width: 100,
                        }}
                        source={require('../assets/logo.png')}/>
                    <Text>FitAI</Text>
                    <Text>Sign in</Text>    
                </SafeAreaView>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      },
      background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: '100%'
      }
})

export default WelcomeScreen;