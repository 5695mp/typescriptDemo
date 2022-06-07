import React, { ReactNode, useMemo } from 'react'
import { View, Text, TextStyle, ViewStyle } from 'react-native'
import styles from './styles'
import { useLocalized } from '@utils/helpers'
import { ChatNotificationKeys } from '@config/keys'
import InChatNoti from '../InChatNotification/Common'
import { getChatNotificationKey } from './helpers'

interface CProps {
  message?: string
  textStyles?: TextStyle
  numberOfLines?: number
  inChatContainerStyle?: ViewStyle
}

const ChatNotification = ({ message, textStyles, numberOfLines, inChatContainerStyle }: CProps) => {
  const { t } = useLocalized()

  const key = useMemo(() => {
    let messageKey = getChatNotificationKey(message)
    return messageKey
  }, [message])

  const content = useMemo(() => {
    let content = ''
    const keyEndIndex = message?.indexOf(':')
    content = message?.substring(keyEndIndex + 1 || 0, message.length) || ''
    return content
  }, [message])

  switch (key) {
    case ChatNotificationKeys.LeftGroup: {
      const noti = t('conversation.removedFromGroup')
      return <InChatNoti numberOfLines={numberOfLines} textStyles={textStyles} title={content} content={noti} containerStyle={inChatContainerStyle} />
    }

    case ChatNotificationKeys.RemoveMember: {
      const noti = t('conversation.removedFromGroup')
      return <InChatNoti numberOfLines={numberOfLines} textStyles={textStyles} title={content} content={noti} containerStyle={inChatContainerStyle} />
    }

    case ChatNotificationKeys.AddedMember:
    case ChatNotificationKeys.AddedMembers:
    {
      const noti = t('conversation.addedToGroup')
      return <InChatNoti numberOfLines={numberOfLines} textStyles={textStyles} title={content} content={noti} containerStyle={inChatContainerStyle} />
    }

    case ChatNotificationKeys.Post: {
      const noti = t('conversation.sharedPost')
      return <InChatNoti numberOfLines={numberOfLines} textStyles={textStyles} content={noti} containerStyle={inChatContainerStyle} />
    }

    case ChatNotificationKeys.Project: {
      const noti = t('conversation.sharedProject')
      return <InChatNoti numberOfLines={numberOfLines} textStyles={textStyles} content={noti} containerStyle={inChatContainerStyle} />
    }

    default: {
      return (
        <View style={styles.notificationContainer}>
          <Text style={styles.notificationBold}>{message}</Text>
        </View>
      )
    }
  }

  return null
}

export default ChatNotification
