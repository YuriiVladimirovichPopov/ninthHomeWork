import { ObjectId } from "mongodb";
import { commentsCollection } from "../db/db";
import { PaginatedType } from "../routers/helpers/pagination";
import { PaginatedComment } from "../models/comments/paginatedQueryComment";
import { CommentsMongoDbType } from "../types";
import { CommentViewModel } from "../models/comments/commentViewModel";

export const commentsQueryRepository = {
  async getAllCommentsForPost(
    postId: string,
    pagination: PaginatedType,
  ): Promise<PaginatedComment<CommentViewModel>> {
    const result = await commentsCollection
      .find({ postId: postId })
      .sort({ [pagination.sortBy]: pagination.sortDirection })
      .skip(pagination.skip)
      .limit(pagination.pageSize)
      .toArray();

    const mappedComments: CommentViewModel[] = result.map(
      (el: CommentsMongoDbType): CommentViewModel => ({
        id: el._id.toString(),
        content: el.content,
        commentatorInfo: el.commentatorInfo,
        createdAt: el.createdAt,
      }),
    );
    const totalCount: number = await commentsCollection.countDocuments({
      postId,
    });
    const pageCount: number = Math.ceil(totalCount / pagination.pageSize);

    const response: PaginatedComment<CommentViewModel> = {
      pagesCount: pageCount,
      page: pagination.pageNumber,
      pageSize: pagination.pageSize,
      totalCount: totalCount,
      items: mappedComments,
    };
    return response;
  },

  async findCommentById(id: string): Promise<CommentViewModel | null> {
    const comment: CommentsMongoDbType | null =
      await commentsCollection.findOne({ _id: new ObjectId(id) });
    if (!comment) return null;
    return {
      id: comment._id.toString(),
      commentatorInfo: comment.commentatorInfo,
      content: comment.content,
      createdAt: comment.createdAt,
    };
  },
};
