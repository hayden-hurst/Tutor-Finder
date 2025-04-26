const nodemailer = require('nodemailer');
require('dotenv').config()

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // uses google app password for access
    },
});

async function sendAppointmentConfirmation({ tutorEmail, studentEmail, date, time, duration, locationType, locationDetails }) {
    // send email to student
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: studentEmail,
        subject: 'Tutoring Appointment Confirmation',
        text: `
       Hello student,
      
       You have scheduled a tutoring appointment for ${date} at ${time}. Here are some additional meeting details:
       - Meeting Duration:  ${duration} mins.
       - Location: ${locationType}. ${locationDetails}
      
       If you have scheduled an online session a meeting link will be provided by your tutor the day of the appointment.
       If you need to cancel, reschedule, or have other questions email your tutor via ${tutorEmail}. Please make sure to contact them at least 24 hours prior to the meeting time.
      
       Thanks,
       TutorFinder
       `,
        html: `
       <div style="font-family: system-ui, sans-serif, Arial; font-size: 16px;">
       <p>Hello student,</p>
       <p>You have scheduled a tutoring appointment for <strong>${date}</strong> at <strong>${time}</strong>. Here are some additional meeting details:</p>
       <ul>
         <li>Meeting Duration: <strong>${duration}</strong> mins.</li>
         <li>Meeting Location: <strong>${locationType}. ${locationDetails}</strong></li>
       </ul>
       <p>If you have scheduled an online session a meeting link will be provided by your tutor the day of the appointment.</p>
       <p>If you need to cancel, reschedule, or have other questions email your tutor via <strong>${tutorEmail}</strong>. Please make sure to contact them at least 24 hours prior to the meeting time.</p>
       <p>Thanks,<br><strong>TutorFinder</strong></p>
       </div>
       `,
    });

    // send email to tutor
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: tutorEmail,
        subject: 'New Tutoring Appointment',
        text: `
       Hello tutor,
      
       A student has scheduled an appointment with you. Meeting details and contact information:
       - Student Email: ${studentEmail}
       - Date: ${date}
       - Time: ${time}
       - Meeting Duration: ${duration} mins.
       - Location: ${locationType}. ${locationDetails}
      
       If an online meeting has been requested make sure to follow up with them and send a meeting link before the time of the appointment.
      
       Thanks,
       TutorFinder
       `,
        html: `
       <div style="font-family: system-ui, sans-serif, Arial; font-size: 16px;">
       <p>Hello tutor,</p>
       <p>A student has scheduled an appointment with you. Meeting details and contact information:</p>
       <ul>
         <li>Student Email: <strong>${studentEmail}</strong></li>
         <li>Date: <strong>${date}</strong></li>
         <li>Time: <strong>${time}</strong></li>
         <li>Meeting Duration: <strong>${duration}</strong> mins.</li>
         <li>Meeting Location: <strong>${locationType}. ${locationDetails}</strong></li>
       </ul>
       <p>If an online meeting has been requested, make sure to follow up with them and send a meeting link before the time of the appointment.</p>
       <p>Thanks,<br><strong>TutorFinder</strong></p>
       </div>
       `,
    });
}

