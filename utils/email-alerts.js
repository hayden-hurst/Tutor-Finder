const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'tutorfinder.alerts@gmail.com',
        pass: 'ixoe gojg mlsn qdlb',
    },
});


async function sendInitialConfirmation({ tutorEmail, studentEmail, date, time, duration, locationType, locationDetails }) {
    // send email to student
    await transporter.sendMail({
        from: 'tutorfinder.alerts@gmail.com',
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
        from: 'tutorfinder.alerts@gmail.com',
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


module.exports = {
    sendInitialConfirmation,
};
