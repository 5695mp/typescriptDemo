/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useMemo } from 'react'
import { Dimensions, Image, ImageBackground, Pressable, Text, TouchableOpacity, View } from 'react-native'
import { TouchableOpacity as Touchable } from 'react-native-gesture-handler'

import AppStatusBar from '@components/AppStatusBar'
import Icon from '@components/icons/Icon'
import LogoIcon from '@components/icons/Logo'
import BackButton from '@components/micro/BackButton'
import { ChatNotificationKeys, Colors, MessageType, MaxChatAttachedFiles } from '@config/keys'
import { FontAwesome5 } from '@expo/vector-icons'
import { useLocalized } from '@utils/helpers'
import { GiftedChat, Bubble } from 'react-native-gifted-chat'
import RBSheet from 'react-native-raw-bottom-sheet'
import { ImageCustomRBSheetModelStyles, SecondaryCustomRBSheetModelStyles } from '@components/micro/CommonStyles'
import Button from '@components/micro/Button'
import TextStyles from '@components/micro/TextStyles'
import { Video } from 'expo-av'
import SharedPostMessage from '@views/SharedPostMessage'
import SharedProjectMessage from '@views/SharedProjectMessage'
import useKeyboard from '@utils/useKeyboard'
import ImageView from '@components/micro/ImageView'
import moment from 'moment'
import ChatNotification from './ChatNotification'
import ConversationHeader from './Headers/ConversationHeader'
import { renderInputToolbar, renderComposer, renderSend } from './InputToolbar'
import { styles } from './styles'
import useConversationFacade, { ActionType } from './hook'

