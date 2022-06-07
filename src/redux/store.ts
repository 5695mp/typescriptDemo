import createSagaMiddleware from 'redux-saga'
import { configureStore, combineReducers } from '@reduxjs/toolkit'

import signUpSlice from '@screens/NonAuthenticated/SignUp/slice'
import watcherSaga from './sagas/rootSaga'

import authSlice from './slices/authSlice'
import themeSlice from './slices/themeSlice'
import newPostSlice from './slices/newPostSlice'
import settingsSlice from './slices/settingsSlice'
import appConfigSlice from './slices/appConfigSlice'
import projectFormSlice from './slices/projectFormSlice'
import contentSearchSlice from './slices/contentSearchSlice'
import projectMapSlice from './slices/projectMapSlice'

const rootReducer = combineReducers({
  auth: authSlice,
  theme: themeSlice,
  newPost: newPostSlice,
  settings: settingsSlice,
  appConfig: appConfigSlice,
  projectForm: projectFormSlice,
  signUp: signUpSlice,
  contentSearch: contentSearchSlice,
  projectMap: projectMapSlice,
})

const sagaMiddleware = createSagaMiddleware()

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => [...getDefaultMiddleware({ thunk: false }), sagaMiddleware],
})

sagaMiddleware.run(watcherSaga)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store
