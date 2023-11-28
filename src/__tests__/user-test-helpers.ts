import request from "supertest";
import { app } from "../settings";

//todo type in params

export const createUser = async (data: any) => {
  return request(app).post("/users").auth("admin", "qwerty").send(data);
};
