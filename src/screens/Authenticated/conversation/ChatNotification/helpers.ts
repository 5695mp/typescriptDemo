import { ChatNotificationKeys } from "@config/keys"

export const getChatNotificationKey = (message?: string) => {
  let messageKey = ''
  const keyEndIndex = message?.indexOf(':')
  if (!keyEndIndex) return messageKey
  messageKey = message?.substring(0, keyEndIndex + 1) || ''
  return messageKey
}

export const isNotification = (key?: string) => {
    const keyList = Object.values([
      ChatNotificationKeys.RemoveMember,
      ChatNotificationKeys.LeftGroup,
      ChatNotificationKeys.AddedMember,
      ChatNotificationKeys.AddedMembers
    ])
    return keyList.includes(key || '') 
}
