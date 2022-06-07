import React from 'react'
import { ActivityIndicator, Modal, Text, TouchableOpacity, View } from 'react-native'
import isEmpty from 'lodash/isEmpty'

import { Colors, Role } from '@config/keys'
import { useLocalized } from '@utils/helpers'
import UserItem from '@components/SearchContentItems/UserItem'
import { FlatList as GestureFlatList } from 'react-native-gesture-handler'
import ContentSortAll from '@components/SearchContentSorts/SortAll'
import Icon from '@components/icons/Icon'
import ProjectItem from '@components/SearchContentItems/ProjectItem'
import SearchContentTradeItem from '@components/SearchContentItems/TradeItem'
import ContentSortAccount from '@components/SearchContentSorts/SortAccounts'
import useContentSearchAllFascade from './hook'
import ContentSearchNoResult from '../NoResults'
import styles from './styles'

interface CProps {
  searchContent: string
}

const ContentSearchAll = (props: CProps) => {
  const { searchContent } = props
  const { t } = useLocalized()
  const {
    itemList,
    loading,
    loadingMore,
    handleLoadmore,
    showFilter,
    onCloseFilter,
    filters,
    onApplyProjectFilters,
    toggleShowFilter,
  } = useContentSearchAllFascade(props)
  const isEmptyAll = isEmpty(itemList)

  if (isEmptyAll && !loading) {
    return (
      <View style={styles.main}>
        <TouchableOpacity onPress={toggleShowFilter} style={styles.sortBtn}>
          <Icon name='SolidSort' fill={Colors.Primary} />
          <Text style={styles.sortBtnText}>{t('searchContent.sort')}</Text>
        </TouchableOpacity>
        <ContentSearchNoResult />
        <Modal animationType='slide' visible={showFilter} presentationStyle='fullScreen' statusBarTranslucent>
          <ContentSortAll filters={filters} onApplyFilter={onApplyProjectFilters} closeSheet={onCloseFilter} />
        </Modal>
      </View>
    )
  }

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    // User
    if (item.role === Role.JobSeeker) {
      return <UserItem item={item} key={index} />
    }
    // Company
    if (item.role === 'company') {
      return <UserItem item={item} key={index} isEmployer />
    }
    // Trade
    if (item.type === 'tag') {
      return <SearchContentTradeItem item={item} key={index} searchContent={searchContent} />
    }

    // Default
    return <ProjectItem item={item} key={index} searchContent={searchContent} />
  }

  return (
    <View style={styles.main}>
      {!!searchContent && (
        <TouchableOpacity onPress={toggleShowFilter} style={styles.sortBtn}>
          <Icon name='SolidSort' fill={Colors.Primary} />
          <Text style={styles.sortBtnText}>{t('searchContent.sort')}</Text>
        </TouchableOpacity>
      )}

      {loading && !loadingMore && (
        <View style={styles.activityIndicator}>
          <ActivityIndicator size='small' color={Colors.Primary} />
        </View>
      )}

      {!isEmptyAll && !!searchContent && (
        <GestureFlatList
          data={itemList}
          keyExtractor={(item: any, index: number) => `ALL_${item?.Post?.id || item?.id || index}`}
          renderItem={renderItem}
          showsHorizontalScrollIndicator={false}
          onEndReachedThreshold={0.8}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.flatList}
          onEndReached={() => {
            if (!loadingMore) {
              handleLoadmore()
            }
          }}
          ListFooterComponent={
            loadingMore ? (
              <View style={styles.activityIndicator}>
                <ActivityIndicator size='small' color={Colors.Primary} />
              </View>
            ) : null
          }
        />
      )}

      {/* {loadingMore && ( */}
      {/*  <View style={styles.activityIndicator}> */}
      {/*    <ActivityIndicator size='small' color={Colors.Primary} /> */}
      {/*  </View> */}
      {/* )} */}

      <Modal animationType='slide' visible={showFilter} presentationStyle='fullScreen' statusBarTranslucent>
        <ContentSortAll filters={filters} onApplyFilter={onApplyProjectFilters} closeSheet={onCloseFilter} />
      </Modal>
    </View>
  )
}

export default ContentSearchAll