const Conversation = (props: any) => {
  const {
    onGoBack,
    onGoToSettings,
    messages,
    loading,
    project,
    messageText,
    sendingMessage,
    onSend,
    onSelectFiles,
    selectedPhotos,
    disableScroll,
    loggedInUser,
    onRemovePhoto,
    RBSheetRef,
    onCopyMessage,
    onUnsendMessage,
    onLongPress,
    onCloseOptions,
    currentMesssage,
    item,
    item: conversationItem,
    actionType,
    onLongPressMedia,
    RBSheetImage,
    onImagePress,
    cachedTemporaryMediaUrl,
    setCachedTemporaryMediaUrl,
    onRemoveProjectLink,
    onTextChanged,
    isSharedPost,
    getIdFromMessage,
    isSharedProject,
    onDownLoad,
    isMediaMsg,
    downloading,
    onCloseImageDetail,
    onAvatarPress,
    newMembersCount,
  } = useConversationFacade(props)
  const { t } = useLocalized()

  const otherMembers = useMemo(() => {
    return item.members.filter((member: any) => member?.User?.cognitoUserId !== loggedInUser.cognitoUserId)
  }, [item.members, loggedInUser])

  const deletedMembers = otherMembers?.filter((member: any) => !member?.User)
  const isChatWithDeleted = deletedMembers.length === otherMembers.length

  const { keyboardIsShowing, keyboardHeight } = useKeyboard()

  return (
    <>
      <View style={styles.main}>
        <AppStatusBar color={Colors.Dark} />
        <View style={styles.header}>
          <View style={styles.headerContainer}>
            <View style={styles.content}>
              <View style={styles.leftHeaderContainer}>
                <BackButton disabled={loading} onPress={onGoBack} />
              </View>
              <LogoIcon />
              <TouchableOpacity onPress={onGoToSettings} style={styles.settingBtn}>
                <FontAwesome5 name='cog' size={16} color={Colors.Primary} />
              </TouchableOpacity>
            </View>

            <View style={styles.viewHeader}>
              <ConversationHeader
                onGoToSettings={onGoToSettings}
                members={item.members}
                item={item}
                newMembersCount={newMembersCount}
              />
            </View>
          </View>
        </View>
        <View style={styles.body}>
          <View style={[styles.body, styles.bodyTab]}>
            <GiftedChat
              renderTime={(props) => {
                const createdAt = props.currentMessage?.createdAt
                const calTime = moment().diff(moment(createdAt), 'minutes')
                const isMine = item.members.find(
                  (member: any) =>
                    member.conversationMemberSid === props.currentMessage?.user._id &&
                    member.User.cognitoUserId === loggedInUser.cognitoUserId
                )
                const hasImageOrVideo = props.currentMessage?.image || props.currentMessage?.video
                if (calTime > 60) {
                  return (
                    <Text style={isMine && !hasImageOrVideo ? styles.createDateMine : styles.createDate}>
                      {/* {moment(createdAt).format('MMM DD, h:mma')} */}
                    </Text>
                  )
                }
                return <View />
              }}
              renderSystemMessage={(props) => <ChatNotification message={props.currentMessage?.text} />}
              alwaysShowSend
              inverted={false}
              messages={messages}
              placeholder='Type message here'
              renderInputToolbar={(props) => renderInputToolbar({ props, keyboardIsShowing, keyboardHeight })}
              renderComposer={(props) =>
                renderComposer({
                  props,
                  selectedPhotos,
                  onRemovePhoto,
                  disableScroll,
                  project,
                  onRemoveProjectLink,
                  text: messageText,
                  onTextChanged,
                  disabled: isChatWithDeleted || sendingMessage,
                  sending: sendingMessage,
                })
              }
              renderSend={(props) =>
                renderSend({
                  props,
                  onSelectFiles,
                  maxFiles: MaxChatAttachedFiles - selectedPhotos.length,
                  canSend: selectedPhotos.length > 0 || !!project || messageText?.trim().length > 0,
                  onSend,
                  disabled: isChatWithDeleted || sendingMessage,
                })
              }
              isLoadingEarlier={loading}
              user={{
                _id: loggedInUser.cognitoUserId,
              }}
              onLongPress={onLongPress}
              renderAvatar={(props) => {
                return (
                  <Touchable
                    onPress={() => onAvatarPress(props.currentMessage?.user?._id)}
                    style={styles.avatarWrapper}
                  >
                    <ImageView
                      uri={props.currentMessage?.user?.avatar as string}
                      imageStyles={styles.avatar}
                      placeholder={<Icon name='SolidUserHardHat' height={16} width={16} fill={Colors.RebrandDark} />}
                    />
                  </Touchable>
                )
              }}
              renderBubble={(props) => {
                if (isSharedPost(props.currentMessage!)) {
                  return (
                    <SharedPostMessage postId={getIdFromMessage(props.currentMessage!, ChatNotificationKeys.Post)} />
                  )
                }
                if (isSharedProject(props.currentMessage!)) {
                  return (
                    <SharedProjectMessage
                      projectId={getIdFromMessage(props.currentMessage!, ChatNotificationKeys.Project)}
                    />
                  )
                }
                const { currentMessage, previousMessage } = props
                const currentMessageUserId = currentMessage?.user?._id
                const previousMessageUserId = previousMessage?.user?._id
                const mySid = loggedInUser.cognitoUserId
                return (
                  <View>
                    {currentMessageUserId !== previousMessageUserId &&
                      currentMessageUserId !== mySid &&
                      previousMessageUserId !== mySid &&
                      otherMembers?.length > 1 && <Text style={styles.userName}>{currentMessage?.user?.name}</Text>}
                    <Bubble
                      //  containerStyle={messageStyles}
                      wrapperStyle={{
                        left: [
                          {
                            backgroundColor:
                              props.currentMessage && isMediaMsg(props.currentMessage) ? 'transparent' : Colors.Gray,
                          },
                          styles.viewLeft,
                          props.currentMessage?.text
                            ? {
                                padding: 8,
                                maxWidth: '80%',
                              }
                            : {},
                        ],
                        right: [
                          {
                            backgroundColor:
                              props.currentMessage && isMediaMsg(props.currentMessage) ? 'transparent' : Colors.Dark,
                          },
                          styles.viewRight,
                          props.currentMessage?.text ? { padding: 8 } : {},
                        ],
                      }}
                      {...props}
                      renderMessageVideo={() => {
                        return (
                          <Pressable
                            onLongPress={() => {
                              props.currentMessage && onLongPressMedia(props.currentMessage)
                            }}
                          >
                            <Video
                              source={{
                                uri: props.currentMessage?.video || '',
                              }}
                              useNativeControls
                              resizeMode='cover'
                              isLooping
                              style={[
                                styles.video,
                                { backgroundColor: 'black', width: Dimensions.get('window').width - 140 },
                              ]}
                            />
                          </Pressable>
                        )
                      }}
                      renderMessageImage={() => {
                        return (
                          <TouchableOpacity
                            style={[styles.video, { width: Dimensions.get('window').width - 140 }]}
                            onPress={() => {
                              props.currentMessage && onImagePress(props.currentMessage)
                            }}
                            onLongPress={() => {
                              props.currentMessage && onLongPressMedia(props.currentMessage)
                            }}
                          >
                            <Image
                              resizeMode='cover'
                              source={{ uri: props.currentMessage?.image }}
                              style={styles.imgMsg}
                            />
                          </TouchableOpacity>
                        )
                      }}
                      renderMessageText={() => {
                        const isMine = loggedInUser.cognitoUserId !== props.currentMessage?.user._id
                        return (
                          <Text style={[styles.txtChat, { color: isMine ? Colors.Dark : Colors.White }]}>
                            {props.currentMessage?.text}
                          </Text>
                        )
                      }}
                    />
                  </View>
                )
              }}
            />
            <RBSheet
              ref={RBSheetRef}
              height={
                actionType !== ActionType.image && currentMesssage?.user._id === loggedInUser.cognitoUserId ? 180 : 90
              }
              closeOnDragDown
              closeOnPressMask
              animationType='fade'
              customStyles={SecondaryCustomRBSheetModelStyles}
            >
              <Button
                disabled={downloading}
                loading={downloading}
                loaderColor={Colors.Dark}
                onPress={actionType === ActionType.copy ? onCopyMessage : onDownLoad}
                customStyles={styles.copyButton}
                icon={
                  <Icon
                    name={actionType === ActionType.copy ? 'SolidCopy' : 'SolidArrowDown'}
                    height={16}
                    fill={Colors.Dark}
                  />
                }
              >
                <Text style={[TextStyles.mediumTitle, styles.buttonLabel]}>
                  {/* eslint-disable-next-line no-nested-ternary */}
                  {actionType === ActionType.copy
                    ? t('conversation.copy')
                    : actionType === ActionType.image
                    ? 'Download Image'
                    : 'Download Video'}
                </Text>
              </Button>
              {actionType !== ActionType.image && currentMesssage?.user._id === loggedInUser.cognitoUserId && (
                <Button
                  onPress={onUnsendMessage}
                  customStyles={styles.unsendButton}
                  icon={<Icon name='SolidTrash' height={16} fill={Colors.Primary} />}
                >
                  <Text style={[TextStyles.mediumTitle, styles.buttonLabel]}>{t('conversation.unsend')}</Text>
                </Button>
              )}
            </RBSheet>
            <RBSheet
              onClose={() => setCachedTemporaryMediaUrl('')}
              ref={RBSheetImage}
              height={Dimensions.get('window').height - 100}
              closeOnDragDown
              closeOnPressMask
              animationType='fade'
              customStyles={ImageCustomRBSheetModelStyles}
            >
              <ImageBackground resizeMode='stretch' source={{ uri: cachedTemporaryMediaUrl }} style={styles.img}>
                <TouchableOpacity onPress={onCloseImageDetail} activeOpacity={0.75} style={styles.iconClose}>
                  <Icon name='RegularTimes' width={20} height={20} fill={Colors.White} />
                </TouchableOpacity>
              </ImageBackground>
            </RBSheet>
          </View>
        </View>
      </View>
    </>
  )
}

export default Conversation
