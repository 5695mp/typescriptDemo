/* eslint-disable react/no-unused-prop-types */
import React from 'react'
import { ActivityIndicator, TouchableOpacity, Text, View, Modal } from 'react-native'

import { Colors, Role } from '@config/keys'
import { useLocalized } from '@utils/helpers'
import { isEmpty } from 'lodash'
import UserItem from '@components/SearchContentItems/UserItem'
import { FlatList as GestureFlatList } from 'react-native-gesture-handler'
import Icon from '@components/icons/Icon'
import ContentSortAccount from '@components/SearchContentSorts/SortAccounts'
import { AccountFilter } from '@components/SearchContentSorts/SortAccounts/hook'
import ContentSortProject from '@components/SearchContentSorts/SortProjects'
import useContentSearchAccountsFascade from './hook'
import ContentSearchNoResult from '../NoResults'
import styles from './styles'

interface CProps {
  searchContent: string
  isInitTab?: boolean
  initSortFilter?: AccountFilter
}

const ContentSearchAccounts = (props: CProps) => {
  const { searchContent } = props
  const {
    itemList,
    loading,
    handleAccountsLoadmore,
    loadingMore,
    toggleShowFilter,
    showFilter,
    filters,
    onApplyProjectFilters,
    onCloseFilter,
  } = useContentSearchAccountsFascade(props)
  const isEmptyAll = isEmpty(itemList)
  const { t } = useLocalized()

  if (isEmptyAll && !loading) {
    return (
      <View style={styles.main}>
        <TouchableOpacity onPress={toggleShowFilter} style={styles.sortBtn}>
          <Icon name='SolidFilter' fill={Colors.Primary} width={16} height={16} />
          <Text style={styles.sortBtnText}>{t('projectMapFilter.filterSort')}</Text>
        </TouchableOpacity>
        <ContentSearchNoResult />
        <Modal animationType='slide' visible={showFilter} presentationStyle='fullScreen' statusBarTranslucent>
          <ContentSortAccount filters={filters} onApplyFilter={onApplyProjectFilters} closeSheet={onCloseFilter} />
        </Modal>
      </View>
    )
  }

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    const isEmployer = item.role === Role.Company
    return <UserItem item={item} key={index} isEmployer={isEmployer} />
  }

  return (
    <View style={styles.main}>
      {!!searchContent && (
        <TouchableOpacity onPress={toggleShowFilter} style={styles.sortBtn}>
          <Icon name='SolidFilter' fill={Colors.Primary} width={16} height={16} />
          <Text style={styles.sortBtnText}>{t('projectMapFilter.filterSort')}</Text>
        </TouchableOpacity>
      )}
      {loading && !loadingMore && (
        <View style={styles.activityIndicator}>
          <ActivityIndicator size='small' color={Colors.Primary} />
        </View>
      )}
      {!isEmptyAll && (
        <GestureFlatList
          data={itemList}
          keyExtractor={(item: any, index: number) => `ACCOUNT_${item?.Post?.id || item?.id || index}`}
          renderItem={renderItem}
          showsHorizontalScrollIndicator={false}
          onEndReachedThreshold={0.8}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.flatList}
          onEndReached={() => {
            if (!loadingMore) {
              handleAccountsLoadmore()
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
        <ContentSortAccount filters={filters} onApplyFilter={onApplyProjectFilters} closeSheet={onCloseFilter} />
      </Modal>
    </View>
  )
}

export default ContentSearchAccounts
