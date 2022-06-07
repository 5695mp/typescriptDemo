
import React from 'react';
import { Image, Text, View, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { InputToolbar, Actions, Composer, Send, ActionsProps, InputToolbarProps, ComposerProps, SendProps, IMessage } from 'react-native-gifted-chat';
import { Colors } from '@config/keys';
import Button from '@components/micro/Button';
import Icon from '@components/icons/Icon';
import { styles } from "./styles";
import MediaPicker from '@components/input/MediaPicker';
import MediaGallery from '@components/input/MediaPicker/MediaGallery';
import { MediaInfo } from '@components/input/MediaPicker/helpers';
import ProjectPill from '@views/ProjectPill';
import CustomComposer from '@components/Chat/CustomComposer';
import CustomSend from '@components/Chat/CustomSend';
import CStyles from '@components/micro/CommonStyles';

interface CInputToolbarProps {
  props: InputToolbarProps
  keyboardIsShowing?: boolean
  keyboardHeight?: number
}

export const renderInputToolbar = ({ props, keyboardIsShowing, keyboardHeight = 0 }: CInputToolbarProps) => {
  return (
    <InputToolbar
      {...props}
      containerStyle={{
        ...CStyles.center,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.PrimaryBorder,
        borderRadius: 10,
        paddingRight: 12,
        minHeight: 48,
        ...(Platform.OS == 'android' && { bottom: 10 })
      }}
      primaryStyle={{ alignItems: 'center' }}
    />
  )
};

let height = 0
interface CComposerProps {
  props: ComposerProps,
  selectedPhotos?: MediaInfo[],
  onRemovePhoto?: (item: MediaInfo) => void,
  project?: Project,
  disableScroll?: boolean,
  onRemoveProjectLink?: () => void,
  text?: string
  onTextChanged?: (text: string) => void
  disabled?: boolean
  sending?: boolean
}

export const renderComposer = (props: CComposerProps) => {
  return (
    <CustomComposer
      {...props}
      textInputAutoFocus={true}
      extraPhotoHeight={10}
    />
    // <View onLayout={(eve) => height = eve.nativeEvent.layout.height} style={styles.composerContainer}>
    //   {!!project && <ProjectPill
    //     containerStyle={styles.projectPill}
    //     project={project}
    //     onDelete={onRemoveProjectLink}
    //   />}
    //   <Composer
    //     textInputAutoFocus={true}
    //     {...props}
    //     text={text}
    //     onTextChanged={onTextChanged}
    //     textInputStyle={styles.composer}
    //   />
    //   <ScrollView scrollEnabled={!disableScroll} showsVerticalScrollIndicator={false} style={{ flexDirection: 'row' }}>
    //     <MediaGallery
    //       containerWidth={350}
    //       mediaList={selectedPhotos}
    //       onDeleteItem={onRemovePhoto}
    //     />
    //   </ScrollView>
    //   {/*<TouchableOpacity onPress={onAttachFile} style={styles.attachFilesButton}>
    //   <Icon name='RegularPlus' fill={Colors.RebrandDark} />
    // </TouchableOpacity>*/}
    // </View>
  )
};


interface CSendProps {
  props: SendProps<IMessage>,
  onRemovePhoto?: (item: MediaInfo) => void,
  project?: Project,
  disableScroll?: boolean,
  onSelectFiles?: (data: MediaInfo[]) => void
  canSend?: boolean
  onSend?: (text?: string) => void
  disabled?: boolean
  maxFiles?: number
}

export const renderSend = (props: CSendProps) => {
  return (
    <CustomSend {...props} />
    // <View style={styles.sendContainer}>
    //   <MediaPicker
    //     mode='custom'
    //     enableAutoCrop={true}
    //     maxFiles={10}
    //     onUpdateFiles={onSelectFiles}
    //   />
    //   {(!!props.text || canSend) && (
    //     <Send
    //       {...props}
    //       containerStyle={styles.sendButton}
    //       sendButtonProps={{
    //         onPress: () => { onSend?.(props.text) }
    //       }}
    //     >
    //       <Text style={styles.sendLabel}>Send</Text>
    //     </Send>
    //   )}
    // </View>
  )
}
