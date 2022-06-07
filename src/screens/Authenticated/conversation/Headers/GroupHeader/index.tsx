import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import ImageView from '@components/micro/ImageView'
import Icon from '@components/icons/Icon'
import { AuthScreens, Colors } from '@config/keys'
import { getAccountName, getUserPlaceholderIcon } from '@utils/accountHelpers'
import styles from '../styles'
import { useLocalized } from '@utils/helpers'
import { useNavigation } from '@react-navigation/native'

interface CProps {
  users: any[]
  item: any
  onGoToSettings: () => void
  newMembersCount?: number
}

const GroupHeader = ({ users, item, onGoToSettings, newMembersCount }: CProps) => {
  const { t } = useLocalized()
  const navigation = useNavigation()
  const membersName = users
    .map((user: any) => {
      if (user?.User) {
        return getAccountName(user?.User)
      } else {
        return t('conversation.deleted')
      }
    })
    .join(', ')


  return (
    <TouchableOpacity style={styles.container} onPress={onGoToSettings}>
      <View>
        <View style={styles.firstImage}>
          <ImageView
            wrapperStyles={styles.groupImage}
            uri={users[0]?.User?.profilePicture}
            resizeMode='cover'
            highlightColor={Colors.WhiteShadow}
            placeholder={
              <Icon name={getUserPlaceholderIcon(users[0]?.role)} height={16} width={16} fill={Colors.RebrandDark} />
            }
          />
        </View>
        <View style={styles.secondImage}>
          <ImageView
            wrapperStyles={styles.groupImage}
            uri={users[1]?.User?.profilePicture}
            resizeMode='cover'
            highlightColor={Colors.WhiteShadow}
            placeholder={
              <Icon name={getUserPlaceholderIcon(users[1]?.role)} height={16} width={16} fill={Colors.RebrandDark} />
            }
          />
        </View>
      </View>
      <View style={styles.members}>
        <Text numberOfLines={1} style={styles.membersName}>
          {membersName}
        </Text>
        <Text style={styles.membersCount}>{`${newMembersCount ? newMembersCount : users.length + 1} ${t('conversation.people')}`}</Text>
      </View>
    </TouchableOpacity>
  )
}

export default GroupHeader
