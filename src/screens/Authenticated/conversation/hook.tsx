import { MediaInfo } from '@components/input/MediaPicker/helpers'
import { AppName, AuthScreens, ChatNotificationKeys, MessageType, Role, AppEvent } from '@config/keys'
import { useNavigation } from '@react-navigation/core'
import { RootState } from '@redux/store'
import { Conversation, Message, Participant } from '@twilio/conversations'
import { getAccountName } from '@utils/accountHelpers'
import ConversationProvider from '@utils/ConversationManager/ConversationProvider'
import handleError from '@utils/handleError'
import { useLocalized } from '@utils/helpers'
import * as Clipboard from 'expo-clipboard'
import * as FileSystem from 'expo-file-system'
import * as MediaLibrary from 'expo-media-library'
import { useCallback, useEffect, useRef, useState, useMemo } from 'react'
import { Platform } from 'react-native'
import { EventRegister } from 'react-native-event-listeners'
import { IMessage } from 'react-native-gifted-chat'
import RBSheet from 'react-native-raw-bottom-sheet'
import Toast from 'react-native-toast-message'
import { useSelector } from 'react-redux'
import { getMediaData } from './helpers'
import * as _ from 'lodash'
import { getChatNotificationKey, isNotification } from './ChatNotification/helpers'

const MESSAGE_SIZE = 30

export enum ActionType {
  copy = 'copy',
  image = 'image',
  video = 'video',
}

