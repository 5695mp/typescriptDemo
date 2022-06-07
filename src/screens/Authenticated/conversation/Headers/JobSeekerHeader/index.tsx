import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import ImageView from '@components/micro/ImageView'
import Icon from '@components/icons/Icon'
import { AuthScreens, Colors } from '@config/keys'
import { getAccountName } from '@utils/accountHelpers'
import { useLocalized } from '@utils/helpers'
import styles from '../styles'
import { useNavigation } from '@react-navigation/native'

interface CProps {
  user: User | null | any
}

const JobSeekerHeader = ({ user }: CProps) => {
  const { t } = useLocalized()
  const navigation = useNavigation()
  const open_to_work = user?.UserMeta?.find((item: any) => item?.key === 'open_to_work')
  const onGoToProfile = () => {
    navigation.navigate(AuthScreens.OthersProfile, { userId: user?.id })
  }
  return (
    <TouchableOpacity style={styles.container} disabled={!user} onPress={onGoToProfile}>
      <View style={styles.image}>
        <ImageView
          onPress={onGoToProfile}
          wrapperStyles={styles.image}
          uri={user?.profilePicture}
          resizeMode='cover'
          highlightColor={Colors.WhiteShadow}
          placeholder={<Icon name='SolidUserHardHat' height={16} width={16} fill={Colors.RebrandDark} />}
        />
      </View>
      <View style={styles.seekerInfo}>
        {user && (
          <Text numberOfLines={1} style={styles.membersName}>
            {getAccountName(user)}
          </Text>
        )}
        {open_to_work?.value && (
          <View style={styles.subContainer}>
            <View style={styles.active} />
            <Text style={styles.subtitle}>{t('conversation.availableToWork')}</Text>
          </View>
        )}
        {!user && (
          <View style={styles.subContainer}>
            <Text style={styles.deletedUser}>{t('conversation.deleted')}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  )
}

export default JobSeekerHeader
