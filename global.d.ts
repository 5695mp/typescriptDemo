declare module '*.jpg'
declare module '*.jpeg'
declare module '*.png'

declare module '*.ttf'

type valueof<T> = T[keyof T]

interface APIRes {
  results: any[]
  currentPage: number
  totalPages: number
}

interface GoogleSuccessLogIn {
  type: 'success'
  accessToken: string | null
  idToken: string | null
  refreshToken: string | null
  user: GoogleUser
}

interface ApiResUser {
  id: number
  cognitoUserId: string
  role: string
  about?: string
  username: string
  email: string
  firstName?: any
  lastName?: any
  companyName?: any
  companySize?: any
  phoneNumber?: any
  profilePicture?: any
  identities: string
  phoneNumberVerified: boolean
  emailVerified: boolean
  isDeleted: boolean
  jobTitleId?: any
  location?: any
  latitude?: any
  longitude?: any
  city?: any
  recentCompany?: any
  createdAt: Date
  updatedAt: Date
  JobTitle?: JobTitleItem | null
  UserTags: { id: number; tagName: string }[]
  PreferredProjectTypes: { id: number; projectType: number; userId: number }[]
  map_displayed_to_user: boolean
  sms_notifications: boolean
  email_social: boolean
  email_message: boolean
  email_project: boolean
  email_marketing: boolean
  email_account: boolean
  email_company: boolean
  push_social: boolean
  push_message: boolean
  push_project: boolean
  push_marketing: boolean
  push_account: boolean
  push_company: boolean
  sms_social: boolean
  sms_message: boolean
  sms_project: boolean
  sms_marketing: boolean
  sms_account: boolean
  sms_company: boolean
  is_apprentice: boolean
  open_to_work: boolean
  onBoarding: boolean
  followProjectCount: number
  followingCount: number
  followersCount: number
  followTagCount: number
  signupType: 'SOCIAL' | 'CUSTOM'
  communicationEmail: string | null
  communicationPhone: string | null
  UserPreferredLocations: {
    Location: { createdAt: Date; id: number; latitude: string; longitude: string; name: string; updatedAt: Date }
    id: number
    locationId: number
    userId: number
  }[]
  professionalLevel: string
  follower: {
    id: number
    senderId: number
    targetId: number
  }[]
  isVerified: boolean
  businessTypeId?: string
  BusinessType?: {
    name: string
  }
  is_hiring?: boolean
  addressLine1?: string
  addressLine2?: string
  url?: string
  taxId?: string
  verificationRequest?: number
  publicEmail?: string
  publicPhone?: any
}

interface User extends ApiResUser {
  token?: string
}

type State = Record<string, string | number>
type City = Record<string, string | number>
type TradeTag = { value: string; label: string }
type TradeTagRecent = {
  id: string
  name: string
  date: string
}

type TradeItem = { id: number; name: string; post_count: number }

interface ProjectCity {
  id: number
  city: string
}

interface ProjectState {
  id: number
  stateCode: string
  stateName: string
}

interface Project {
  id: number
  projectName: string
  projectType: number
  projectStreetAddress: string
  unitOrApartment: string
  latitude: string
  longitude: string
  primaryContractorId: number
  startDate: string
  endDate: string
  isCurrent: boolean
  projectStartDate: string
  projectEndDate: string
  projectIsCurrent: boolean
  addressType: number
  enablePostTag: boolean
  isDeleted: boolean
  City: ProjectCity
  State: ProjectState
  companyName: string
  city: string
  mainProjectMedia?: string
  isHiringModeOn: boolean
  distance: number
  projectDetails: string
  primaryContractor: {
    id: number
    profilePicture?: any
    companyName: string
    email: string
    phoneNumber?: any
    city?: any
    location?: any
    communicationEmail?: any
    communicationPhone?: any
    signupType: string
    latitude?: any
    longitude?: any
    JobTitle?: any
  }
  Posts: {
    id: number
    postId: number
    mediatype: number
    fileName: number
    fileNameHls: number
    sequence: number
    mediacount: number
    userId: number
    projectId: number
    comment: string
    location: string
    latitude: string
    longitude: string
    type: number
    isDeleted: number
    city: string
    createdAt: Date
    updatedAt: Date
    PostMedia: {
      id: number
      postId: number
      fileName: string
      type: number
    }[]
  }[]
  FollowProjects: {
    id: number
    projectId: number
    userId: number
  }[]
  followingWorkOnSameProject: any[]
  owner: {
    id: number
    userId: number
  }
  ProjectUsers: {
    id: number
    userId: number
    projectId: number
    startDate: string
    endDate: string
    isCurrent: boolean
    isOwner: boolean
    createdAt: string
    updatedAt: string
  }
}

