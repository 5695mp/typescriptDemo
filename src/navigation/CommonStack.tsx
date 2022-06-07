import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import About from '@screens/Common/about/About'
import PrivacyPolicy from '@screens/Common/privacy-policy/PrivacyPolicy'

const CommonStack = createStackNavigator()

export const CommonScreens = {
  About: 'About',
  PrivacyPolicy: 'PrivacyPolicy',
}

const CommonNavigationStack = () => {
  return (
    <CommonStack.Navigator>
      <CommonStack.Screen name={CommonScreens.About} component={About} />
      <CommonStack.Screen name={CommonScreens.PrivacyPolicy} component={PrivacyPolicy} />
    </CommonStack.Navigator>
  )
}

export default CommonNavigationStack
