import { render } from "@react-email/components";
import { Resend } from "resend";

import { config } from "../utils/env.js";
import { logger } from "../utils/logger.js";
import ResetPassword from "./components/reset-password.js";
import VerifyEmail from "./components/verify-email.js";

const resend = new Resend(config.resendApiKey);

export const sendVerificationEmail = async (to: string, token: string) => {
  const url = `${config.frontendUrl}/verify-email?token=${token}`;

  try {
    const html = await render(VerifyEmail({ url, firstName: "there" }));
    const text = await render(VerifyEmail({ url, firstName: "there" }), {
      plainText: true,
    });

    await resend.emails.send({
      from: config.emailFrom,
      to,
      subject: "Verify your email address",
      html,
      text,
    });
  } catch (error: any) {
    logger.error("Resend verification email failed", {
      error: error.message || error,
      stack: error.stack,
      to,
    });
    throw error;
  }
};

export const sendResetPasswordEmail = async (to: string, token: string) => {
  const url = `${config.frontendUrl}/reset-password?token=${token}`;

  try {
    const html = await render(ResetPassword({ url, firstName: "there" }));
    const text = await render(ResetPassword({ url, firstName: "there" }), {
      plainText: true,
    });

    await resend.emails.send({
      from: config.emailFrom,
      to,
      subject: "Reset your password",
      html,
      text,
    });
  } catch (error) {
    logger.error("Resend password reset email failed", { error, to });
    throw error;
  }
};
