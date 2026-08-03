package com.serviceeverz.wayfarer.entity;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OrderColumn;
import jakarta.persistence.Table;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "packages")
public class TravelPackage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(name = "destination_id")
    private Long destinationId;

    private String location;

    private String category;

    @Column(name = "trip_type")
    private String tripType;

    private Integer duration;

    private Double price;

    private Double rating;

    @Column(name = "review_count")
    private Integer reviewCount;

    private Boolean featured;

    private Boolean trending;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "package_images", joinColumns = @JoinColumn(name = "package_id"))
    @Column(name = "image_url", length = 1000)
    @OrderColumn(name = "image_order")
    private List<String> images = new ArrayList<>();

    @Column(name = "short_description", length = 1000)
    private String shortDescription;

    @Column(name = "description", length = 4000)
    private String description;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "package_included", joinColumns = @JoinColumn(name = "package_id"))
    @Column(name = "item", length = 1000)
    @OrderColumn(name = "item_order")
    private List<String> included = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "package_excluded", joinColumns = @JoinColumn(name = "package_id"))
    @Column(name = "item", length = 1000)
    @OrderColumn(name = "item_order")
    private List<String> excluded = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "package_tour_plan", joinColumns = @JoinColumn(name = "package_id"))
    @OrderColumn(name = "plan_order")
    private List<TourPlanItem> tourPlan = new ArrayList<>();

    public TravelPackage() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Long getDestinationId() {
        return destinationId;
    }

    public void setDestinationId(Long destinationId) {
        this.destinationId = destinationId;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getTripType() {
        return tripType;
    }

    public void setTripType(String tripType) {
        this.tripType = tripType;
    }

    public Integer getDuration() {
        return duration;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public Integer getReviewCount() {
        return reviewCount;
    }

    public void setReviewCount(Integer reviewCount) {
        this.reviewCount = reviewCount;
    }

    public Boolean getFeatured() {
        return featured;
    }

    public void setFeatured(Boolean featured) {
        this.featured = featured;
    }

    public Boolean getTrending() {
        return trending;
    }

    public void setTrending(Boolean trending) {
        this.trending = trending;
    }

    public List<String> getImages() {
        return images;
    }

    public void setImages(List<String> images) {
        this.images = images;
    }

    public String getShortDescription() {
        return shortDescription;
    }

    public void setShortDescription(String shortDescription) {
        this.shortDescription = shortDescription;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<String> getIncluded() {
        return included;
    }

    public void setIncluded(List<String> included) {
        this.included = included;
    }

    public List<String> getExcluded() {
        return excluded;
    }

    public void setExcluded(List<String> excluded) {
        this.excluded = excluded;
    }

    public List<TourPlanItem> getTourPlan() {
        return tourPlan;
    }

    public void setTourPlan(List<TourPlanItem> tourPlan) {
        this.tourPlan = tourPlan;
    }
}