type PostMediaType = 'image' | 'video'
interface Post {
  id: number
  media: ApiPostMedia[]
  createdAt?: Date
}
interface ApiPost {
  id: number
  userId: number
  projectId: number
  comment: string
  location: string
  latitude: string
  longitude: string
  type: number
  isDeleted: number
  city: string
  createdAt: Date
  updatedAt: Date
  PostTags: {
    id: number
    postId: number
    tagName: string
  }[]
  owner: {
    id: number
    firstName: string
    lastName: string
    role: string
    companyName?: any
    email: string
    phoneNumber: string
    city?: any
    location?: any
    profilePicture: string
  }
  UserPostTags: {
    id: number
    postId: number
    userId: number
    User: {
      id: number
      firstName: string
      lastName: string
      role: string
      companyName: string
      email: string
      phoneNumber?: any
      city: string
      location: string
      profilePicture: string
    }
  }[]
  PostMedia: {
    id: number
    postId: number
    fileName: string
    fileNameHls: string
    type: number
  }[]
  Project?: {
    owner: {
      userId: number
    }
    primaryContractor: {
      id: number
    }
    primaryContractorId?: number
    projectName?: string
    mainProjectMedia?: string
    projectStreetAddress?: string
  }
}

interface ProjectTagged {
  owner: {
    userId: number
  }
  primaryContractor: {
    id: number
  }
  primaryContractorId?: number
  projectName?: string
  mainProjectMedia?: string
}

interface UserPostTags {
  id: number
  postId: number
  userId: number
  User: {
    id: number
    firstName: string
    lastName: string
    role: string
    companyName: string
    email: string
    phoneNumber?: any
    city: string
    location: string
    profilePicture: string
  }
}

interface User {
  communicationEmail: string
  communicationPhone: string
  companyName?: any
  email: string

  firstName: string
  id: number
  lastName: string
  location: string
  phoneNumber: string
  profilePicture?: string
  role: string
  signupType: string
}

interface PostComment {
  User: User
  comment: string
  createdAt: Date
  id: number
  postId: number
  updatedAt: Date
  userId: number
}

interface PostLike {
  User: User
  createdAt: Date
  id: number
  postId: number
  updatedAt: Date
  userId: number
}

interface ApiPostWithLikeComment extends ApiPost {
  likes: PostLike[]
  liked: PostLike[]
  comments: PostComment[]
  likes_count: string
  comment_count: string
  hideFromProject?: boolean
}

interface Certificate {
  id: number
  userId: number
  certificateType: number
  isExpire: number
  expirationDate: string
  frontImage: string
  backImage: string
  isVerified: number
  isDeleted: number
  createdAt: Date
  updatedAt: Date
  CertificateType: CertificateType
  certificateName: string
  certificateSubName: string
  certificateHour: string
  Certificate?: {
    certificateHour: string
    certificateName: string
    mainCertificateName: string
  }
}

interface CertificateType {
  id: number
  name: string
}

interface TimelineProject {
  id: number
  userId: number
  projectId: number
  startDate: string
  endDate: string
  isCurrent: boolean
  isOwner: boolean
  createdAt: Date
  updatedAt: Date
  Project: Project
}

interface ApiTrainingTypeItem {
  id: number
  name: string
  isDeleted: number
  createdAt: Date
  updatedAt: Date
}

interface ApiSchoolItem {
  id: number
  name: string
  isDeleted: number
  createdAt: Date
  updatedAt: Date
}

interface ApiSkill {
  id: number
  userId: number
  skillName: string
  createdAt: Date
  updatedAt: Date
  endorse: any[]
  skill_endorse_count: any
  loginUserEndorse: {
    createdAt: Date
    id: number
    endorserId: number
    updatedAt: Date
    userSkillId: number
  }
}

interface TrainingItem {
  id: number
  userId: number
  schoolId: number
  trainingId: number
  isCurrent: number
  startDate: Date
  expirationDate?: any
  isDeleted: number
  createdAt: Date
  updatedAt: Date
  TrainingType: {
    id: number
    name: string
  }
  school: {
    id: number
    name: string
    trainees: TraineeItem[]
  }
}

