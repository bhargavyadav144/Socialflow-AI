import smtplib
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.config import settings

logger = logging.getLogger("socialflow.email")

class EmailService:
    def send_otp_email(self, to_email: str, otp_code: str, is_reset: bool = False) -> bool:
        """
        Sends an HTML email with the 6-digit OTP code using SMTP.
        If SMTP credentials are not configured, it logs the OTP gracefully for development.
        """
        subject = f"Your SocialFlow AI Verification Code: {otp_code}" if not is_reset else f"SocialFlow AI Password Reset Code: {otp_code}"
        
        html_body = f"""
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0b0f19; color: #f8fafc; padding: 20px; }}
            .container {{ max-width: 500px; margin: 0 auto; background: #0f172a; border: 1px solid #334155; border-radius: 16px; padding: 30px; text-align: center; }}
            .logo {{ font-size: 24px; font-weight: 800; color: #a855f7; margin-bottom: 10px; }}
            .title {{ font-size: 18px; color: #ffffff; margin-bottom: 20px; }}
            .otp-box {{ background: #1e1b4b; border: 1px border #6366f1; font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #38bdf8; padding: 15px 30px; border-radius: 12px; display: inline-block; margin: 20px 0; }}
            .footer {{ font-size: 12px; color: #64748b; margin-top: 25px; border-top: 1px solid #1e293b; padding-top: 15px; }}
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">SocialFlow AI</div>
            <div class="title">{"Password Reset Verification" if is_reset else "Email Verification Code"}</div>
            <p style="color: #94a3b8; font-size: 14px;">Use the following 6-digit OTP code to complete your verification. This code is valid for 10 minutes.</p>
            
            <div class="otp-box">{otp_code}</div>
            
            <p style="color: #64748b; font-size: 12px;">If you did not request this verification, please ignore this email.</p>
            
            <div class="footer">
              &copy; 2026 SocialFlow AI. Vectorize Hindsight Persistent Agent Memory OS.
            </div>
          </div>
        </body>
        </html>
        """

        if not settings.SMTP_USERNAME or not settings.SMTP_PASSWORD:
            logger.info(f"[DEV MODE] Real SMTP credentials not configured. OTP for {to_email}: {otp_code}")
            return False

        try:
            msg = MIMEMultipart("alternative")
            msg["Subject"] = subject
            msg["From"] = f"{settings.EMAILS_FROM_NAME} <{settings.EMAILS_FROM_EMAIL}>"
            msg["To"] = to_email

            part = MIMEText(html_body, "html")
            msg.attach(part)

            with smtplib.SMTP(settings.SMTP_SERVER, settings.SMTP_PORT, timeout=10) as server:
                server.starttls()
                server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
                server.sendmail(settings.EMAILS_FROM_EMAIL, to_email, msg.as_string())

            logger.info(f"✅ Real OTP email successfully sent to {to_email}")
            return True
        except Exception as e:
            logger.error(f"❌ Failed to send real email to {to_email}: {e}")
            return False

email_service = EmailService()