const useConversationFacade = (props: any) => {
  const { route } = props
  const navigation = useNavigation()
  const { t } = useLocalized()
  const loggedInUser = useSelector((state: RootState) => state.auth.user) as User
  const isSeeker = loggedInUser.role === Role.JobSeeker
  const conversationEvent = useRef<Conversation>()
  const { item, conversationSid, cognitoUserIds, projectInfo, refresh, newMembersCount } = route.params || {}
  const [messages, setMessages] = useState<Message[]>([])
  const [canLoadMore, setCanLoadMore] = useState(false)
  const [loading, setLoading] = useState(false)
  const [project, setProject] = useState<Project | undefined>(projectInfo)
  const [actionType, setActionType] = useState<ActionType>(ActionType.copy)
  const RBSheetRef = useRef<RBSheet>(null)
  const [sendingMessage, setSendingMessage] = useState(false)

  const RBSheetImage = useRef<RBSheet>(null)
  const [currentMesssage, setCurrentMessage] = useState<IMessage>()
  const [selectedPhotos, setSelectedPhotos] = useState<MediaInfo[]>([])
  const [disableScroll, setDisableScroll] = useState(false)
  const [iMessages, setIMessage] = useState<IMessage[]>([])
  const [cachedTemporaryMediaUrl, setCachedTemporaryMediaUrl] = useState('')
  const [messageText, setMessageText] = useState('')
  const [downloading, setDownloading] = useState(false)

  const members = useMemo(() => {
    if (!item || !item.members) return {}
    const list: ChatMember[] = item.members
    return _.keyBy(list, 'User.cognitoUserId')
  }, [item])

  const onUpdateIMessages = useCallback(async () => {
    const _messages: IMessage[] = []
    for (const item of messages) {
      const media = await getMediaData(item)
      const participant = (await item.getParticipant())?.identity
      const userInfo = members[participant]

      let messageKey = getChatNotificationKey(item?.body)
      const isNoti = isNotification(messageKey)

      _messages.push({
        _id: item.sid,
        text: item.body,
        createdAt: item.dateCreated,
        user: {
          _id: participant,
          name: getAccountName(userInfo?.User),
          avatar: userInfo?.User?.profilePicture,
        },
        ...media,
        system: isNoti
        // system?: boolean;
        // sent?: boolean;
        // received?: boolean;
        // pending?: boolean;
        // quickReplies?: QuickReplies;
      })
    }
    setIMessage(_messages)
  }, [messages, members])

  useEffect(() => {
    onUpdateIMessages()
  }, [messages])

  const onGoBack = useCallback(async () => {
    ConversationProvider.unlistenConversationEvent()
    if (conversationEvent.current) {
      if (messages.length == 0) {
        //Server will not return empty conversation => don't delete conversation
        // await conversationEvent.current.delete()
      }
    }
    navigation.goBack()
  }, [messages, conversationEvent.current])



  const loadMessages = useCallback(async () => {
    if (!conversationEvent.current) return
    try {
      const paginator = await conversationEvent.current.getMessages(MESSAGE_SIZE)
      if (paginator.hasPrevPage) {
        setCanLoadMore(true)
      }
      setMessages([...messages, ...paginator.items])
    } catch (error) {
      console.log('loadMessages error', error)
    }
  }, [messages, conversationEvent.current])

  const onUpdateMessageList = useCallback(
    (message: Message, isAdding: boolean) => {
      if (isAdding) {
        setMessages([...messages, message])
        conversationEvent.current?.updateLastReadMessageIndex(message.index)
      } else {
        setMessages(messages.filter((m) => m.sid != message.sid))
      }
    },
    [messages]
  )

  const updateMessageListRef = useRef(onUpdateMessageList)

  useEffect(() => {
    updateMessageListRef.current = onUpdateMessageList
  }, [onUpdateMessageList])

  useEffect(() => {
    const addMessageEvent = EventRegister.addEventListener(AppEvent.ConversationAddedMessage, ({ message }) => {
      updateMessageListRef.current(message, true)
    })

    const removeMessageEvent = EventRegister.addEventListener(AppEvent.ConversationRemovedMessage, ({ message }) => {
      updateMessageListRef.current(message, false)
    })

    return () => {
      EventRegister.removeEventListener(`${addMessageEvent}`)
      EventRegister.removeEventListener(`${removeMessageEvent}`)
    }

  }, [])

  const onStartConversation = useCallback(async () => {
    setLoading(true)
    //Create conversation from "New" button, other's profile or project detail
    if (cognitoUserIds) {
      conversationEvent.current = await ConversationProvider.startConversation(loggedInUser, cognitoUserIds)
    } else if (conversationSid) {
      // Click on conversation at conversation list
      conversationEvent.current = await ConversationProvider.loadConversation(loggedInUser, conversationSid)
    }
    if (conversationEvent.current) {
      await loadMessages()
      conversationEvent.current.updateLastReadMessageIndex(conversationEvent.current.lastReadMessageIndex)
      // const participant = await conversationEvent.current.getParticipantByIdentity(loggedInUser.cognitoUserId)
      // setMyParticipantInfo(participant)
    }
    setLoading(false)
  }, [loadMessages, cognitoUserIds, conversationSid, loggedInUser])

  const onSend = useCallback(async () => {
    try {
      if (!conversationEvent.current) return
      setSendingMessage(true)
      const messages = messageText ? [messageText] : []
      if (project) {
        messages.unshift(`${ChatNotificationKeys.Project}${project.id}`)
      }
      //Remove deleted members
      const members = (item.members as ChatMember[]).filter(m => m.User != null)
      await ConversationProvider.sendMessageAndAttachedFiles(
        loggedInUser,
        conversationEvent.current,
        members.map((m) => m.User.cognitoUserId),
        messages,
        selectedPhotos
      )
      setMessageText('')
      setSelectedPhotos([])
      setProject(undefined)
      setSendingMessage(false)
    } catch (error) {
      console.log('onSend', error)
      setSendingMessage(false)
    }
  }, [selectedPhotos, project, messageText, loggedInUser])

  const onOpenOptions = (type: ActionType = ActionType.copy) => {
    setActionType(type)
    setTimeout(() => {
      RBSheetRef.current?.open()
    }, 200)
  }

  const onCloseOptions = () => {
    RBSheetRef.current?.close()
  }

  const onCopyMessage = () => {
    RBSheetRef.current?.close()
    Clipboard.setString(currentMesssage?.text || '')
    Toast.show({ type: 'saved', text1: t('conversation.copySuccess') })
  }

  const onUnsendMessage = async () => {
    try {
      const message = messages.find((message) => message.sid == currentMesssage?._id)
      await message?.remove()
      setCurrentMessage(undefined)
      RBSheetRef.current?.close()
      Toast.show({ type: 'saved', text1: t('conversation.messageUnsent') })
    } catch (error) {
      RBSheetRef.current?.close()
      Toast.show({ type: 'error', text1: t('conversation.unsendFail') })
    }
  }

  const onLongPress = (context: any, message: IMessage) => {
    setCurrentMessage(message)
    onOpenOptions(ActionType.copy)
  }

  useEffect(() => {
    onStartConversation()
  }, [])

  const onSelectFiles = useCallback(
    (files: MediaInfo[]) => {
      setSelectedPhotos([...selectedPhotos, ...files])
    },
    [selectedPhotos]
  )

  const onRemovePhoto = useCallback((item: MediaInfo) => {
    setSelectedPhotos((preValue) => [...preValue].filter((i) => i.id != item.id))
  }, [])

  const onGoToSettings = useCallback(() => {
    const _conversationSid = conversationSid || conversationEvent.current?.sid
    if (!_conversationSid) return
    navigation.navigate(AuthScreens.MessagesSettings, {
      item,
      conversationSid: _conversationSid,
      refresh
    })
  }, [conversationSid, conversationEvent.current])

  const onLongPressMedia = (currentMsg: IMessage) => {
    setCurrentMessage(currentMsg)
    onOpenOptions(currentMsg.image ? ActionType.image : ActionType.video)
  }

  const isSharedPost = (currentMsg: IMessage) => {
    if (currentMsg.text) {
      return currentMsg.text.includes(ChatNotificationKeys.Post)
    }
  }

  const isSharedProject = (currentMsg: IMessage) => {
    if (currentMsg.text) {
      return currentMsg.text.includes(ChatNotificationKeys.Project)
    }
  }

  const isMediaMsg = (currentMsg: IMessage) => {
    return currentMsg.video || currentMsg?.image ? true : false
  }

  const getIdFromMessage = (currentMsg: IMessage, type: MessageType) => {
    const postId = currentMsg?.text.replace(type, '')
    return parseInt(postId)
  }

  const getInfoFromUser = (memberSid: any) => {
    console.log(item.members)
    return item.members?.find((member: any) => member?.conversationMemberSid === memberSid)
  }

  const onImagePress = async (currentMessage: IMessage) => {
    try {
      const message = messages.find((message) => message.sid === currentMessage?._id)
      const uri = await message?.media.getCachedTemporaryUrl()
      setCachedTemporaryMediaUrl(uri || '')
      RBSheetImage.current?.open()
    } catch (error) {
      handleError(error)
    }
  }

  const onRemoveProjectLink = useCallback(() => {
    setProject(undefined)
  }, [])

  const saveFile = async (fileUri: string) => {
    const { status, accessPrivileges } = await MediaLibrary.requestPermissionsAsync()
    if (status === 'granted') {
      const cachedAsset = await MediaLibrary.createAssetAsync(fileUri)
      if (Platform.OS === 'android' || accessPrivileges === 'all') {
        const albumName = 'Laber'
        const album = await MediaLibrary.getAlbumAsync(albumName)

        if (album) {
          await MediaLibrary.addAssetsToAlbumAsync([cachedAsset], album, false)
        } else {
          const asset = await MediaLibrary.createAssetAsync(fileUri)
          await MediaLibrary.createAlbumAsync(albumName, asset)
        }
      }
    } else {
      throw {
        response:{
          data:{
            message:'Please grant the Window app access to your gallery/camera to download files.',
            type: 'permission'
          }
        }
      }
    }
  }

  const onDownLoad = async () => {
    try {
      setDownloading(true)
      const message = messages.find((message) => message.sid === currentMesssage?._id)
      const media = await message?.media.getCachedTemporaryUrl()
      const localFile = await FileSystem.downloadAsync(
        media || '',
        FileSystem.documentDirectory + (message?.media.filename || '')
      )
      await saveFile(localFile.uri)
      onCloseOptions()
      setDownloading(false)
      Toast.show({ type: 'success', text1: 'Download successfully' })
    } catch (error: any) {
      setDownloading(false)
      onCloseOptions()
      if(error?.response?.data?.type==='permission'){
        handleError(error,true,'',true)
      } else{
        handleError(error)
      }
    }
  }

  const onCloseImageDetail = () => {
    RBSheetImage.current?.close()
  }

  const onAvatarPress = (id: any) => {
    const info = item?.members?.find((member: any) => member?.User?.cognitoUserId === id)
    if(info){
      return navigation.navigate(AuthScreens.OthersProfile, {userId: info.User?.id})
    }
    return
  }

  return {
    onGoBack,
    onGoToSettings,
    sendingMessage,
    canLoadMore,
    isSeeker,
    item,
    project,
    messages: iMessages,
    loading,
    loggedInUser,
    messageText,
    onSend,
    onSelectFiles,
    selectedPhotos,
    disableScroll,
    setDisableScroll,
    onRemovePhoto,
    onCloseOptions,
    onCopyMessage,
    onUnsendMessage,
    onLongPress,
    RBSheetRef,
    currentMesssage,
    setCurrentMessage,
    actionType,
    onLongPressMedia,
    RBSheetImage,
    onImagePress,
    cachedTemporaryMediaUrl,
    setCachedTemporaryMediaUrl,
    onRemoveProjectLink,
    onTextChanged: setMessageText,
    isSharedPost,
    getIdFromMessage,
    isSharedProject,
    onDownLoad,
    isMediaMsg,
    downloading,
    onCloseImageDetail,
    onAvatarPress,
    newMembersCount
  }
}

export default useConversationFacade
