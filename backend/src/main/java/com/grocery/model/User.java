package com.grocery.model;

import jakarta.persistence.*;

@Entity
@Table(name = "shop_users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;
    
    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String shopName;

    @Column(nullable = false)
    private String shopLicense;

    @Column(nullable = false)
    private String phoneNumber;

    @Column(columnDefinition = "TEXT")
    private String shopAddress;

    // Default constructor required by JPA
    public User() {}

    public User(String name, String email, String password, String shopName, String shopLicense, String phoneNumber, String shopAddress) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.shopName = shopName;
        this.shopLicense = shopLicense;
        this.phoneNumber = phoneNumber;
        this.shopAddress = shopAddress;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getShopName() { return shopName; }
    public void setShopName(String shopName) { this.shopName = shopName; }

    public String getShopLicense() { return shopLicense; }
    public void setShopLicense(String shopLicense) { this.shopLicense = shopLicense; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getShopAddress() { return shopAddress; }
    public void setShopAddress(String shopAddress) { this.shopAddress = shopAddress; }
}
