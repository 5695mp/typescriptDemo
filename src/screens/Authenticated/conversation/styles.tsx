import TextStyles from '@components/micro/TextStyles'
import keys, { Colors, Measurement } from '@config/keys'
import { Dimensions, StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  header: {
    width: '100%',
  },
  main: {
    flex: 1,
    backgroundColor: Colors.White,
  },
  content: {
    marginHorizontal: Measurement.AppLevelContentSpacing,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tabContainer: { marginTop: 24, marginBottom: 10 },
  discardButton: { backgroundColor: Colors.Primary, height: 60, borderRadius: 20, borderWidth: 0 },
  backButton: {
    backgroundColor: Colors.Primary10Percent,
    height: 60,
    borderRadius: 20,
    borderWidth: 0,
    marginTop: 16,
  },
  leftHeaderContainer: {},
  headerContainer: {
    paddingTop: 40,
    paddingBottom: 24,
    backgroundColor: Colors.Dark,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    width: '100%',
  },
  pageLabel: {
    ...TextStyles.header,
  },
  body: {
    flex: 1,
  },
  bodyTab: {
    paddingHorizontal: Measurement.AppLevelContentSpacing,
    paddingVertical: 20
  },
  tabInitLayout: {
    width: keys.windowWidth,
  },
  notiActiveTab: {
    marginHorizontal: 0,
  },
  bottomSheetContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 30,
    marginHorizontal: 10,
  },
  unsavedLabel: {
    ...TextStyles.semiRegular,
    color: Colors.SteelGray,
  },
  backLabel: {
    ...TextStyles.medium,
    color: Colors.BlackText,
  },
  firstItemTab: {
    marginLeft: Measurement.AppLevelContentSpacing,
  },
  settingBtn: {
    width: 42,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 42 / 1,
    borderWidth: 1,
    borderColor: Colors.White,
  },
  settingsText: {
    ...TextStyles.mediumTitle,
  },
  subTitle: {
    ...TextStyles.light,
    color: 'white',
  },
  avatarContainer: {
    width: 44,
    height: 44,
  },
  txtTime: {
    ...TextStyles.light,
    color: Colors.Gray3,
    textAlign: 'center',
    fontSize: 15,
    marginTop: 10,
  },
  txtChat: {
    ...TextStyles.light,
    fontSize: 16,
  },
  itemContainer: {
    width: '100%',
  },
  viewText: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 10,
  },
  viewAvatar: {
    justifyContent: 'flex-end',
    marginRight: 10,
  },
  avatarStyle: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  viewChatText: {
    padding: 10,
    marginVertical: 10,
    marginBottom: 0,
    width: '70%',
    borderRadius: 5,
  },
  viewHeader: {
    flexDirection: 'row',
    marginTop: 32,
    paddingHorizontal: Measurement.AppLevelContentSpacing,
    width: Dimensions.get('window').width - Measurement.AppLevelContentSpacing - 15,
  },
  attachFilesButton: {
    padding: 8,
  },
  composerContainer: {
    flex: 1,
  },
  composer: {
    ...TextStyles.inputValue,
    color: Colors.RebrandDark,
    paddingTop: 8.5,
    paddingHorizontal: 12,
    marginLeft: 0,
    flex: 1,
    height: '100%',
  },
  sendButton: {
    justifyContent: 'center',
    paddingLeft: 15,
  },
  sendLabel: {
    ...TextStyles.semiBold,
    fontSize: 16,
    lineHeight: 20,
    color: Colors.Primary,
  },
  viewMedia: {
    alignItems: 'center',
    position: 'absolute',
    right: 0,
    color: Colors.Primary,
  },
  copyButton: {
    width: '100%',
    height: 55,
    borderRadius: 30,
    backgroundColor: Colors.Primary,
  },
  unsendButton: {
    width: '100%',
    height: 55,
    borderRadius: 30,
    backgroundColor: Colors.White,
    marginTop: 20,
    borderWidth: 1,
    borderColor: Colors.Gray
  },
  buttonLabel: {
    marginBottom: 0,
    color: Colors.RebrandDark,
  },
  video: {
    height: 267,
    backgroundColor: Colors.Gray1,
    borderColor: Colors.Gray1,
    borderWidth: 1,
    borderRadius: 8,
  },
  img: {
    flex: 1,
    width: '100%',
    backgroundColor: 'black',
  },
  sendContainer: {
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  projectPill: {
    backgroundColor: Colors.White,
    borderColor: Colors.PrimaryBorder,
    borderWidth: 1,
    marginRight: 60,
  },
  imgMsg: {
    flex: 1,
    backgroundColor: Colors.Dark,
    borderRadius: 8,
    borderColor: Colors.Gray1,
  },
  viewLeft: {
    borderBottomLeftRadius: 8,
    borderTopLeftRadius: 8,
    borderRadius: 8,
    marginBottom: 13,
  },
  viewRight: {
    borderBottomRightRadius: 8,
    borderTopRightRadius: 8,
    borderRadius: 8,
    marginBottom: 13,
  },
  avatar: {
    height: 33,
    width: 33,
    borderRadius: 33 / 2,
  },
  avatarWrapper: {
    height: 35,
    width: 35,
    borderRadius: 35 / 2,
    borderColor: Colors.RebrandDark,
    borderWidth: 1,
    marginBottom: 13,
    backgroundColor: Colors.Primary,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  createDate: {
    ...TextStyles.light,  
    fontSize: 11,
    marginBottom: -5,
    color: Colors.Gray3,
  },
  createDateMine: {
    ...TextStyles.light,
    fontSize: 11,
    color: Colors.White,
    marginBottom: -5,
  },
  userName: {
    ...TextStyles.light,
    color: Colors.Gray3,
    marginBottom: 4,
  },
  iconClose: {
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
    backgroundColor: Colors.Dark,
    borderWidth: 1,
    borderColor: Colors.White,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    margin: 10,
  },
})
