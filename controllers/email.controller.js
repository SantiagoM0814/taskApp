import transporter from '../config/email/emailConfig.js';
import { fileURLToPath } from 'url';
import path from 'path';
import ejs from 'ejs';

const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

class EmailController {
    /**
     * Send an email using the provided options.
     * @param {Object} options -{to, subject, template, data, attachments}
     */

    static async sendEmail(options) {
        try {
            const { to, subject, template, data, attachments } = options;

            const html = template
                ? await ejs.renderFile(
                    path.join(_dirname, `../views/emails/${template}.ejs`),
                    data
                )
                : options.html;

            const mailOptions = {
                from: `"My App" <${process.env.EMAIL_USER}>`,
                to,
                subject,
                html: html || '<p>Email sended successfully!</p>',
                attachments,
            };

            const info = await transporter.sendMail(mailOptions);
            console.log('Sent succeclly:', info.messageId);
            return info;
        } catch (error) {
            console.error('Error in sendEmail:', error);
            throw new Error('Failed to send Email');
        }
    }

    static async sendWelcomeEmail(user) {
        return this.sendEmail({
            to: user.email,
            subject: 'Welcome to My App',
            template: 'welcome-email',
            data: { name: user.name },
        });
    }

    static async sendPasswordReset(user, resetLink) {
        return this.sendEmail({
            to: user.email,
            subject: 'Change Password',
            template: 'reset-password',
            data: { name: user.name, resetLink },
        });
    }
}

export default EmailController;