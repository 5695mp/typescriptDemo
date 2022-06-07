import React, { ReactNode } from 'react'
import { View, Text, TextStyle, ViewStyle } from 'react-native'
import styles from '../styles'
import { useLocalized } from '@utils/helpers'

interface CProps {
  title?: string
  content?: string
  textStyles?: TextStyle
  numberOfLines?: number
  containerStyle?: ViewStyle
}

const InChatNoti = ({ title, textStyles, content, numberOfLines, containerStyle }: CProps) => {
  const { t } = useLocalized()
  return (
    <View style={[styles.notiContainer, containerStyle]}>
      <Text numberOfLines={numberOfLines} style={[styles.notiText, styles.title, textStyles]}>
        {title} <Text style={[styles.notiText, styles.content, textStyles]}>{`${content}`}</Text>
      </Text>

    </View>
  )
}

export default InChatNoti
