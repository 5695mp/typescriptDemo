import TextStyles from '@components/micro/TextStyles'
import keys, { Colors, Fonts, Measurement } from '@config/keys'
import { Dimensions, StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  notificationContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationText: {
    fontSize: 14,
    color: Colors.Gray3
  },
  notificationBold: {
    fontFamily: Fonts.DemiBold
  },
  notificationNormal: {
    fontFamily: Fonts.Light
  }
})

export default styles
