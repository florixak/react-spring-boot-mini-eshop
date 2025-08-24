package me.ptakondrej.minieshop.services;

import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import com.stripe.param.checkout.SessionCreateParams.LineItem;
import me.ptakondrej.minieshop.order.Order;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class StripeService {

	@Value("${app.base.url}")
	private String baseUrl;

	public String createCheckoutSession(Order request) throws StripeException {
		if (request == null || request.getOrderItems() == null || request.getOrderItems().isEmpty()) {
			throw new IllegalArgumentException("Order and order items cannot be null or empty");
		}
		if (baseUrl == null || baseUrl.isEmpty()) {
			throw new IllegalStateException("Base URL is not configured");
		}
		List<LineItem> lineItems = request.getOrderItems().stream().map(item -> LineItem.builder()
				.setPriceData(LineItem.PriceData.builder()
						.setCurrency("usd")
						.setProductData(LineItem.PriceData.ProductData.builder()
								.setName(item.getProduct().getTitle())
								.setDescription(item.getProduct().getDescription())
								.addImage(item.getProduct().getImageUrl())
								.build())
						.setUnitAmount(convertToStripeAmount(item.getProduct().getPrice()))
						.build())
				.setQuantity(item.getQuantity().longValue())
				.build()).toList();

		SessionCreateParams.Builder paramsBuilder = SessionCreateParams.builder()
				.setMode(SessionCreateParams.Mode.PAYMENT)
				.setSuccessUrl(baseUrl + "/api/checkout/success?sessionId={CHECKOUT_SESSION_ID}")
				.setCancelUrl(baseUrl + "/api/checkout/cancel")
				.addAllLineItem(lineItems)
				.putMetadata("orderId", request.getId().toString());

		if (request.getUser() != null) {
			paramsBuilder.putMetadata("userId", request.getUser().getId().toString());
			if (request.getUser().getEmail() != null) {
				paramsBuilder.setCustomerEmail(request.getUser().getEmail());
			}
		}

		Session session = Session.create(paramsBuilder.build());
		return session.getUrl();
	}

	public Session getCheckoutSession(String sessionId) throws StripeException {
		return Session.retrieve(sessionId);
	}

	private Long convertToStripeAmount(BigDecimal price) {
		return price.multiply(BigDecimal.valueOf(100)).longValue();
	}
}
