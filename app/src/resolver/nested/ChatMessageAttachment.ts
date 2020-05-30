
import { ChatMessageAttachmentResolvers } from '../../generated/graphqlgen';
import { Context } from '../../types';

export const ChatMessageAttachment: ChatMessageAttachmentResolvers.Type = {
  ...ChatMessageAttachmentResolvers.defaultResolvers,

  calendarEntry: async (parent, _args, ctx: Context) => {
    return ctx.db.chatMessageAttachment({ id: parent.id }).calendarEntry();
  },
  chatMessage: async (parent, _args, ctx: Context) => {
    return ctx.db.chatMessageAttachment({ id: parent.id }).chatMessage();
  }
};
