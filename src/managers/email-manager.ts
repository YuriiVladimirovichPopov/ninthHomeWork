import { emailAdapter } from "../adapters/email-adapter";

export const emailManager = {
  async sendEmail(email: string, code: string) {
    return emailAdapter.sendEmail(email, "code", code);
  },
};
