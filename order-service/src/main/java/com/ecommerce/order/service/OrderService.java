package com.ecommerce.order.service;

import com.ecommerce.order.client.ProductClient;
import com.ecommerce.order.client.ProductDTO;
import com.ecommerce.order.config.OrderConfigProperties;
import com.ecommerce.order.entity.Order;
import com.ecommerce.order.entity.OrderItem;
import com.ecommerce.order.entity.Cart;
import com.ecommerce.order.repository.OrderRepository;
import com.ecommerce.order.repository.CartRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final ProductClient productClient;
    private final OrderConfigProperties configProperties;

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
    }

    public List<Order> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserIdOrderByOrderDateDesc(userId);
    }

    /**
     * Get recent orders based on the custom configuration property mes-config-ms.commandes-last
     * Returns orders from the last N days where N is configured in application properties
     */
    public List<Order> getRecentOrders() {
        int daysToLookBack = configProperties.getCommandesLast();
        LocalDateTime startDate = LocalDateTime.now().minusDays(daysToLookBack);
        return orderRepository.findRecentOrders(startDate);
    }

    public Order createOrderFromCart(Long userId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found for user: " + userId));

        if (cart.getItems().isEmpty()) {
            throw new RuntimeException("Cannot create order from empty cart");
        }

        // First pass: Validate stock for ALL products and collect errors
        List<String> stockErrors = new ArrayList<>();
        
        for (var cartItem : cart.getItems()) {
            ProductDTO product = productClient.getProductById(cartItem.getProductId());
            
            if (product.getStock() < cartItem.getQuantity()) {
                stockErrors.add(product.getName() + " (disponible: " + product.getStock() + ", demandé: " + cartItem.getQuantity() + ")");
            }
        }
        
        // If any product has insufficient stock, throw exception with all errors
        if (!stockErrors.isEmpty()) {
            throw new RuntimeException("Stock insuffisant pour: " + String.join(", ", stockErrors));
        }

        Order order = new Order();
        order.setUserId(userId);
        order.setStatus(Order.OrderStatus.PENDING);

        BigDecimal totalAmount = BigDecimal.ZERO;

        // Second pass: Create order items and decrement stock
        for (var cartItem : cart.getItems()) {
            ProductDTO product = productClient.getProductById(cartItem.getProductId());
            
            // Decrement stock in product-service
            productClient.updateStock(cartItem.getProductId(), cartItem.getQuantity());

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProductId(product.getId());
            orderItem.setProductName(product.getName());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setUnitPrice(product.getPrice());
            orderItem.setSubtotal(product.getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity())));

            order.getItems().add(orderItem);
            totalAmount = totalAmount.add(orderItem.getSubtotal());
        }

        order.setTotalAmount(totalAmount);
        Order savedOrder = orderRepository.save(order);

        // Clear cart after order creation
        cart.getItems().clear();
        cartRepository.save(cart);

        return savedOrder;
    }

    public Order updateOrderStatus(Long id, Order.OrderStatus status) {
        Order order = getOrderById(id);
        order.setStatus(status);
        return orderRepository.save(order);
    }
}
