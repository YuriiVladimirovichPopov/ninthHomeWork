import { WithId, ObjectId } from "mongodb";
import { commentsCollection } from "../db/db";
import { PaginatedType } from "../routers/helpers/pagination";
import { PaginatedComment } from "../models/comments/paginatedQueryComment";
import { CommentsMongoDbType } from "../types";

export const commentsRepository = {
  async deleteAllComment(): Promise<boolean> {
    const result = await commentsCollection.deleteMany({});
    return result.acknowledged === true;
  },

  async updateComment(
    commentId: string,
    content: string,
  ): Promise<CommentsMongoDbType | undefined | boolean> {
    const filter = { _id: new ObjectId(commentId) };
    let foundComment = await commentsCollection.findOne(filter);
    if (foundComment) {
      const result = await commentsCollection.updateOne(filter, {
        $set: { content: content },
      });
      return result.matchedCount === 1;
    }
  },

  async deleteComment(commentId: string) {
    const result = await commentsCollection.deleteOne({
      _id: new ObjectId(commentId),
    });
    return result.deletedCount === 1;
  },
};
