import React from 'react'
import Constants from 'expo-constants'
import { View, StyleSheet, StatusBar, StatusBarStyle } from 'react-native'

import { ColorValue } from '@redux/slices/themeSlice'

const styles = StyleSheet.create({
  wrapper: { height: Constants.statusBarHeight },
})

interface CProps {
  color?: ColorValue
  translucent?: boolean
  barStyle?: StatusBarStyle | null | undefined
}

const AppStatusBar = ({ color, barStyle = 'light-content', translucent = true }: CProps) => {
  const backgroundColor = color || 'transparent'

  return (
    <>
      <View style={{ ...styles.wrapper, backgroundColor }}>
        <StatusBar translucent={translucent} barStyle={barStyle} backgroundColor={backgroundColor} />
      </View>
    </>
  )
}

export default AppStatusBar
