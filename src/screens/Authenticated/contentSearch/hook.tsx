import React, { useState, useEffect, useCallback } from 'react'
import { TextInput } from 'react-native'
import endpoints from '@config/endpoints'
import { useNavigation } from '@react-navigation/native'
import store, { AppDispatch } from '@redux/store'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setTabBarHidden } from '@redux/slices/settingsSlice'
import { ContentSearchTab } from './constants'

const useContentSearchFascade = (props: any) => {
  const { route } = props

  const getInitialTab = useCallback(() => {
    const activeTabKey = route?.params?.activeTab
    let activeTabIndex = 0
    const findActiveKey = ContentSearchTab.findIndex((tab) => tab.key === activeTabKey)
    if (findActiveKey > -1) {
      activeTabIndex = findActiveKey
    }
    return activeTabIndex
  }, [route])

  const initialTab = getInitialTab()
  const [activeTab, setActiveTab] = useState(initialTab)
  const [searchContent, setSearchContent] = useState('')
  const isMounted = React.useRef(false)
  const isFirst = React.useRef(true)
  const searchBarRef = React.useRef<TextInput>(null)
  // Recent
  const [recentList, setRecentList] = useState([])
  const [recentLoading, setRecentLoading] = useState(false)

  const dispatch: AppDispatch = useDispatch()
  const navigation = useNavigation()

  // Recent
  const getRecentSearch = async () => {
    if (!isMounted.current) return
    setRecentLoading(true)
    const type = ContentSearchTab[activeTab]?.searchType
    const endpoint = type ? `${endpoints.SearchRecent}?type=${type}` : `${endpoints.SearchRecent}`
    try {
      const res = await axios.get(endpoint)
      const { data: resData = [] } = res.data
      setRecentList(resData)
    } catch (error) {
      console.log(error)
    } finally {
      if (isFirst.current) {
        searchBarRef?.current?.focus()
        isFirst.current = false
      }
      setRecentLoading(false)
    }
  }
  // Function to call action for TabBar hide/show with true/false value
  const onSetTabBarHidden = (value: boolean) => {
    store.dispatch(setTabBarHidden(value))
  }
  const onClearSearchContent = () => {
    setSearchContent('')
  }

  useEffect(() => {
    getRecentSearch().catch()
  }, [activeTab])

  useEffect(() => {
    isMounted.current = true

    getRecentSearch().catch()
    return () => {
      isMounted.current = false
      isFirst.current = false
    }
  }, [])
  // Search input
  const onSearchChange = (value: string) => {
    setSearchContent(value)
  }
  return {
    activeTab,
    navigation,
    setActiveTab,
    dispatch,
    onSearchChange,
    searchContent,
    recentList,
    recentLoading,
    onClearSearchContent,
    searchBarRef,
    initialTab,
    onSetTabBarHidden,
  }
}

export default useContentSearchFascade
