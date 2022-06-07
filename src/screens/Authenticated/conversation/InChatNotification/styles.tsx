import TextStyles from '@components/micro/TextStyles'
import keys, { Colors, Fonts, Measurement } from '@config/keys'
import { Dimensions, StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  notiContainer: {
    justifyContent: 'center',
    marginBottom: 15,
    alignItems: 'center',
  },
  notiText: {
    fontSize: 14,
    color: Colors.Gray3
  },
  title: {
    fontFamily: Fonts.DemiBold
  },
  content: {
    fontFamily: Fonts.Light,
    marginLeft: 5
  }
})

export default styles
