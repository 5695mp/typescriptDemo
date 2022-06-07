import { takeLatest } from 'redux-saga/effects'

import {
  getAllProjects,
  getCertificateTypes,
  getJobTitles,
  getMyProjects,
  getPrimaryContractors,
  getSchools,
  getTradeTags,
  getTrainingTypes,
  getUsers,
  getUsersRecent,
  searchPrimaryContractors,
  searchUsers,
  searchUsersRecent,
  getSkills,
  getBusinessTypes
} from '../slices/settingsSlice'
import {
  handleGetAllProjects,
  handleGetCertificateTypes,
  handleGetJobTitles,
  handleGetMyProjects,
  handleGetPrimaryContractors,
  handleGetSchools,
  handleGetTradeTags,
  handleGetTrainingTypes,
  handleGetUsers,
  handleGetUsersRecent,
  handleSearchPrimaryContractors,
  handleSearchUsers,
  handleSearchUsersRecent,
  handleGetSkills,
  handleGetBusinessTypes,
} from './handlers/settings'

export default function* watcherSaga() {
  yield takeLatest(getTradeTags.type, handleGetTradeTags)
  yield takeLatest(getMyProjects.type, handleGetMyProjects)
  yield takeLatest(getUsers.type, handleGetUsers)
  yield takeLatest(getUsersRecent.type, handleGetUsersRecent)
  yield takeLatest(searchUsers.type, handleSearchUsers)
  yield takeLatest(searchUsersRecent.type, handleSearchUsersRecent)
  yield takeLatest(getAllProjects.type, handleGetAllProjects)
  yield takeLatest(getCertificateTypes.type, handleGetCertificateTypes)
  yield takeLatest(getPrimaryContractors.type, handleGetPrimaryContractors)
  yield takeLatest(searchPrimaryContractors.type, handleSearchPrimaryContractors)
  yield takeLatest(getTrainingTypes.type, handleGetTrainingTypes)
  yield takeLatest(getSchools.type, handleGetSchools)
  yield takeLatest(getJobTitles.type, handleGetJobTitles)
  yield takeLatest(getSkills.type, handleGetSkills)
  yield takeLatest(getBusinessTypes.type, handleGetBusinessTypes)
}
