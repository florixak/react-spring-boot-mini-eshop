package me.ptakondrej.minieshop.services;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import me.ptakondrej.minieshop.user.User;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

	private final JavaMailSender mailSender;

	public EmailService(JavaMailSender mailSender) {
		this.mailSender = mailSender;
	}

	public void sendEmail(String to, String subject, String text) throws MessagingException {
		MimeMessage message = mailSender.createMimeMessage();
		MimeMessageHelper helper = new MimeMessageHelper(message, true);

		helper.setTo(to);
		helper.setSubject(subject);
		helper.setText(text, true);

		mailSender.send(message);
	}

	public void sendVerificationEmail(User user) {
		String subject = "Account Verification";
		String verificationCode = "VERIFICATION CODE " + user.getVerificationCode();
		String htmlMessage = "<html>"
				+ "<body style=\"font-family: Arial, sans-serif;\">"
				+ "<div style=\"background-color: #f5f5f5; padding: 20px;\">"
				+ "<h2 style=\"color: #333;\">Welcome to our app!</h2>"
				+ "<p style=\"font-size: 16px;\">Please enter the verification code below to continue:</p>"
				+ "<div style=\"background-color: #fff; padding: 20px; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.1);\">"
				+ "<h3 style=\"color: #333;\">Verification Code:</h3>"
				+ "<p style=\"font-size: 18px; font-weight: bold; color: #007bff;\">" + verificationCode + "</p>"
				+ "</div>"
				+ "</div>"
				+ "</body>"
				+ "</html>";
		try {
			sendEmail(user.getEmail(), subject, htmlMessage);
		} catch (MessagingException e) {
			e.printStackTrace();
		}
	}

	public void sendOrderConfirmationEmail(String to, String orderDetails) throws MessagingException {
		String subject = "Order Confirmation";
		String text = "<h1>Thank you for your order!</h1>"
				+ "<p>Your order details are as follows:</p>"
				+ "<pre>" + orderDetails + "</pre>"
				+ "<p>We will notify you once your order is shipped.</p>";
		sendEmail(to, subject, text);
	}

	public void sendOrderPaymentSuccessEmail(String to, String orderDetails) throws MessagingException {
		String subject = "Order Payment Successful";
		String text = "<h1>Your payment was successful!</h1>"
				+ "<p>Your order details are as follows:</p>"
				+ "<pre>" + orderDetails + "</pre>"
				+ "<p>We will notify you once your order is shipped.</p>";
		sendEmail(to, subject, text);
	}
}
