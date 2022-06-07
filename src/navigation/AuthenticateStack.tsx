/* eslint-disable react/destructuring-assignment */
import React, { useCallback, useRef } from 'react'
import { useSelector } from 'react-redux'
import RBSheet from 'react-native-raw-bottom-sheet'
import { View, StyleSheet, Platform } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { RootState } from '@redux/store'
import UserAvatar from '@components/micro/UserAvatar'
import keys, { AuthScreens, Colors } from '@config/keys'
import CStyles, { FullScreenRBSheetStyles } from '@components/micro/CommonStyles'
import Home from '@screens/Authenticated/home'
import Posts from '@screens/Authenticated/posts'
import Search from '@screens/Authenticated/search/Search'
import NewPost from '@screens/Authenticated/newPost'
import Settings from '@screens/Authenticated/settings'
import MyProfile from '@screens/Authenticated/profile'
import OthersProfile from '@screens/Authenticated/othersProfile'
import PostsByLocation from '@screens/Authenticated/postsByLocation'
import PostsByTrade from '@screens/Authenticated/postsByTrade'
import ProjectDetail from '@screens/Authenticated/projectDetail'
import Projects from '@screens/Authenticated/projects'
import Icon from '@components/icons/Icon'
import ContentSearch from '@screens/Authenticated/contentSearch'
import PublishingPost from '@views/PublishingPost'
import EmployerSettings from '@screens/Authenticated/employerSettings'
import PostsPopular from '@screens/Authenticated/postsPopular'
import { getUserPlaceholderIcon } from '@utils/accountHelpers'
import Notification from '@screens/Authenticated/notification'
import Messages from '@screens/Authenticated/messages'
import Conversation from '@screens/Authenticated/conversation'
import MessageSettings from '@screens/Authenticated/messageSettings'

const Stack = createStackNavigator()
const Tabs = createBottomTabNavigator()
const CreatePlaceholder = () => <View style={{ flex: 1 }} />

const styles = StyleSheet.create({
  avatarContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: 44,
    height: 44,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  avatar: { width: 36, height: 36, borderRadius: 50 },
  plusButton: { ...CStyles.center, width: 50, height: 50, backgroundColor: Colors.Primary, borderRadius: 100 },
  focused: { backgroundColor: Colors.Purple10Percent, width: 50, height: 50, borderRadius: 18, ...CStyles.center },
})

const ProfileStack = (props: any) => {
  return (
    <Stack.Navigator initialRouteName={AuthScreens.ProfileStack} screenOptions={{ headerShown: false }}>
      <Stack.Screen name={AuthScreens.ProfileStack} component={MyProfile} initialParams={props.route?.params} />
      <Stack.Screen name={AuthScreens.ProjectDetail} component={ProjectDetail} />
      <Stack.Screen name={AuthScreens.OthersProfile} component={OthersProfile} />
    </Stack.Navigator>
  )
}

const SearchStack = (props: any) => {
  return (
    <Stack.Navigator initialRouteName={AuthScreens.Search} screenOptions={{ headerShown: false }}>
      <Stack.Screen name={AuthScreens.Search} component={Search} />
      <Stack.Screen name={AuthScreens.OthersProfile} component={OthersProfile} />
      <Stack.Screen name={AuthScreens.ProfileStack} component={MyProfile} initialParams={props.route?.params} />
      <Stack.Screen name={AuthScreens.ContentSearch} component={ContentSearch} />
    </Stack.Navigator>
  )
}

const ProjectsStack = () => {
  return (
    <Stack.Navigator initialRouteName={AuthScreens.ProjectMap} screenOptions={{ headerShown: false }}>
      <Stack.Screen name={AuthScreens.ProjectMap} component={Projects} />
      <Stack.Screen name={AuthScreens.ProjectDetail} component={ProjectDetail} />
    </Stack.Navigator>
  )
}

const HomeStack = () => {
  return (
    <Stack.Navigator initialRouteName={AuthScreens.Activity} screenOptions={{ headerShown: false }}>
      <Stack.Screen name={AuthScreens.Activity} component={Home} />
      <Stack.Screen name={AuthScreens.OthersProfile} component={OthersProfile} />
      <Stack.Screen name={AuthScreens.ProjectDetail} component={ProjectDetail} />
      <Stack.Screen name={AuthScreens.ContentSearch} component={ContentSearch} />
    </Stack.Navigator>
  )
}

