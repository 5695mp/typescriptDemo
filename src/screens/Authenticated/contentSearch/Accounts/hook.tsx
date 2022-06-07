import React, { useState, useEffect, useCallback } from 'react'
import uuid from 'react-native-uuid'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@redux/store'
import { debounce } from 'lodash'
import endpoints from '@config/endpoints'
import axios from 'axios'
import { AccountFilter } from '@components/SearchContentSorts/SortAccounts/hook'
import { asyncSearchDebounceMS, DEFAULT_ACCOUNT_FILTER, ItemsPerPage } from '../constants'
import { combineQueryFromFilters } from './helpers'

interface CProps {
  searchContent: string
  isInitTab?: boolean
  initSortFilter?: AccountFilter
}

const useContentSearchAccountsFascade = (props: CProps) => {
  const { searchContent, isInitTab = false, initSortFilter = {} } = props
  const dispatch = useDispatch()

  const [reRenderKey, setReRenderKey] = useState(uuid.v4())
  const [accountsCurrentPage, setAccountsCurrentPage] = useState(1)
  const [accountsTotalPage, setAccountTotalPage] = useState(undefined)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [itemList, setItemList] = useState([])
  const [showFilter, setShowFilter] = useState(false)
  const [filters, setFilters] = useState<AccountFilter>(DEFAULT_ACCOUNT_FILTER)

  const settingsState = useSelector((state: RootState) => state.settings)
  const { tradeTags, loadingTradeTags } = settingsState

  // Search accounts
  const searchAccounts = useCallback(
    async (
      query: string = searchContent,
      page: number = accountsCurrentPage,
      searchFilter: AccountFilter = filters
    ) => {
      if (query.length) {
        setLoading(true)
        const filterParams = combineQueryFromFilters(query, searchFilter)
        const endpoint = `${endpoints.SearchAccounts}?page=${page}&size=${ItemsPerPage}${filterParams}`
        try {
          const res = await axios.get(endpoint)
          const { results: resData = [], totalPages: total, totalItems } = res.data?.data

          if (page === 1) {
            setAccountTotalPage(total)
            setItemList([])
            setItemList(resData)
          } else {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            setItemList((prevState) => [...prevState, ...resData])
          }
        } catch (error) {
          console.log('error search accounts: ', error)
        } finally {
          setLoading(false)
          setLoadingMore(false)
        }
      }
    },
    [itemList]
  )

  const handleAccountsLoadmore = () => {
    if (loadingMore) return
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (typeof accountsTotalPage !== 'undefined' && accountsCurrentPage >= accountsTotalPage) return
    setAccountsCurrentPage(accountsCurrentPage + 1)
    setLoadingMore(true)
  }

  const handleResetAccount = () => {
    setAccountsCurrentPage(1)
    setAccountTotalPage(undefined)
  }

  const debounceAccountSearch = useCallback(
    debounce((query, page, searchFilter) => searchAccounts(query, page, searchFilter), asyncSearchDebounceMS),
    []
  )

  const toggleShowFilter = () => {
    setShowFilter(!showFilter)
  }

  const onCloseFilter = () => {
    setShowFilter(false)
  }

  const onApplyProjectFilters = useCallback((value: AccountFilter) => {
    setFilters(value)
    onCloseFilter()
  }, [])

  useEffect(() => {
    debounceAccountSearch(searchContent, accountsCurrentPage, filters)
  }, [searchContent, accountsCurrentPage, filters])

  useEffect(() => {
    handleResetAccount()
  }, [searchContent, filters])

  useEffect(() => {
    if (isInitTab) {
      setFilters((prev) => ({ ...prev, ...initSortFilter }))
    }
  }, [])

  return {
    reRenderKey,
    itemList,
    loading,
    handleAccountsLoadmore,
    loadingMore,
    filters,
    toggleShowFilter,
    onApplyProjectFilters,
    onCloseFilter,
    showFilter,
    tradeTags,
    loadingTradeTags,
  }
}

export default useContentSearchAccountsFascade
