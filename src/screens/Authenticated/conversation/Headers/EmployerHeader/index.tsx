import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import ImageView from '@components/micro/ImageView'
import Icon from '@components/icons/Icon'
import { AuthScreens, Colors } from '@config/keys'
import { getAccountName } from '@utils/accountHelpers'
import styles from '../styles'
import { useLocalized } from '@utils/helpers'
import {useNavigation} from '@react-navigation/native'

interface CProps {
  user: User
}

const EmployerHeader = ({ user }: CProps) => {
  const { t } = useLocalized()
  const navigation = useNavigation()
  const onGoToProfile = () => {
    navigation.navigate(AuthScreens.OthersProfile, { userId: user?.id })
  }
  return (
    <TouchableOpacity onPress={onGoToProfile} style={styles.container}>
      <View style={styles.image}>
        <ImageView
          onPress={onGoToProfile}
          wrapperStyles={styles.imageWrapper}
          uri={user.profilePicture}
          resizeMode='cover'
          highlightColor={Colors.WhiteShadow}
          placeholder={<Icon name='SolidBuilding' height={16} width={16} fill={Colors.RebrandDark} />}
        />
      </View>
      <View style={styles.seekerInfo}>
        <Text numberOfLines={1} style={styles.membersName}>
          {getAccountName(user)}
        </Text>
        {user.isDeleted ? (
          <View style={styles.subContainer}>
            <Text style={styles.subtitle}>{t('conversation.deleted')}</Text>
          </View>
        ) : (
          <View style={styles.subContainer}>
            <Text style={styles.subtitle}>{user.BusinessType?.name}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  )
}

export default EmployerHeader
