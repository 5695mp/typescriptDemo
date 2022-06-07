import MediaPicker from '@components/input/MediaPicker';
import { MediaInfo } from '@components/input/MediaPicker/helpers';
import React from 'react';
import { Text, View } from 'react-native';
import { IMessage, Send, SendProps } from 'react-native-gifted-chat';
import styles from "./styles";

interface CProps {
  props?: SendProps<IMessage>
  onRemovePhoto?: (item: MediaInfo) => void
  project?: Project
  disableScroll?: boolean
  maxFiles?: number
  onSelectFiles?: (data: MediaInfo[]) => void
  canSend?: boolean
  onSend?: (text?: string) => void
  disabled?: boolean
}

const CustomSend = ({
  props,
  onSelectFiles,
  maxFiles = 10,
  canSend = false,
  onSend, 
  disabled
}: CProps) => {
  return (
    <View style={styles.sendContainer}>
      <MediaPicker
        mode='custom'
        enableAutoCrop={true}
        maxFiles={maxFiles}
        onUpdateFiles={onSelectFiles}
        cropingBoxStyle={{ display: 'none' }}
        disabled={disabled}
      />
      {(canSend) && (
        <Send
          {...props}
          containerStyle={styles.sendButton}
          sendButtonProps={{
            onPress: () => { onSend?.(props?.text) }
          }}
          disabled={disabled}
        >
          <Text style={styles.sendLabel}>Send</Text>
        </Send>
      )}
    </View>
  )
}

export default CustomSend