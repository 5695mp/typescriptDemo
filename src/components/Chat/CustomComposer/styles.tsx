import TextStyles from '@components/micro/TextStyles'
import { Colors } from '@config/keys'
import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  composerContainer: {
    flex: 1,
  },
  composer: {
    ...TextStyles.inputValue,
    color: Colors.RebrandDark,
    paddingHorizontal: 12,
    marginLeft: 0,
    flex: 1,
    minHeight: 32,
    textAlignVertical: 'center',
  },
  projectPill: {
    backgroundColor: Colors.White,
    borderColor: Colors.PrimaryBorder,
    borderWidth: 1,
    marginRight: 60,
  },
  text: {
    ...TextStyles.mediumTitle,
    color: Colors.RebrandDark,
  },
  placeholder: {
    ...TextStyles.lightTitle,
    color: Colors.PlaceholderText
  },
  gallery: {
    paddingHorizontal: 12
  },
  loading: {
    position: 'absolute',
    bottom: 0,
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default styles