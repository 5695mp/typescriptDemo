import { AccountFilter } from '@components/SearchContentSorts/SortAccounts/hook';
import { QuickProjectFilters } from '@config/keys';
import { SortByType, ProjectType, ProjectSize, Status } from '@views/ProjectMapFilter/helpers';
import { ProjectFilter } from '../constants';

export const combineQueryFromFilters = (
  searchKey?: string,
  extraFilter?: AccountFilter,
) => {
  //if sort by MOST_RELEVANT but search key is empty => should sort by CLOSEST_TO_ME
  const sortBy = extraFilter?.sortBy

  const filters: Record<string, any | undefined> = {
    sortKey: sortBy,
    search: searchKey,
    status: extraFilter && extraFilter.status[0] !== Status.ALL ? extraFilter.status : undefined,
    city: extraFilter ? extraFilter.city : undefined,
    tags: extraFilter ? extraFilter.trades : undefined,
    sortBy: 'DESC'
  }

  if (searchKey) {
    filters.search = searchKey
  }

  const query = Object.keys(filters)
    .filter(key => !!filters[key])
    .map(key => `${key}=${filters[key]}`)
    .join('&')

  return `&${query}`
}
