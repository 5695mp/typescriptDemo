import TextStyles from '@components/micro/TextStyles'
import keys, { Colors, Measurement } from '@config/keys'
import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: Colors.White,
  },
  activityIndicator: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    width: '100%'
  },
  sortBtn: {
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.RebrandDark,
    borderRadius: 22,
    flexDirection: 'row',
    marginTop: 24,
    marginBottom: 24,
  },
  sortBtnText: {
    ...TextStyles.medium,
    fontSize: 16,
    color: Colors.RebrandDark,
    marginLeft: 4,
  },
  flatList: {
    paddingTop: 10
  }
})

export default styles
