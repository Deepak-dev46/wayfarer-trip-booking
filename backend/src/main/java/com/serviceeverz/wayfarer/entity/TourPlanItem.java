package com.serviceeverz.wayfarer.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

@Embeddable
public class TourPlanItem {

    @Column(name = "day_number")
    private Integer day;

    @Column(name = "day_title")
    private String title;

    @Column(name = "day_detail", length = 2000)
    private String detail;

    public TourPlanItem() {
    }

    public TourPlanItem(Integer day, String title, String detail) {
        this.day = day;
        this.title = title;
        this.detail = detail;
    }

    public Integer getDay() {
        return day;
    }

    public void setDay(Integer day) {
        this.day = day;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDetail() {
        return detail;
    }

    public void setDetail(String detail) {
        this.detail = detail;
    }
}
