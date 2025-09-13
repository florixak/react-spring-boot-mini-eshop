package me.ptakondrej.minieshop.webhooks;

import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import com.stripe.net.Webhook;
import me.ptakondrej.minieshop.services.OrderService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/webhooks")
public class StripeWebhookController {

	private final OrderService orderService;

	@Value("${stripe.webhook-secret}")
	private String webhookSecret;

	public StripeWebhookController(OrderService orderService) {
		this.orderService = orderService;
	}

	@PostMapping("/stripe")
	public ResponseEntity<String> handleStripeWebhook(@RequestBody String payload, @RequestHeader("Stripe-Signature") String sigHeader) {
		try {
			Event event = Webhook.constructEvent(payload, sigHeader, webhookSecret);

			switch (event.getType()) {
				case "checkout.session.completed":
					orderService.handleOrderPaymentSuccess(event);
					break;
				case "checkout.session.expired":
					//orderService.handleOrderPaymentFailure(event);
					break;
				default:
					break;
			}
			return ResponseEntity.ok("Success");
		} catch (SignatureVerificationException e) {
			return ResponseEntity.badRequest().body("Webhook error: " + e.getMessage());
		} catch (Exception e) {
			return ResponseEntity.status(500).body("Internal server error: " + e.getMessage());
		}
	}
}
