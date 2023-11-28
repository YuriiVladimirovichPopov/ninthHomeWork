import jwt from "jsonwebtoken";
import { settings } from "../settings";
import { UsersMongoDbType } from "../types";

export const jwtService = {
  async createJWT(user: UsersMongoDbType) {
    const token = jwt.sign({ userId: user._id }, settings.accessTokenSecret1, {
      expiresIn: "10sec",
    });
    return token;
  },

  async getUserIdByToken(token: string): Promise<string | null> {
    try {
      const result: any = jwt.verify(token, settings.accessTokenSecret1);
      return result.userId;
    } catch (error) {
      return null;
    }
  },

  async createRefreshToken(userId: string, deviceId: string) {
    const refToken = jwt.sign(
      { userId, deviceId },
      settings.refreshTokenSecret2,
      { expiresIn: "20sec" },
    );
    return refToken;
  },

  async getLastActiveDate(token: string) {
    const result: any = jwt.decode(token);
    return new Date(result.iat * 1000).toISOString();
  },
};
