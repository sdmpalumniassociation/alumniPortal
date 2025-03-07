const User = require('../models/User');
const { sendEmail } = require('../services/emailService');

const broadcastController = {
    sendBroadcastEmail: async (req, res) => {
        try {
            const { subject, message, groups, customEmails } = req.body;

            let recipients = [];

            // If alumni group is selected, get all alumni with their names and emails
            if (groups.includes('alumni')) {
                const alumniUsers = await User.find({ role: 'alumni' }, 'email fullName');
                recipients = [...recipients, ...alumniUsers.map(user => ({
                    email: user.email,
                    name: user.fullName
                }))];
            }

            // Add custom emails if provided
            if (groups.includes('custom') && customEmails && customEmails.length > 0) {
                const customRecipients = customEmails.map(email => ({
                    email: email.trim(),
                    name: null // Custom emails won't have names
                }));
                recipients = [...recipients, ...customRecipients];
            }

            // Remove duplicates based on email
            recipients = Array.from(new Map(recipients.map(item => [item.email, item])).values());

            if (recipients.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'No recipients selected'
                });
            }

            // Send emails in batches of 50 to avoid overloading
            const batchSize = 50;
            for (let i = 0; i < recipients.length; i += batchSize) {
                const batch = recipients.slice(i, i + batchSize);
                await Promise.all(batch.map(recipient =>
                    sendEmail(recipient.email, 'broadcast', {
                        subject,
                        message,
                        recipientName: recipient.name
                    })
                ));
            }

            res.json({
                success: true,
                message: `Broadcast email sent successfully to ${recipients.length} recipients`
            });

        } catch (error) {
            console.error('Broadcast email error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to send broadcast email',
                error: error.message
            });
        }
    }
};

module.exports = broadcastController; 