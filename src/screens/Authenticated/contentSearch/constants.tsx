import { TabItems } from "@components/micro/Tab"
import { ContentSearchTabs } from "@config/keys"

// Search type will be used for api query
// As mentioned in https://api.laber.stage-codal.net/swagger/#/Search/get_search_recent
export const ContentSearchTab: TabItems = [
  { label: 'All', key: ContentSearchTabs.All, searchType: '' },
  { label: 'Projects', key:  ContentSearchTabs.Projects, searchType: 'Project' },
  { label: 'Accounts', key:  ContentSearchTabs.Accounts, searchType: 'User' },
  { label: 'Trades', key:  ContentSearchTabs.Trades, searchType: 'TradeTag' },
  { label: 'Posts', key:  ContentSearchTabs.Posts, searchType: 'Post' },
]

export const ContentSearchHeaderHeight = 240

export const ItemsPerPage = 10

export const asyncSearchDebounceMS = 800

export const Status = {
  ALL: 'all',
  ACTIVE: 'active',
  COMPLETE: 'complete',
  HIRING: 'hiring',
}

export const AccountStatus = {
  ALL: 'all',
  HIRING: 'hiring',
  AVAILABLE: "available"
}

export const SortByType = {
  A_TO_Z: 'ASC',
  Z_TO_A: 'DESC',
  MOST_RELEVANT: 'relevance',
}

export const ProjectType = {
  ALL: 'all',
  COMMERCIAL: '1',
  RESIDENTAL: '2',
  INDUSTRIAL: '4',
  PERSONAL: '3',
}

export const ProjectSize = {
  ALL: 'all',
  ONE_TO_TEN: '1-10',
  ELEVEN_TO_FIFTY: '11-50',
  MORE_THAN_FIFTY: '51',
}

export type AllFilter = {
  sortBy: string,
}

export type ProjectFilter = {
  sortBy: string,
  status: string[],
  projectType: string[],
  projectDetails: string,
  city?: string,
  primaryContractorId?: string
}


export const DEFAULT_ALL_FILTER = {
  sortBy: SortByType.MOST_RELEVANT,
}

export const DEFAULT_TRADES_FILTER = {
  sortBy: SortByType.A_TO_Z,
}

export const DEFAULT_PROJECT_FILTER = {
  sortBy: SortByType.MOST_RELEVANT,
  status: [Status.ACTIVE],
  projectType: [ProjectType.ALL],
  projectDetails: ProjectSize.ALL,
  city: undefined,
  primaryContractorId: undefined
}

export const DEFAULT_ACCOUNT_FILTER = {
  sortBy: SortByType.MOST_RELEVANT,
  city: undefined,
  trades: undefined,
  status: [AccountStatus.ALL],
}