const AuthenticateTabStack = () => {
  const newPostRBSheet = useRef<RBSheet>(null)
  const insets = useSafeAreaInsets()
  const loggedInUser = useSelector((state: RootState) => state.auth.user) as User
  const tabBarHidden = useSelector((state: RootState) => state.settings.tabBarHidden)

  const avatar = loggedInUser.profilePicture || ''
  const onCreateNewPost = useCallback(() => {
    newPostRBSheet.current?.close()
  }, [newPostRBSheet])
  return (
    <>
      <Tabs.Navigator
        initialRouteName={AuthScreens.Home}
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarActiveTintColor: Colors.Primary,
          tabBarInactiveTintColor: Colors.Primary60Percent,
          tabBarItemStyle: { paddingTop: Platform.OS === 'ios' ? insets.bottom - 10 : 0 },
          tabBarStyle: {
            position: 'absolute',
            borderRadius: 8,
            paddingHorizontal: 24,
            marginHorizontal: 16,
            marginBottom: 16,
            height: Platform.OS === 'ios' && insets.bottom ? 90 : 80,
            backgroundColor: Colors.RebrandDark,
            // Shadow
            elevation: 5,
            shadowColor: Colors.TabNavShadow,
            shadowOffset: { width: 0, height: -10 },
            shadowRadius: 20,
            shadowOpacity: 1,
            bottom: tabBarHidden ? -4000 : 0,
          },
          tabBarHideOnKeyboard: true,
        }}
      >
        {/* Home */}
        <Tabs.Screen
          options={{
            tabBarIcon: ({ color, focused }) => (
              <View>
                <Icon name='SolidHome' width={24} height={24} fill={focused ? Colors.Primary : Colors.Gray3} />
              </View>
            ),
          }}
          name={AuthScreens.Home}
          component={HomeStack}
        />

        {/* Search */}
        <Tabs.Screen
          name='SearchScreen'
          component={SearchStack}
          options={{
            tabBarIcon: ({ color, focused }) => (
              <View>
                <Icon name='SolidSearch' width={24} height={24} fill={focused ? Colors.Primary : Colors.Gray3} />
              </View>
            ),
          }}
        />

        {/* New Post */}
        <Tabs.Screen
          name='New' // For New Post
          component={CreatePlaceholder}
          options={{
            tabBarIcon: () => (
              <View style={styles.plusButton}>
                <Icon name='RegularPlus' width={24} height={24} fill={Colors.RebrandDark} />
              </View>
            ),
          }}
          listeners={() => ({
            tabPress: (e) => {
              e.preventDefault()
              newPostRBSheet.current?.open()
            },
          })}
        />

        {/* Projects */}
        <Tabs.Screen
          name='Job'
          component={ProjectsStack}
          options={{
            tabBarIcon: ({ color, focused }) => (
              <View>
                <Icon name='SolidToolbox' width={24} height={24} fill={focused ? Colors.Primary : Colors.Gray3} />
              </View>
            ),
          }}
        />

        {/* MyProfile */}
        <Tabs.Screen
          options={() => {
            return {
              tabBarIcon: ({ color, focused }) => {
                return (
                  <View style={[styles.avatarContainer, focused && { borderColor: color }]}>
                    <UserAvatar
                      isNav
                      uri={avatar}
                      customStyles={styles.avatar}
                      placeholderIconName={getUserPlaceholderIcon(loggedInUser.role)}
                    />
                  </View>
                )
              },
            }
          }}
          name={AuthScreens.MyProfile}
          component={ProfileStack}
        />
      </Tabs.Navigator>

      <RBSheet
        ref={newPostRBSheet}
        height={keys.windowHeight}
        closeOnDragDown={false}
        closeOnPressMask={false}
        animationType='slide'
        customStyles={FullScreenRBSheetStyles}
      >
        <NewPost closeSheet={() => newPostRBSheet.current?.close()} onFinish={onCreateNewPost} />
      </RBSheet>
      <PublishingPost />
    </>
  )
}

const AuthenticateStack = () => {
  return (
    <Stack.Navigator initialRouteName={AuthScreens.TabScreens} screenOptions={{ headerShown: false }}>
      <Stack.Screen name={AuthScreens.TabScreens} component={AuthenticateTabStack} />
      {/* List all the screens below in where bottom tab need to be hidden */}
      <Stack.Screen
        name={AuthScreens.EmployerSettings}
        component={EmployerSettings}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen name={AuthScreens.Settings} component={Settings} options={{ gestureEnabled: false }} />
      <Stack.Screen name={AuthScreens.Posts} component={Posts} />
      <Stack.Screen name={AuthScreens.PostsByLocation} component={PostsByLocation} />
      <Stack.Screen name={AuthScreens.PostsByTrade} component={PostsByTrade} />
      <Stack.Screen name={AuthScreens.PostsPopular} component={PostsPopular} />
      <Stack.Screen name={AuthScreens.ContentSearch} component={ContentSearch} />
      <Stack.Screen name={AuthScreens.Notification} component={Notification} />
      <Stack.Screen name={AuthScreens.OthersProfile} component={OthersProfile} />
      <Stack.Screen name={AuthScreens.ProjectDetail} component={ProjectDetail} />
      <Stack.Screen name={AuthScreens.Search} component={Search} options={{ gestureEnabled: false }} />
      {/* <Stack.Screen name={AuthScreens.Messages} component={Messages} /> */}
      {/* <Stack.Screen name={AuthScreens.MessagesSettings} component={MessageSettings} /> */}
      {/* <Stack.Screen name={AuthScreens.Conversation} component={Conversation} /> */}
    </Stack.Navigator>
  )
}

export default AuthenticateStack
