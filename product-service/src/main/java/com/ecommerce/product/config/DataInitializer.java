package com.ecommerce.product.config;

import com.ecommerce.product.entity.Category;
import com.ecommerce.product.entity.Product;
import com.ecommerce.product.repository.CategoryRepository;
import com.ecommerce.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    @Override
    public void run(String... args) {
        // Check if data already exists
        if (categoryRepository.count() > 0) {
            log.info("Database already initialized. Skipping data initialization.");
            return;
        }

        log.info("Initializing database with sample data...");

        // Create Categories
        Category electronics = createCategory("Électronique", "Appareils électroniques et gadgets");
        Category clothing = createCategory("Vêtements", "Mode et accessoires");
        Category books = createCategory("Livres", "Livres et magazines");
        Category home = createCategory("Maison", "Articles pour la maison");

        // Create Products - Electronics
        createProduct("Laptop Dell XPS 15", "Ordinateur portable haute performance avec écran 4K", 
                     new BigDecimal("1299.99"), 15, electronics, "https://via.placeholder.com/300x200?text=Laptop");
        
        createProduct("iPhone 15 Pro", "Smartphone Apple dernière génération", 
                     new BigDecimal("1199.99"), 25, electronics, "https://via.placeholder.com/300x200?text=iPhone");
        
        createProduct("Samsung Galaxy S24", "Smartphone Android premium", 
                     new BigDecimal("999.99"), 20, electronics, "https://via.placeholder.com/300x200?text=Samsung");
        
        createProduct("AirPods Pro", "Écouteurs sans fil avec réduction de bruit", 
                     new BigDecimal("249.99"), 50, electronics, "https://via.placeholder.com/300x200?text=AirPods");

        // Create Products - Clothing
        createProduct("T-Shirt Nike", "T-shirt de sport confortable", 
                     new BigDecimal("29.99"), 100, clothing, "https://via.placeholder.com/300x200?text=TShirt");
        
        createProduct("Jean Levi's 501", "Jean classique coupe droite", 
                     new BigDecimal("89.99"), 75, clothing, "https://via.placeholder.com/300x200?text=Jeans");
        
        createProduct("Sneakers Adidas", "Chaussures de sport élégantes", 
                     new BigDecimal("119.99"), 60, clothing, "https://via.placeholder.com/300x200?text=Sneakers");

        // Create Products - Books
        createProduct("Clean Code", "Livre de programmation par Robert C. Martin", 
                     new BigDecimal("39.99"), 30, books, "https://via.placeholder.com/300x200?text=CleanCode");
        
        createProduct("Spring in Action", "Guide complet de Spring Framework", 
                     new BigDecimal("49.99"), 25, books, "https://via.placeholder.com/300x200?text=SpringBook");

        // Create Products - Home
        createProduct("Cafetière Nespresso", "Machine à café automatique", 
                     new BigDecimal("199.99"), 40, home, "https://via.placeholder.com/300x200?text=Coffee");
        
        createProduct("Aspirateur Dyson", "Aspirateur sans fil puissant", 
                     new BigDecimal("399.99"), 20, home, "https://via.placeholder.com/300x200?text=Vacuum");
        
        createProduct("Lampe LED", "Lampe de bureau moderne", 
                     new BigDecimal("49.99"), 80, home, "https://via.placeholder.com/300x200?text=Lamp");

        log.info("Database initialization completed successfully!");
        log.info("Created {} categories and {} products", 
                categoryRepository.count(), productRepository.count());
    }

    private Category createCategory(String name, String description) {
        Category category = new Category();
        category.setName(name);
        category.setDescription(description);
        return categoryRepository.save(category);
    }

    private Product createProduct(String name, String description, BigDecimal price, 
                                 Integer stock, Category category, String imageUrl) {
        Product product = new Product();
        product.setName(name);
        product.setDescription(description);
        product.setPrice(price);
        product.setStock(stock);
        product.setCategory(category);
        product.setImageUrl(imageUrl);
        return productRepository.save(product);
    }
}
