import React, { useState, useEffect } from 'react';
import { ComposerProps, Composer } from 'react-native-gifted-chat';
import { MediaInfo } from '@components/input/MediaPicker/helpers';
import { View, ScrollView, Keyboard, ActivityIndicator } from 'react-native';
import styles from "./styles";
import ProjectPill from '@views/ProjectPill';
import MediaGallery from '@components/input/MediaPicker/MediaGallery';
import { useLocalized } from '@utils/helpers';
import keys, { Measurement, Colors } from '@config/keys';

interface CProps {
  props?: ComposerProps,
  selectedPhotos?: MediaInfo[],
  onRemovePhoto?: (item: MediaInfo) => void,
  project?: Project,
  disableScroll?: boolean,
  onRemoveProjectLink?: () => void,
  text?: string
  textInputAutoFocus?: boolean
  onTextChanged?: (text: string) => void
  extraPhotoHeight?: number
  disabled?: boolean
  sending?: boolean
}

let height = 0
const IMAGE_SIZE = 115

const CustomComposer = ({
  props,
  selectedPhotos,
  onRemovePhoto,
  project,
  text = '',
  textInputAutoFocus = true,
  onTextChanged,
  onRemoveProjectLink,
  extraPhotoHeight = 40,
  disabled,
  sending
}: CProps) => {

  const { t } = useLocalized()
  const numbersOfItems = selectedPhotos?.length || 0
  const spacing = numbersOfItems > 1 ? ((numbersOfItems - 1) * 12) : 0
  return (
    <View
      // onLayout={
      //   (eve) => height = eve.nativeEvent.layout.height}
      style={styles.composerContainer}>
      {!!project && <ProjectPill
        containerStyle={styles.projectPill}
        project={project}
        onDelete={onRemoveProjectLink}
      />}

      <Composer
        textInputAutoFocus={textInputAutoFocus}
        textInputStyle={[styles.composer, text.length > 0 ? styles.text : styles.placeholder]}
        placeholder={t('addMessage.messagePlaceholder')}
        {...props}
        text={text}
        onTextChanged={onTextChanged}
        disableComposer={disabled}
      />

      <ScrollView
        style={{ marginTop: numbersOfItems > 0 ? 14 : 0 }}
        horizontal={true}
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.gallery}>
        <MediaGallery
          size={IMAGE_SIZE}
          sortable={false}
          displayNumber={false}
          containerStyle={{ height: numbersOfItems > 0 ? IMAGE_SIZE + extraPhotoHeight : 0 }}
          containerWidth={Math.max(IMAGE_SIZE * numbersOfItems + spacing, keys.windowWidth)}
          mediaList={selectedPhotos}
          onDeleteItem={onRemovePhoto}
        />
      </ScrollView>
      {sending && <View style={styles.loading}>
        <ActivityIndicator color={Colors.Primary} size='large' />
      </View>}
    </View>
  )
};


export default CustomComposer