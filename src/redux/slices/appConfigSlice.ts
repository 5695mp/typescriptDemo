import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface SliceState {
  // runningAppleConnect: boolean
  // loadingAppleConnectButton: boolean
  // loadingAppleConnectButton: boolean
  settingsSavePending: boolean
}

const initialState: SliceState = {
  // runningAppleConnect: false,
  // loadingAppleConnectButton: false,
  settingsSavePending: false,
}

/* Store Overall App config */
const appConfigSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    updateAppConfig(config, { payload }: PayloadAction<Partial<SliceState>>) {
      return { ...config, ...payload }
    },
  },
})

export const { updateAppConfig } = appConfigSlice.actions

export default appConfigSlice.reducer
