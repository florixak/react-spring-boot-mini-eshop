package me.ptakondrej.minieshop.services;

import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import com.stripe.param.checkout.SessionCreateParams.LineItem;
import me.ptakondrej.minieshop.models.OrderPriceModel;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

@Service
public class StripeService {

	@Value("${app.frontend.url}")
	private String frontendUrl;

	public String createCheckoutSession(OrderPriceModel request) throws StripeException {
		if (request == null || request.getOrder().getOrderItems() == null || request.getOrder().getOrderItems().isEmpty()) {
			throw new IllegalArgumentException("Order and order items cannot be null or empty");
		}
		if (frontendUrl == null || frontendUrl.isEmpty()) {
			throw new IllegalStateException("Frontend URL is not configured");
		}

		List<LineItem> lineItems = request.getOrder().getOrderItems().stream().map(item -> LineItem.builder()
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

		List<LineItem> allLineItems = new ArrayList<>(lineItems);
		allLineItems.add(LineItem.builder()
				.setPriceData(LineItem.PriceData.builder()
						.setCurrency("usd")
						.setProductData(LineItem.PriceData.ProductData.builder()
								.setName(request.getOrder().getShippingMethod().name() + " Shipping")
								.setDescription(request.getOrder().getShippingMethod().getDescription())
								.build())
						.setUnitAmount(convertToStripeAmount(request.getShippingCost()))
						.build())
				.setQuantity(1L)
				.build());

		allLineItems.add(LineItem.builder()
				.setPriceData(LineItem.PriceData.builder()
						.setCurrency("usd")
						.setProductData(LineItem.PriceData.ProductData.builder()
								.setName("Tax (10%)")
								.setDescription("Applicable tax")
								.build())
						.setUnitAmount(convertToStripeAmount(request.getTax()))
						.build())
				.setQuantity(1L)
				.build());

		SessionCreateParams.Builder paramsBuilder = SessionCreateParams.builder()
				.setMode(SessionCreateParams.Mode.PAYMENT)
				.setSuccessUrl(frontendUrl + "/cart/checkout/success?orderId=" + request.getOrder().getId() + "&sessionId={CHECKOUT_SESSION_ID}")
				.setCancelUrl(frontendUrl + "/cart/checkout/cancel?orderId=" + request.getOrder().getId())
				.addAllLineItem(allLineItems)
				.putMetadata("orderId", request.getOrder().getId().toString());

		paramsBuilder.setCustomerEmail(request.getOrder().getCustomerEmail());

		if (request.getOrder().getUser() != null) {
			paramsBuilder.putMetadata("userId", request.getOrder().getUser().getId().toString());
		}

		Session session = Session.create(paramsBuilder.build());
		return session.getUrl();
	}

	public Session getCheckoutSession(String sessionId) throws StripeException {
		return Session.retrieve(sessionId);
	}

	private Long convertToStripeAmount(BigDecimal price) {
		return price.multiply(BigDecimal.valueOf(100)).setScale(0, RoundingMode.HALF_UP).longValue();
	}
}
