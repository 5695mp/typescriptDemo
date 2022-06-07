import { Colors } from '@config/keys'
import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  imageView: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: Colors.RebrandDark,
    backgroundColor: Colors.Primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    width: 16,
    height: 16,
    borderColor: Colors.White,
    borderWidth: 1,
    borderRadius: 8,
    position: 'absolute',
    right: -5,
    top: -2,
    backgroundColor: Colors.RebrandRed,
  },
})

export default styles
