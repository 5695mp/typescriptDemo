import React, { ReactNode } from "react";
import { View } from "react-native"
import ImageView from "@components/micro/ImageView";
import styles from "./styles";

interface CProps {
  placeholder?: ReactNode
  uri?: string
  isNew?: boolean
}

const ConversationImage = ({ placeholder, uri, isNew }: CProps) => {

  return (
    <View style={styles.imageView}>
      <ImageView
        wrapperStyles={styles.imageView}
        uri={uri}
        placeholder={placeholder}
      />
      {isNew && (
        <View style={styles.badge} />
      )}
    </View>
  )
}

export default ConversationImage
