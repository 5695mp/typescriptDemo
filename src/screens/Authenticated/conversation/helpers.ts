import { Message } from "@twilio/conversations"

export const getMediaData = async (message: Message) => {
  let media = {}
  if (message.media) {
    const url = await message.media.getCachedTemporaryUrl()
    if (message.media.contentType.includes('image')) {
      media = {
        image: url
      }
    } else {
      media = {
        video: url
      }
    }
  }
  return media
}