async function sendUpdateAppointmentInfo({ tutorEmail, studentEmail, date, time, duration, locationType, locationDetails }) {
    // send email to student
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: studentEmail,
        subject: 'Your Tutoring Appointment Has Been Updated',
        text: `
        Hello student,

        Your tutoring appointment has been updated for ${date} at ${time}. Here are the new meeting details:
        - Meeting Duration: ${duration} mins.
        - Location: ${locationType}. ${locationDetails}

        If you have scheduled an online session, a meeting link will be provided by your tutor the day of the appointment.
        If you need to cancel, reschedule, or have other questions, email your tutor via ${tutorEmail}. Please make sure to contact them at least 24 hours prior to the meeting time.

        Thanks,
        TutorFinder
        `,
        html: `
        <div style="font-family: system-ui, sans-serif, Arial; font-size: 16px;">
        <p>Hello student,</p>
        <p>Your tutoring appointment has been updated for <strong>${date}</strong> at <strong>${time}</strong>. Here are the new meeting details:</p>
        <ul>
            <li>Meeting Duration: <strong>${duration}</strong> mins.</li>
            <li>Meeting Location: <strong>${locationType}. ${locationDetails}</strong></li>
        </ul>
        <p>If you have scheduled an online session, a meeting link will be provided by your tutor the day of the appointment.</p>
        <p>If you need to cancel, reschedule, or have other questions, email your tutor via <strong>${tutorEmail}</strong>. Please make sure to contact them at least 24 hours prior to the meeting time.</p>
        <p>Thanks,<br><strong>TutorFinder</strong></p>
        </div>
        `,
    });

    // send email to tutor
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: tutorEmail,
        subject: 'A Tutoring Appointment Has Been Updated',
        text: `
        Hello tutor,

        A student has updated their appointment with you. Here are the updated meeting details:
        - Student Email: ${studentEmail}
        - Date: ${date}
        - Time: ${time}
        - Meeting Duration: ${duration} mins.
        - Location: ${locationType}. ${locationDetails}

        If an online meeting has been requested, make sure to follow up with them and send a meeting link before the time of the appointment.

        Thanks,
        TutorFinder
        `,
        html: `
        <div style="font-family: system-ui, sans-serif, Arial; font-size: 16px;">
        <p>Hello tutor,</p>
        <p>A student has updated their appointment with you. Here are the updated meeting details:</p>
        <ul>
            <li>Student Email: <strong>${studentEmail}</strong></li>
            <li>Date: <strong>${date}</strong></li>
            <li>Time: <strong>${time}</strong></li>
            <li>Meeting Duration: <strong>${duration}</strong> mins.</li>
            <li>Meeting Location: <strong>${locationType}. ${locationDetails}</strong></li>
        </ul>
        <p>If an online meeting has been requested, make sure to follow up with them and send a meeting link before the time of the appointment.</p>
        <p>Thanks,<br><strong>TutorFinder</strong></p>
        </div>
        `,
    });
}

async function sendAppointmentCancellation({ tutorEmail, studentEmail, date, time, locationType, locationDetails }) {
    // send email to student
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: studentEmail,
        subject: 'Your Tutoring Appointment Has Been Canceled',
        text: `
        Hello student,

        We regret to inform you that your tutoring appointment scheduled for ${date} at ${time} has been canceled. 
        The meeting was supposed to be held at ${locationType}. ${locationDetails}. 
        If you need further assistance or want to reschedule, please reach out to your tutor via ${tutorEmail}.

        Thanks,
        TutorFinder
        `,
        html: `
        <div style="font-family: system-ui, sans-serif, Arial; font-size: 16px;">
        <p>Hello student,</p>
        <p>We regret to inform you that your tutoring appointment scheduled for <strong>${date}</strong> at <strong>${time}</strong> has been canceled. The meeting was supposed to be held at <strong>${locationType}</strong>. <strong>${locationDetails}</strong>.</p>
        <p>If you need further assistance or want to reschedule, please reach out to your tutor via <strong>${tutorEmail}</strong>.</p>
        <p>Thanks,<br><strong>TutorFinder</strong></p>
        </div>
        `,
    });

    // send email to tutor
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: tutorEmail,
        subject: 'A Tutoring Appointment Has Been Canceled',
        text: `
        Hello tutor,

        A student has canceled their tutoring appointment scheduled for ${date} at ${time}. 
        The meeting was supposed to be held at ${locationType}. ${locationDetails}.
        If you need any further information or want to assist the student with rescheduling, please contact them at ${studentEmail}.

        Thanks,
        TutorFinder
        `,
        html: `
        <div style="font-family: system-ui, sans-serif, Arial; font-size: 16px;">
        <p>Hello tutor,</p>
        <p>A student has canceled their tutoring appointment scheduled for <strong>${date}</strong> at <strong>${time}</strong>. The meeting was supposed to be held at <strong>${locationType}</strong>. <strong>${locationDetails}</strong>.</p>
        <p>If you need any further information or want to assist the student with rescheduling, please contact them at <strong>${studentEmail}</strong>.</p>
        <p>Thanks,<br><strong>TutorFinder</strong></p>
        </div>
        `,
    });
}

module.exports = {
    sendAppointmentConfirmation,
    sendUpdateAppointmentInfo,
    sendAppointmentCancellation,
};
