import { Colors } from '@config/keys'
import { StyleSheet } from 'react-native'
import TextStyles from '@components/micro/TextStyles'

const ButtonStyles = StyleSheet.create({
  normal: {
    height: 60,
    borderRadius: 30,
  },
  small: {
    height: 44,
    borderRadius: 22,
  },
  highlight: {
    backgroundColor: Colors.Dark,
    borderWidth: 0,
  },
  highlightLabel: {
    ...TextStyles.mediumTitle,
  },
  secondary: {
    backgroundColor: Colors.WhiteShadow,
    borderWidth: 1,
    borderColor: Colors.Dark,
  },
  secondaryLabel: {
    ...TextStyles.lightTitle,
  },
  suggest: {
    backgroundColor: Colors.DisableBackground,
  },
  suggestLabel: {
    ...TextStyles.mediumTitle,
    color: Colors.RebrandDark,
  },
  disable: {
    borderWidth: 0,
    opacity: 1,
    backgroundColor: Colors.DisableBackground,
  },
  disableLabel: {
    ...TextStyles.medium,
    color: Colors.PlaceholderText,
  },
  active: {
    borderWidth: 0,
    backgroundColor: Colors.Primary,
  },
  activeLabel: {
    ...TextStyles.medium,
    color: Colors.RebrandDark,
  },
  border: {
    backgroundColor: Colors.RebrandDark,
    borderWidth: 1,
    borderColor: Colors.White,
  },
  borderLabel: {
    ...TextStyles.title,
    color: Colors.White,
  },
})

export default ButtonStyles
