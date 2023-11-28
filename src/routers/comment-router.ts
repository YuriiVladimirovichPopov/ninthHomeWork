import { Request, Response, Router } from "express";
import { authMiddleware } from "../middlewares/validations/auth.validation";
import { commentsQueryRepository } from "../query repozitory/queryCommentsRepository";
import { commentsRepository } from "../repositories/comments-repository";
import { sendStatus } from "./send-status";
import { createPostValidationForComment } from "../middlewares/validations/comments.validation";

export const commentsRouter = Router({});

commentsRouter.get("/:commentId", async (req: Request, res: Response) => {
  const foundComment = await commentsQueryRepository.findCommentById(
    req.params.commentId,
  );
  if (foundComment) {
    return res.status(sendStatus.OK_200).send(foundComment);
  } else {
    return res.sendStatus(sendStatus.NOT_FOUND_404);
  }
});

commentsRouter.put(
  "/:commentId",
  authMiddleware,
  createPostValidationForComment,
  async (req: Request, res: Response) => {
    const user = req.user!;
    const commentId = req.params.commentId;
    const existingComment =
      await commentsQueryRepository.findCommentById(commentId);
    if (!existingComment) {
      return res.sendStatus(sendStatus.NOT_FOUND_404);
    }

    if (existingComment.commentatorInfo.userId !== user.id) {
      return res.sendStatus(sendStatus.FORBIDDEN_403);
    }

    const updateComment = await commentsRepository.updateComment(
      commentId,
      req.body.content,
    );

    if (updateComment) {
      return res.sendStatus(sendStatus.NO_CONTENT_204);
    }
  },
);

commentsRouter.delete(
  "/:commentId",
  authMiddleware,
  async (
    req: Request<{ commentId: string }, {}, {}, {}, { user: string }>,
    res: Response,
  ) => {
    const user = req.user!;
    const commentId = req.params.commentId;

    const comment = await commentsQueryRepository.findCommentById(commentId);
    if (!comment) {
      return res.sendStatus(sendStatus.NOT_FOUND_404);
    }
    const commentUserId = comment.commentatorInfo.userId;
    if (commentUserId !== user.id) {
      return res.sendStatus(sendStatus.FORBIDDEN_403);
    }
    const commentDelete = await commentsRepository.deleteComment(
      req.params.commentId,
    );
    if (commentDelete) {
      return res.sendStatus(sendStatus.NO_CONTENT_204);
    }
  },
);
