import React, { useEffect, useMemo, useState } from 'react'
import { isJobSeeker } from '@utils/accountHelpers'
import { useSelector } from 'react-redux'
import { RootState } from '@redux/store'
import { View } from 'react-native'
import JobSeekerHeader from '../JobSeekerHeader'
import EmployerHeader from '../EmployerHeader'
import GroupHeader from '../GroupHeader'
import { EventRegister } from 'react-native-event-listeners'

interface CProps {
  members: ChatMember[]
  item: any
  onGoToSettings: () => void
  newMembersCount?: number
}

const ConversationHeader = ({ members, item, onGoToSettings, newMembersCount }: CProps) => {
  const [conversationMember, setConversationMember] = useState(members)

  const onAddMembersSuccess = (users: ChatMember[]) => {
    setConversationMember((prev) => [...prev,...users])
  }

  useEffect(() => {
    const onAddMembers = EventRegister.addEventListener('AddMembers', onAddMembersSuccess)

    return () => {
      EventRegister.removeEventListener(`${onAddMembers}`)
    }
  }, [])

  const loggedInUser = useSelector((state: RootState) => state.auth.user) as User
  const otherMembers = useMemo(() => {
    return conversationMember.filter((member) => member?.User?.cognitoUserId != loggedInUser.cognitoUserId && member?.isHidden < 1)
  }, [conversationMember, loggedInUser])
  if (otherMembers.length == 1) {
    const member = otherMembers[0]
    if (isJobSeeker(member.User as User)) {
      return <JobSeekerHeader user={member.User as User} />
    } else {
      return <EmployerHeader user={member.User as User} />
    }
  } else if (otherMembers.length == 0) {
    return <JobSeekerHeader  user={null} />
  } else {
    return <GroupHeader onGoToSettings={onGoToSettings} users={otherMembers} item={item} newMembersCount={newMembersCount} />
  }
}

export default ConversationHeader
