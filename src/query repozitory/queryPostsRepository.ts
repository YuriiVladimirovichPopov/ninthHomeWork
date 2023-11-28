import { commentsCollection, postsCollection } from "../db/db";
import { CommentsMongoDbType, PostsMongoDbType } from "../types";
import { PaginatedType } from "../routers/helpers/pagination";
import { ObjectId, WithId, Filter } from "mongodb";
import { PaginatedPost } from "../models/posts/paginatedQueryPost";
import { PostsViewModel } from "../models/posts/postsViewModel";
import { PaginatedComment } from "../models/comments/paginatedQueryComment";

export const queryPostRepository = {
  _postMapper(post: PostsMongoDbType): PostsViewModel {
    return {
      id: post._id.toString(),
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: post.blogName,
      createdAt: post.createdAt,
    };
  },

  //3         READY
  async findAllPostsByBlogId(
    blogId: string,
    pagination: PaginatedType,
  ): Promise<PaginatedPost<PostsViewModel>> {
    const filter = { blogId };
    return this._findPostsByFilter(filter, pagination);
  },

  //8       меняем(добавляем пагинацию)  READY
  async findAllPosts(
    pagination: PaginatedType,
  ): Promise<PaginatedPost<PostsViewModel>> {
    const filter = {};
    return this._findPostsByFilter(filter, pagination);
  },

  async _findPostsByFilter(
    filter: Filter<PostsMongoDbType>,
    pagination: PaginatedType,
  ): Promise<PaginatedPost<PostsViewModel>> {
    const result: WithId<PostsMongoDbType>[] = await postsCollection
      .find(filter)
      .sort({ [pagination.sortBy]: pagination.sortDirection })
      .skip(pagination.skip)
      .limit(pagination.pageSize)
      .toArray();

    const totalCount: number = await postsCollection.countDocuments(filter);
    const pageCount: number = Math.ceil(totalCount / pagination.pageSize);

    return {
      pagesCount: pageCount,
      page: pagination.pageNumber,
      pageSize: pagination.pageSize,
      totalCount: totalCount,
      items: result.map((res) => this._postMapper(res)),
    };
  },

  async findPostById(id: string): Promise<PostsViewModel | null> {
    if (!ObjectId.isValid(id)) {
      return null;
    }
    const _id = new ObjectId(id);
    const findPost = await postsCollection.findOne({ _id: _id });
    if (!findPost) {
      return null;
    }
    return this._postMapper(findPost);
  },

  async findAllCommentsforPostId(
    pagination: PaginatedType,
  ): Promise<PaginatedComment<CommentsMongoDbType>> {
    const filter = {
      name: { $regex: pagination.searchNameTerm, $options: "i" },
    };
    const result: WithId<WithId<CommentsMongoDbType>>[] =
      await commentsCollection
        .find(filter)

        .sort({ [pagination.sortBy]: pagination.sortDirection })
        .skip(pagination.skip)
        .limit(pagination.pageSize)
        .toArray();
    const totalCount: number = await commentsCollection.countDocuments(filter);
    const pageCount: number = Math.ceil(totalCount / pagination.pageSize);

    return {
      pagesCount: pageCount,
      page: pagination.pageNumber,
      pageSize: pagination.pageSize,
      totalCount: totalCount,
      items: result,
    };
  },
};
