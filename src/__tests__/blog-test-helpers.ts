import request from "supertest";
import { app } from "../settings";
import { BlogInputModel } from "../models/blogs/blogsInputModel";

export const createBlog = (data: BlogInputModel) => {
  return request(app).post("/blogs").auth("admin", "qwerty").send(data);
};
