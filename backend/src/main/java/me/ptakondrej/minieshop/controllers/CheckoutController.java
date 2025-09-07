package me.ptakondrej.minieshop.controllers;

import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import me.ptakondrej.minieshop.models.CheckoutDTO;
import me.ptakondrej.minieshop.models.RedirectUrlDTO;
import me.ptakondrej.minieshop.order.Order;
import me.ptakondrej.minieshop.order.OrderStatus;
import me.ptakondrej.minieshop.requests.OrderCreationRequest;
import me.ptakondrej.minieshop.responses.Response;
import me.ptakondrej.minieshop.services.OrderService;
import me.ptakondrej.minieshop.services.StripeService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/checkout")
public class CheckoutController {

	@Value("${app.frontend.url}")
	private String frontendUrl;

	private final OrderService orderService;
	private final StripeService stripeService;

	public CheckoutController(OrderService orderService, StripeService stripeService) {
		this.orderService = orderService;
		this.stripeService = stripeService;
	}

	@PostMapping("/create-checkout-session")
	public ResponseEntity<Response<CheckoutDTO>> createCheckoutSession(@RequestAttribute(value = "userId", required = false) Long userId, @RequestBody OrderCreationRequest checkoutRequest) {
		try {
			Order order = orderService.createOrder(userId, checkoutRequest);
			String checkoutUrl = stripeService.createCheckoutSession(order);
			return ResponseEntity.ok().body(new Response<>(true, new CheckoutDTO(order.getId(), checkoutUrl), "Checkout session created successfully"));
		} catch (StripeException e) {
			return ResponseEntity.status(502).body(new Response<>(false, null, "Stripe API error: " + e.getMessage()));
		} catch (IllegalArgumentException e) {
			return ResponseEntity.badRequest().body(new Response<>(false, null, "Invalid request: " + e.getMessage()));
		} catch (Exception e) {
			return ResponseEntity.status(500).body(new Response<>(false, null, "Failed to create checkout session: " + e.getMessage()));
		}
	}

	@PostMapping("/pay/{orderId}")
	public ResponseEntity<Response<CheckoutDTO>> payExistingOrder(@RequestAttribute("userId") Long userId, @PathVariable Long orderId) {
		try {
			Order order = orderService.getOrderByUserIdAndOrderId(userId, orderId);
			if (order == null) {
				return ResponseEntity.status(404).body(new Response<>(false, null, "Order not found"));
			}
			if (!order.getStatus().equals(OrderStatus.PENDING)) {
				return ResponseEntity.badRequest().body(new Response<>(false, null, "Only orders with PENDING status can be paid"));
			}
			String checkoutUrl = stripeService.getCheckoutSession(order.getStripeSessionId()).getUrl();
			if (checkoutUrl == null || checkoutUrl.isEmpty()) {
				checkoutUrl = stripeService.createCheckoutSession(order);
			}
			return ResponseEntity.ok().body(new Response<>(true, new CheckoutDTO(order.getId(), checkoutUrl), "Checkout session created successfully"));
		} catch (StripeException e) {
			return ResponseEntity.status(502).body(new Response<>(false, null, "Stripe API error: " + e.getMessage()));
		} catch (IllegalArgumentException e) {
			return ResponseEntity.badRequest().body(new Response<>(false, null, "Invalid request: " + e.getMessage()));
		} catch (Exception e) {
			return ResponseEntity.status(500).body(new Response<>(false, null, "Failed to create checkout session: " + e.getMessage()));
		}
	}

	@PostMapping("/success")
	public ResponseEntity<Response<RedirectUrlDTO>> handleSuccess(@RequestParam("sessionId") String sessionId) {
		try {
			Session session = stripeService.getCheckoutSession(sessionId);

			if (session == null || !session.getPaymentStatus().equals("paid") || !session.getStatus().equals("complete")) {
				return ResponseEntity.badRequest().body(new Response<>(false, null, "Payment not completed"));
			}

			String orderId = session.getMetadata().get("orderId");
			if (session.getMetadata().get("userId") != null) {
				String userId = session.getMetadata().get("userId");
				Order order = orderService.getOrderByUserIdAndOrderId(Long.valueOf(userId), Long.valueOf(orderId));

				if (order == null) {
					return ResponseEntity.status(404).body(new Response<>(false, null, "Order not found"));
				}

				if (order.getStatus() != OrderStatus.PAID) {
					orderService.updateOrderStatus(Long.valueOf(userId), Long.valueOf(orderId), OrderStatus.PAID);
				}

			} else {
				Order order = orderService.getOrderById(Long.valueOf(orderId));

				if (order == null) {
					return ResponseEntity.status(404).body(new Response<>(false, null, "Order not found"));
				}

				if (order.getStatus() != OrderStatus.PAID) {
					orderService.updateOrderStatus(Long.valueOf(orderId), OrderStatus.PAID);
				}
			}
			return ResponseEntity.ok().body(new Response<>(true, new RedirectUrlDTO(frontendUrl + "/payment-success"), "Payment successful"));

		} catch (StripeException e) {
			return ResponseEntity.status(502).body(new Response<>(false, null, "Stripe API error: " + e.getMessage()));
		} catch (Exception e) {
			return ResponseEntity.status(500).body(new Response<>(false, null, "Failed to verify payment: " + e.getMessage()));
		}
	}

	@GetMapping("/cancel")
	public ResponseEntity<Response<RedirectUrlDTO>> handleCancel() {
		return ResponseEntity.ok().body(new Response<>(true, new RedirectUrlDTO(frontendUrl + "/payment-cancel"), "Payment cancelled") );
	}
}
