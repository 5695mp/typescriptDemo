import TextStyles from '@components/micro/TextStyles'
import keys, { Colors, Measurement } from '@config/keys'
import { Dimensions, StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  pContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 10,
  },
  title: {
    ...TextStyles.demiBold,
    fontSize: 24,
    lineHeight: 30,
    color: Colors.RebrandDark,
  },
  subContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  deletedUser: {
    ...TextStyles.semiBold,
    color: Colors.White,
  },
  subtitle: {
    ...TextStyles.light,
    color: Colors.White,
  },
  active: {
    backgroundColor: Colors.RebrandSuccess,
    width: 10,
    height: 10,
    borderRadius: 10 / 2,
    marginRight: 4,
  },
  seekerInfo: {
    marginLeft: 12,
    justifyContent: 'center',
  },
  image: {
    height: 44,
    width: 44,
    borderRadius: 44 / 2,
    borderColor: Colors.White,
    borderWidth: 1,
    backgroundColor: Colors.Primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  groupImage: {
    height: 35,
    width: 35,
    borderRadius: 35 / 2,
    borderColor: Colors.White,
    borderWidth: 1,
    backgroundColor: Colors.Primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageWrapper: {
    height: 45,
    width: 45,
    borderRadius: 45 / 2,
  },
  groupImageWrapper: {
    height: 44,
    width: 44,
    borderRadius: 44 / 2,
  },
  firstImage: {
    height: 35,
    width: 35,
    borderRadius: 35 / 2,
    borderColor: Colors.White,
    borderWidth: 1,
    backgroundColor: Colors.Primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondImage: {
    height: 35,
    width: 35,
    borderRadius: 35 / 2,
    borderColor: Colors.White,
    borderWidth: 1,
    backgroundColor: Colors.Primary,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 10,
    left: 9,
  },
  members: {
    marginLeft: 20,
  },
  membersName: { ...TextStyles.semiBold, color: Colors.White },
  membersCount: { marginTop: 5, ...TextStyles.light, color: Colors.White },
})

export default styles
