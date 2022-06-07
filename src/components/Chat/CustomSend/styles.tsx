import TextStyles from '@components/micro/TextStyles'
import { Colors } from '@config/keys'
import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  sendButton: {
    justifyContent: 'center',
    paddingLeft: 15
  },
  sendLabel: {
    ...TextStyles.semiBold,
    fontSize: 16,
    lineHeight: 20,
    color: Colors.Primary
  },
  sendContainer: {
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10
  },
})

export default styles