/* eslint-disable no-unused-expressions */
/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable no-async-promise-executor */
import React, { useState, useCallback, useEffect } from 'react'
import axios from 'axios'
import { Asset } from 'expo-asset'
import 'react-native-gesture-handler'
import { Provider } from 'react-redux'
import * as Linking from 'expo-linking'
import * as WebBrowser from 'expo-web-browser'
import Toast from 'react-native-toast-message'
import Amplify, { Auth, Hub } from 'aws-amplify'
import * as SplashScreen from 'expo-splash-screen'
import { loadAsync as loadFontAsync } from 'expo-font'
import { StyleSheet, View, Image, Platform, AppState, AppStateStatus, Dimensions, PixelRatio } from 'react-native'
import { Ionicons, FontAwesome, FontAwesome5 } from '@expo/vector-icons'

import vars, { DeepLinkType } from '@config/vars'
import store from '@redux/store'
import { Fonts, AppEvent, AuthScreens } from '@config/keys'
import storage from '@utils/storage'
import AppLogo from '@assets/icon.png'
import endpoints from '@config/endpoints'
import setupAxios from '@utils/setupAxios'
import awsConfig from '@config/aws-exports'
import toastConfig from '@utils/toastConfig'
import handleError from '@utils/handleError'
import OfflineNotice from '@components/OfflineNotice'
import ErrorBoundary from '@components/ErrorBoundary'
import RootNavigation from '@navigation/RootNavigation'
import { getThumbnailUrl, isEmpty, displayError } from '@utils/helpers'
// import { updateAppConfig } from '@redux/slices/appConfigSlice'
import { setCurrentUser, logoutUser, setTellUsInfo, logoutSocialUser } from '@redux/slices/authSlice'
// import { connectApple } from '@screens/Authenticated/settings/Account'
import { EventRegister } from 'react-native-event-listeners'
import PushNotificationManager from '@utils/PushNotificationManager'
import { registerPushToken } from '@utils/PushNotificationManager/helpers'
import * as _RootNavigation from '@navigation/NavigationRef'
import { resetUserInfo } from '@screens/NonAuthenticated/SignUp/slice'
import jwtDecode from 'jwt-decode'
import { Host } from 'react-native-portalize'
import Constants from 'expo-constants'

// Note: comment this code for development in your local
import Branch from 'expo-branch'
import Spinner from 'react-native-loading-spinner-overlay'

const screenWidth = Dimensions.get('window').width
const screenHeight = Dimensions.get('window').height

const wp = (widthPercent: string) => {
  const elemWidth = typeof widthPercent === 'number' ? widthPercent : parseFloat(widthPercent)
  return PixelRatio.roundToNearestPixel((screenWidth * elemWidth) / 100)
}

const hp = (heightPercent: string) => {
  const elemHeight = typeof heightPercent === 'number' ? heightPercent : parseFloat(heightPercent)

  return PixelRatio.roundToNearestPixel((screenHeight * elemHeight) / 100)
}
async function urlOpener(url: string, redirectUrl: string) {
  if (!redirectUrl && url) {
    return WebBrowser.openAuthSessionAsync(url, Linking.createURL(''))
  }
  const result = await WebBrowser.openAuthSessionAsync(url, redirectUrl)
  const { type, url: newUrl } = result as WebBrowser.WebBrowserRedirectResult

  if (type === 'success') {
    if (Platform.OS === 'ios') {
      WebBrowser.dismissBrowser()
    }
    return Linking.openURL(newUrl)
  }

  return null
}

Amplify.configure({
  ...awsConfig,
  oauth: {
    ...awsConfig.oauth,
    redirectSignIn: Linking.createURL(''),
    redirectSignOut: Linking.createURL(''),
    urlOpener,
  },
})

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  splashWrapper: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#161616' },
})

function cacheImages(images: any[]) {
  return images.map((image: any) => {
    if (typeof image === 'string') return Image.prefetch(image)
    return Asset.fromModule(image).downloadAsync()
  })
}

function cacheFonts(fonts: any) {
  return fonts.map((font: any) => loadFontAsync(font))
}