interface ApiEmployerItem {
  id: number
  employerId: number
  userId: number
  startDate: Date
  endDate?: any
  isCurrent: number
  location: string
  latitude: string
  longitude: string
  city: string
  state: string
  isDeleted: number
  createdAt: Date
  updatedAt: Date
  employer: {
    id: number
    profilePicture: string
    companyName: string
    email: string
    phoneNumber?: any
    city: string
    location: string
    communicationEmail?: any
    communicationPhone?: any
    signupType: string
    latitude: string
    longitude: string
    workers: {
      id: number
      employerId: number
      userId: number
      startDate: Date
      endDate?: Date
      isCurrent: number
      location: string
      latitude: string
      longitude: string
      city: string
      state: string
      isDeleted: number
      createdAt: Date
      updatedAt: Date
      user: {
        id: number
        firstName: string
        lastName: string
        role: string
        companyName?: any
        email: string
        phoneNumber?: any
        communicationEmail?: any
        communicationPhone?: any
        signupType: string
        location: string
        city: string
        profilePicture?: any
        JobTitle: { title: string }
      }
    }[]
  }
  coworkers: {
    count: number
    rows: {
      id: number
      profilePicture: string
    }[]
  }
}

interface JobTitleItem {
  id: number
  title: string
  ownerId: number
  createdAt: Date
  updatedAt: Date
}

interface BusinessTypeItem {
  id: number
  name: string
  createdAt: Date
  updatedAt: Date
}

interface UserFollow {
  communicationEmail: string
  communicationPhone: string
  companyName?: any
  email: string
  firstName: string
  id: number
  lastName: string
  location: string
  phoneNumber: string
  profilePicture: string
  role: string
  signupType: string
  JobTitle: {
    title: string
  }
  city: string
  loginfollow: {
    id: number
    senderId: number
    targetId: number
  }[]
}

interface UserFollowingFollowerItem {
  createdAt: Date
  follower: UserFollow
  following: UserFollow
  id: number
  senderId: number
  targetId: number
  updatedAt: Date
}

interface TraineeItem {
  createdAt: Date
  expirationDate: Date
  id: number
  isCurrent: number
  isDeleted: number
  schoolId: number
  startDate: Date
  trainingId: number
  updatedAt: Date
  userId: number

  user: {
    id: number
    firstName: string
    lastName: string
    role: string
    companyName?: any
    email: string
    phoneNumber: string
    communicationEmail?: any
    communicationPhone?: any
    signupType: string
    location: string
    city: string
    profilePicture: string
    JobTitle: {
      title: string
    }
    professionalLevel: string
    follower: {
      createdAt: Date
      id: number
      senderId: number
      targetId: number
      updatedAt: Date
    }[]
  }
}

interface EndorseItem {
  createdAt: Date
  id: number
  endorserId: number
  updatedAt: Date
  userSkillId: number

  endorser: {
    id: number
    firstName: string
    lastName: string
    role: string
    companyName?: any
    email: string
    phoneNumber: string
    communicationEmail?: any
    communicationPhone?: any
    signupType: string
    location: string
    city: string
    profilePicture: string
    JobTitle: {
      title: string
    }
    professionalLevel: string
    follower: {
      createdAt: Date
      id: number
      senderId: number
      targetId: number
      updatedAt: Date
    }[]
  }
}

interface FollowingTagItem {
  loginfollow: {
    id: number
    userId: number
  }
  id: number
  userId: number
  tagName: string
  createdAt: Date
  updatedAt: Date
  post_count: number
}

interface FollowProjectItem {
  id: number
  userId: number
  projectId: number
  createdAt: Date
  updatedAt: Date
  isOwner?: boolean
  Project: {
    id: number
    projectName: string
    projectType: number
    projectStreetAddress: string
    unitOrApartment: string
    city: string
    latitude: string
    longitude: string
    primaryContractorId: number
    addressType: number
    isDeleted: boolean
    mainProjectMedia?: any
    projectStartDate: Date
    projectEndDate: Date
    projectIsCurrent: boolean
    projectDetails: string
    isHiringModeOn: boolean
    createdAt: Date
    updatedAt: Date
    primaryContractor: {
      id: number
      profilePicture?: any
      companyName: string
      email: string
      phoneNumber?: any
      city?: any
      location?: any
      communicationEmail?: any
      communicationPhone?: any
      signupType: string
      latitude?: any
      longitude?: any
      JobTitle?: any
    }
    projectfollow: {
      id: number
      userId: number
    }
    owner: {
      userId: number
    }
  }
}

interface Worker {
  id: number
  employerId: number
  userId: number
  startDate: Date
  endDate?: Date
  isCurrent: number
  location: string
  latitude: string
  longitude: string
  city: string
  state: string
  isDeleted: number
  createdAt: Date
  updatedAt: Date
  user: {
    id: number
    firstName: string
    lastName: string
    role: string
    companyName?: any
    email: string
    phoneNumber?: any
    communicationEmail?: any
    communicationPhone?: any
    signupType: string
    location: string
    city: string
    profilePicture?: any
    JobTitle: { title: string }
  }
}

type PostTabType = 'posts' | 'tagged-posts' | 'city' | 'trade'

