import React, { useState, useEffect, useCallback } from 'react'
import uuid from 'react-native-uuid'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@redux/store'
import endpoints from '@config/endpoints'
import axios from 'axios'
import { debounce } from 'lodash'
import { AllFilter, asyncSearchDebounceMS, DEFAULT_ALL_FILTER } from '../constants'

interface CProps {
  searchContent: string
}

const useContentSearchAllFascade = (props: CProps) => {
  const dispatch = useDispatch()
  const { searchContent } = props
  const [reRenderKey, setReRenderKey] = useState(uuid.v4())

  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [totalPage, setTotalPage] = useState(undefined)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemList, setItemList] = useState([])
  const [showFilter, setShowFilter] = useState(false)
  const [filters, setFilters] = useState<AllFilter>(DEFAULT_ALL_FILTER)

  const size = 10
  // Search all
  const searchAll = useCallback(
    async (query: string = searchContent, page: number = currentPage, searchFilter: AllFilter = filters) => {
      if (query.length) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (typeof totalPage !== 'undefined' && page >= totalPage) return
        let sortBy = `ASC`
        let sortKey = 'relevance'
        if (searchFilter) {
          if (searchFilter.sortBy !== 'relevance') sortKey = 'alphabetically'
          if (searchFilter.sortBy === 'zToA') sortBy = 'DESC'
        }

        const endpoint = `${endpoints.SearchAll}?page=${page}&size=${size}&search=${query}&sortBy=${sortBy}&sortKey=${sortKey}`
        try {
          const res = await axios.get(endpoint)
          const { results: resData = [] } = res.data?.data
          if (page === 1) {
            setItemList([])
            setItemList(resData)
          } else {
            // All search does not have total pages
            // So if data is empty, then it's the final page
            if (resData.length === 0) {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              // eslint-disable-next-line consistent-return
              return setTotalPage(page)
            }
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            setItemList((prevState) => [...prevState, ...resData])
          }
        } catch (error) {
          // handleError(error)
          console.log('error search all: ', error)
        } finally {
          setLoadingMore(false)
          setLoading(false)
        }
      }
    },
    [totalPage, filters, currentPage]
  )

  const handleLoadmore = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (typeof totalPage !== 'undefined' && currentPage >= totalPage) return
    setCurrentPage(currentPage + 1)
    setLoadingMore(true)
  }

  const handleResetAll = () => {
    setCurrentPage(1)
    setTotalPage(undefined)
  }

  const debounceAllSearch = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-shadow
    debounce((query, page, filters) => searchAll(query, page, filters), asyncSearchDebounceMS),
    []
  )

  const toggleShowFilter = () => {
    setShowFilter(!showFilter)
  }

  const onCloseFilter = () => {
    setShowFilter(false)
  }

  const onApplyProjectFilters = useCallback((value: AllFilter) => {
    setFilters(value)
    onCloseFilter()
  }, [])

  useEffect(() => {
    setLoading(true)
    debounceAllSearch(searchContent, currentPage, filters)
  }, [searchContent, currentPage, filters])

  useEffect(() => {
    handleResetAll()
  }, [searchContent, filters])

  return {
    reRenderKey,
    itemList,
    loading,
    loadingMore,
    handleLoadmore,
    showFilter,
    toggleShowFilter,
    onCloseFilter,
    filters,
    onApplyProjectFilters,
  }
}

export default useContentSearchAllFascade