export default function App() {
  const isMounted = React.useRef(false)
  const [isReady, setIsReady] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(false)
  const [cognitoExpirationTime, setCognitoExpirationTime] = useState(0)

  // Note: comment this code for development in your local
  const initBranch = useCallback(async () => {
    if (Constants.appOwnership === 'standalone') {
      Branch.subscribe(async ({ error, params }) => {
        if (error) {
          Branch.logout()
          return
        }

        if (params['+non_branch_link']) {
          const nonBranchUrl = params['+non_branch_link']
          if (nonBranchUrl) {
            Branch.logout()
            return
          }
          return
        }

        if (!params['+clicked_branch_link']) {
          Branch.logout()
          return
        }
        const loggedInUserId = await storage.getItem(vars.USER_ID)
        if (params.data) {
          const { data } = params
          const { metadata } = params
          if (data?.id && data?.page) {
            storage.setItem(vars.DEEP_LINK_ID, data.id)
            storage.setItem(vars.DEEP_LINK_PAGE, data.page)
            if (metadata) {
              storage.setItem(vars.DEEP_LINK_META_DATA, metadata)
            }
            switch (data?.page) {
              case DeepLinkType.PROFILE_PAGE:
                loggedInUserId === data?.id
                  ? _RootNavigation.navigate(AuthScreens.MyProfile)
                  : _RootNavigation.navigate(AuthScreens.OthersProfile, { userId: data?.id })
                break
              case DeepLinkType.PROJECT_PAGE:
                // Need to discuss
                break
              case DeepLinkType.POST_PAGE:
                _RootNavigation.navigate(AuthScreens.Posts, {
                  focusPostId: data?.id,
                  helperProps: {},
                  shouldAutoOpenPostDetail: true,
                  otherUserData: metadata,
                })
                break
              case DeepLinkType.REVIEW_PAGE:
                _RootNavigation.navigate(AuthScreens.OthersProfile, {
                  userId: metadata?.employeeId,
                  openEmployeeReview: true,
                  reviewId: data.id,
                  employerId: metadata?.employerId,
                })
                EventRegister.emit(AppEvent.LeaveReviewEmployee)
                break
              case DeepLinkType.NOTIFICATION_PAGE:
                _RootNavigation.navigate(AuthScreens.Notification)
                break
              default:
                break
            }
          }
        } else {
          Branch.logout()
        }
      })
    }
  }, [])

  useEffect(() => {
    initBranch()
  }, [])

  const loadAssetsAsync = async () => {
    const imageAssets = cacheImages([AppLogo])
    const fontAssets = cacheFonts([
      Ionicons.font,
      FontAwesome.font,
      FontAwesome5.font,
      {
        /* eslint-disable global-require */ /* eslint-disable import/extensions */
        [Fonts.Regular]: require('@assets/fonts/Poppins-Regular.ttf'),
        [Fonts.Light]: require('@assets/fonts/Paralucent-Light.ttf'),
        [Fonts.ExtraLight]: require('@assets/fonts/Poppins-ExtraLight.ttf'),
        [Fonts.Medium]: require('@assets/fonts/Paralucent-Medium.ttf'),
        [Fonts.SemiBold]: require('@assets/fonts/Poppins-SemiBold.ttf'),
        [Fonts.Bold]: require('@assets/fonts/Poppins-Bold.ttf'),
        [Fonts.DemiBold]: require('@assets/fonts/Paralucent-Demi-Bold.ttf'),
        [Fonts.TextBook]: require('@assets/fonts/Paralucent-Text-Book.ttf'),
      },
    ])

    await Promise.all([...imageAssets, ...fontAssets])
  }

  // This function is getting user info from local storage and token as parameter to send user directly to home screen for performance improvements
  const handleEarlySignIn = async (token: string) => {
    SplashScreen.hideAsync()

    const userInfo = await storage.getItem(vars.USER_INFO)
    const user: User = { ...userInfo, token }
    if (userInfo && token) {
      store.dispatch(setCurrentUser(user))
    }

    setIsReady(true)
  }
  const refreshToken = () => {
    return new Promise(async (res, rej) => {
      try {
        const [cognitoUser, currentSession] = await Promise.all([
          await Auth.currentAuthenticatedUser(),
          await Auth.currentSession(),
        ])
        cognitoUser.refreshSession(currentSession.getRefreshToken(), async (err: any, session: any) => {
          const { idToken } = session
          if (idToken) {
            await handleEarlySignIn(idToken.jwtToken)
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const expirationTimesession = session && session?.idToken && jwtDecode(session.idToken.getJwtToken()).exp
            if (expirationTimesession) {
              setCognitoExpirationTime(expirationTimesession)
            }
            setupAxios(idToken.jwtToken)
            res(idToken.jwtToken)
          } else {
            await Auth.signOut()
            rej('')
          }
        })
      } catch (error) {
        await Auth.signOut()
        rej(error)
      }
    })
  }

  const [appState, setAppState] = useState(AppState.currentState)
  const [oldAppState, setOldAppState] = useState(AppState.currentState)
  const handleStateChange = (newState: AppStateStatus) => {
    if (newState === 'inactive') {
      storage.removeItem('visited')
    }
    setAppState(newState)
  }

  useEffect(() => {
    if (appState !== oldAppState) {
      if (appState === 'active') {
        if (cognitoExpirationTime * 1000 > new Date().getTime()) return
        refreshToken()
      }
      setOldAppState(appState)
    }
  }, [appState, oldAppState])

  useEffect(() => {
    AppState.addEventListener('change', handleStateChange)

    return () => {
      AppState.removeEventListener('change', handleStateChange)
    }
  }, [])

  const loadTellUsData = useCallback(async (userInfo?: ApiResUser) => {
    if (userInfo && !userInfo.onBoarding) {
      let shouldTellUs: TellUsInfo = await storage.getItem(vars.SHOULD_TELL_US_ABOUT_YOU)
      const tags = userInfo.UserTags.map((t) => t.tagName)
      const data = {
        jobTitleId: userInfo.jobTitleId,
        professionalLevel: userInfo.professionalLevel,
        tags,
        about: userInfo.about,
        profilePicture: userInfo.profilePicture,
        location: userInfo.location,
        longitude: userInfo.longitude,
        latitude: userInfo.latitude,
        city: userInfo.city,
        open_to_work: userInfo.open_to_work,
        businessTypeId: userInfo.businessTypeId,
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        addressLine1: userInfo.addressLine1,
        addressLine2: userInfo.addressLine2,
        url: userInfo.url,
        is_hiring: userInfo.is_hiring,
        taxId: userInfo.taxId,
        preferredEmployeeTrades: tags,
        preferredProjectType: userInfo.PreferredProjectTypes.map((t) => `${t.projectType}`),
        projectLocation: userInfo.UserPreferredLocations.map((l) => ({
          location: l.Location.name,
          latitude: l.Location.latitude,
          longitude: l.Location.longitude,
          city: l.Location.name,
        })),
      }
      shouldTellUs = shouldTellUs
        ? {
            ...data,
            ...shouldTellUs,
          }
        : data
      store.dispatch(setTellUsInfo(shouldTellUs))
    }
  }, [])

  const updateAuthState = async () => {
    try {
      setCheckingAuth(true)
      const token = await refreshToken()
      console.log('new token ==>', token)
      let userInfo: ApiResUser | undefined
      try {
        const userInfoReq = await axios.get(endpoints.LoggedInUser)
        userInfo = userInfoReq.data?.data || {}
        await Promise.all([
          await storage.setItem(vars.USER_INFO, userInfo),
          await storage.setItem(vars.USER_ID, userInfo?.id),
        ])
      } catch (error) {
        console.log('updateAuthState error: ', error)
      }
      if (isEmpty(userInfo)) {
        userInfo = await storage.getItem(vars.USER_INFO)
      }

      try {
        await Promise.allSettled([
          await loadTellUsData(userInfo),
          userInfo?.profilePicture
            ? await Image.prefetch(getThumbnailUrl(userInfo.profilePicture)).catch((error) => console.log('err', error))
            : null,
          userInfo?.onBoarding ? await registerPushToken() : null,
        ])
      } catch (error) {
        console.log('loadTellUs error: ', error)
      }

      if (userInfo) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const user: User = { ...userInfo, token }
        console.log('updateAuthState', user)
        store.dispatch(setCurrentUser(user))
      }
    } catch (error) {
      await Auth.signOut()
      handleError(error)
    } finally {
      isMounted.current && setCheckingAuth(false)
    }
  }

  const handleAuthCustomState = async (data: any) => {
    try {
      if (!data) return
      const customState = JSON.parse(data)
      const { type } = customState || {}

      if (type === vars.AppleConnect) {
        // await connectApple()
      }
    } catch (error) {
      console.info(error)
    }
  }

  const onSignIn = useCallback(async () => {
    await updateAuthState()
  }, [])

  const onFirstTimeCheckAuth = useCallback(async () => {
    const doneSignUp = await storage.getItem(vars.DONE_SIGN_UP)
    if (!doneSignUp) {
      await Auth.signOut()
      store.dispatch(logoutUser())
      store.dispatch(resetUserInfo())
    } else {
      await updateAuthState()
    }
  }, [])

  const bootstrapApp = async () => {
    try {
      await SplashScreen.preventAutoHideAsync()
      await loadAssetsAsync()
      // Artificially delay to experience SplashScreen
      // await sleep(1000)
      await onFirstTimeCheckAuth()
    } catch (e) {
      console.warn(e)
    } finally {
      setTimeout(() => {
        // Fix issue update reducer after state
        setIsReady(true)
      }, 500)
    }
  }

  React.useEffect(() => {
    bootstrapApp()
    isMounted.current = true
    Hub.listen('auth', ({ payload: { event, data } }) => {
      // console.info('\n\nAmplify Hub Capsule:', { event, data })
      switch (event) {
        case 'signIn': {
          // const { runningAppleConnect } = store.getState().appConfig
          // if (runningAppleConnect) {
          //   // It's a hack way to manage Apple connect in Expo
          //   // To stop updating redux auth state and axios header token
          //   store.dispatch(updateAppConfig({ runningAppleConnect: false }))
          //   return
          // }
          onSignIn()
          break
        }
        case 'signOut':
          store.dispatch(logoutSocialUser())
          break
        case 'signIn_failure':
        case 'cognitoHostedUI_failure':
          console.log(`Login Failed: ${data}`)
          if (`${data}` === 'Error: User+is+not+enabled') {
            EventRegister.emit(AppEvent.ReactivateAccount)
          } else if (`${data}`.includes('Error: ')) {
            const errorMessage = `${data}`.split(': ')[1]
            if (errorMessage) {
              displayError(errorMessage.split('+').join(' '))
            }
          }
          // Alert.alert('Login Failed', 'Sorry, something went wrong!')
          break
        case 'customOAuthState':
          handleAuthCustomState(data)
          break
        default:
          break
      }
    })
    return () => {
      isMounted.current = false
    }
  }, [])

  const onLayoutRootView = React.useCallback(async () => {
    if (isReady) {
      setTimeout(async () => {
        await SplashScreen.hideAsync()
      }, 500)
    }
  }, [isReady])

  if (!isReady)
    return (
      <View style={styles.splashWrapper}>
        <Image source={require('./assets/icons/logo-white.png')} style={{ width: wp(45) }} resizeMode='contain' />
        {/* <LottieView source={require('./assets/lottie/loader.json')} autoPlay loop style={{ width: 100, height: 100 }} /> */}
      </View>
    )

  return (
    <ErrorBoundary>
      <Provider store={store}>
        <View style={styles.wrapper} onLayout={onLayoutRootView}>
          <Spinner visible={checkingAuth} />
          <OfflineNotice />
          <Host>
            <RootNavigation />
          </Host>
        </View>
        <Toast config={toastConfig} ref={(ref) => Toast.setRef(ref)} />
        <PushNotificationManager />
        {/* <ConversationManager /> */}
      </Provider>
    </ErrorBoundary>
  )
}