interface Place {
  location?: string
  latitude?: string
  longitude?: string
  locationId?: string
  city?: string
}

interface SelectionItem {
  value: string
  label: string
  selected?: boolean
}

interface TellUsInfo {
  init?: boolean
  jobTitleId?: string
  professionalLevel?: string
  tags?: string[]
  about?: string
  profilePicture?: string
  // These fields for current location
  locationId?: string
  location?: string
  longitude?: string
  latitude?: string
  city?: string
  /// ////
  open_to_work?: boolean = true
  preferredProjectType?: string[]
  projectLocation?: Place[]

  // employers //
  companyName?: string
  businessTypeId?: string
  onBoarding?: boolean
  firstName?: string
  lastName?: string
  addressLine1?: string
  addressLine2?: string
  url?: string
  is_hiring?: boolean = true
  taxId?: string
  preferredEmployeeTrades?: string[]
}

interface MatchSearchItem {
  count: number
  value: string
}
interface ApiResUserWithMatchSearch extends ApiResUser {
  searchMatch: {
    JobTitle?: MatchSearchItem
    BusinessType?: MatchSearchItem
    UserTags?: MatchSearchItem
    Skill?: MatchSearchItem
    Training?: MatchSearchItem
    Certificates?: MatchSearchItem
    employers?: MatchSearchItem
    Posts?: MatchSearchItem
  }
}
interface ProjectWithMatchSearch extends Project {
  searchMatch: {
    JobTitle?: MatchSearchItem
    BusinessType?: MatchSearchItem
    UserTags?: MatchSearchItem
    Skill?: MatchSearchItem
    Training?: MatchSearchItem
    Certificates?: MatchSearchItem
    employers?: MatchSearchItem
    Posts?: MatchSearchItem
  }
}
interface PopularTradeTag {
  id: number
  name: string
  followers: string
  createdAt: Date
  updatedAt: Date
}

interface TopUser {
  BusinessType: { name: string }
  firstName: string
  lastName: string
  profilePicture: string
  id: number
  JobTitle: { title: string }
  companyName: string
  location: string
}

interface TradeTagSearch extends TradeItem {
  UserFollowTags: {
    id: number
    userId: number
  }[]
}

interface Employee {
  id: number
  userId: number
  city: string
  state: string
  employerId: number
  endDate: Date
  startDate: Date
  isCurrent: boolean
  isDeleted: number
  location: string
  latitude: string
  longitude: string
  city: string
  createdAt: Date
  updatedAt: Date
  people: {
    firstName: string
    follower: {
      createdAt: Date
      id: number
      senderId: number
      targetId: number
      updatedAt: Date
    }[]
    id: number
    lastName: string
    JobTitle?: JobTitleItem | null
    profilePicture?: any
    city: string
    location: string
  }[]
}
interface Notification {
  id: number
  senderId: number
  receiverId: number
  modelId: number
  action: string
  pushNotificationTextId: number
  isViewed: number
  type: number
  sender: User
  receiver: User
  InAppNotificationText: {
    id: number
    text: string
    action: string
    createdAt: string
    updatedAt: string
  }
  text: string
  createdAt: string
  updatedAt: string
  status: NotificationStatus
  sender: ApiResUser
  Post?: {
    id: number
    userId: number
    projectId: number
    comment: string
    location: string
    latitude: string
    longitude: string
    type: number
    isDeleted: number
    city: string
    createdAt: Date
    updatedAt: Date
    PostMedia: {
      id: number
      postId: number
      fileName: string
      type: number
    }[]
  }
  Project?: {
    id: number
    projectName: string
    projectType: number
    projectStreetAddress: string
    unitOrApartment: string
    city: string
    mainProjectMedia: string | null
  }
}

interface ChatMember {
  User: ApiResUser
  conversationId: number
  conversationMemberSid: string
  conversationSid: string
  createdAt: string
  id: number
  isAdmin: number
  isDeleted: number
  isNotify: number
  updatedAt: string
  userId: number
  userSid: string
  isHidden: number
}
interface ConversationApiRes {
  ConversationMembers?: ChatMember[]
  conversationAttributes: string
  conversationName: string
  conversationSid: string
  conversationType: number
  createdAt: string
  groupAdminSid?: null
  groupAdminUserId?: string
  id: number
  isDeleted: number
  lastMessage?: string
  lastMessageAt?: string
  lastMessageSid?: string
  lastMessageUserId?: number
  mediaContentType?: string
  mediaFileName?: string
  mediaSid?: string
  mediaSize?: string
  members?: ChatMember[]
  messageAttributes?: string
  messageType?: number
  source: string
  updatedAt: string
  createdAt: string
}

type GetProjectType = 'all' | 'recommend'
