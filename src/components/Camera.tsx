/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useState, useEffect } from 'react'
import { View, TouchableOpacity, ActivityIndicator, Alert, StyleSheet, Platform, Modal, Linking } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Camera, CameraCapturedPicture } from 'expo-camera'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Colors, AppName } from '@config/keys'
import { useLocalized } from '@utils/helpers'

interface CProps {
  onCaptureComplete: (image: CameraCapturedPicture) => void
  close?: () => void
  asModal?: boolean
  onCancelGoToSetings?: () => void
  skipProccessing?: boolean
}

const { Type: CameraType, FlashMode } = Camera.Constants
const sizeOfCapture = Platform.OS === 'ios' ? 64 : 54
const iconSize = Platform.OS === 'ios' ? 35 : 28
const styles = StyleSheet.create({
  container: { display: 'flex', flex: 1, justifyContent: 'space-between' },
  actionsContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginHorizontal: 10,
  },
  capture: {
    width: sizeOfCapture,
    height: sizeOfCapture,
    borderRadius: sizeOfCapture / 2,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.White,
    backgroundColor: Colors.WhiteShadow,
  },
})

const AppCamera = (props: CProps) => {
  const { t } = useLocalized()
  const { close, asModal = false, onCancelGoToSetings, skipProccessing = false } = props
  const insets = useSafeAreaInsets()
  const isMounted = React.useRef(false)
  const cameraRef = React.useRef<Camera>(null)

  const [capturing, setCapturing] = useState(false)
  const [flashMode, setFlashMode] = useState(FlashMode.off)
  const [cameraType, setCameraType] = useState(CameraType.back)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)

  const init = async () => {
    try {
      const { status } = await Camera.requestPermissionsAsync()
      if (status === 'denied') return goToSettings()
      setHasPermission(status === 'granted')
    } catch (error) {
      console.info(error)
    }
  }

  const goToSettings = () => {
    Alert.alert(
      t('Camera.alertHeader', { 0: AppName }),
      t(Platform.OS === 'android' ? 'Camera.androidAlertDesc' : 'Camera.alertDesc'),
      [
        {
          text: t('Camera.goSetting'),
          onPress: () => Linking.openSettings(),
        },
        {
          text: t('Camera.cancel'),
          onPress: onCancelGoToSetings,
          style: 'cancel',
        },
      ]
    )
  }

  useEffect(() => {
    isMounted.current = true
    init()
    return () => {
      isMounted.current = false
    }
  }, [])

  const confirm = (image: CameraCapturedPicture, title = t('Camera.confirm'), message = t('Camera.confirmMes')) => {
    const { onCaptureComplete } = props
    Alert.alert(
      title,
      message,
      [
        { text: t('Camera.no'), style: 'cancel' },
        {
          text: t('Camera.yes'),
          onPress: () => onCaptureComplete(image),
        },
      ],
      { cancelable: false }
    )
  }

  const capture = async () => {
    if (cameraRef.current) {
      try {
        const capturedImage = await cameraRef.current.takePictureAsync({ exif: true, skipProcessing: skipProccessing })
        setCapturing(false)
        const { onCaptureComplete } = props
        onCaptureComplete(capturedImage)
        // confirm(capturedImage)
      } catch (error) {
        console.info(error)
      }
    } else {
      alert(t('Camera.notFound'))
    }
  }

  if (hasPermission === null)
    return asModal ? null : <ActivityIndicator size='small' color={Colors.White} style={{ marginTop: 10 }} />
  if (hasPermission === false)
    return asModal ? null : <Ionicons name='alert-circle-outline' size={24} color={Colors.Red} />

  const actionElements = (
    <View style={styles.container}>
      {asModal ? (
        <View>
          <TouchableOpacity onPress={close} style={{ padding: 10 }}>
            <Ionicons name='arrow-back' color={Colors.White} size={iconSize} />
          </TouchableOpacity>
        </View>
      ) : (
        <View />
      )}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          disabled={capturing}
          style={{ padding: 5 }}
          onPress={() => setCameraType(cameraType === CameraType.back ? CameraType.front : CameraType.back)}
        >
          <Ionicons name='camera-reverse' color={Colors.White} size={iconSize} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.capture} onPress={capture} disabled={capturing}>
          {capturing ? (
            <ActivityIndicator size='small' color={Colors.White} />
          ) : (
            <Ionicons name='camera' color={Colors.White} size={iconSize} />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          disabled={capturing}
          style={{ padding: 5 }}
          onPress={() => setFlashMode(flashMode === FlashMode.on ? FlashMode.off : FlashMode.on)}
        >
          {FlashMode.on ? (
            <Ionicons name='flash' color={Colors.White} size={iconSize} />
          ) : (
            <Ionicons name='flash-off' color={Colors.White} size={iconSize} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  )

  const cameraElement = (
    <Camera style={{ flex: 1 }} type={cameraType} ref={cameraRef} flashMode={flashMode}>
      {asModal ? (
        <View
          style={{
            flex: 1,
            paddingTop: insets.top,
            paddingLeft: insets.left,
            paddingBottom: insets.bottom,
            paddingRight: insets.right,
          }}
        >
          {actionElements}
        </View>
      ) : (
        actionElements
      )}
    </Camera>
  )

  return asModal ? (
    <Modal animationType='slide' visible onRequestClose={close} presentationStyle='fullScreen' statusBarTranslucent>
      {cameraElement}
    </Modal>
  ) : (
    cameraElement
  )
}

export default AppCamera
