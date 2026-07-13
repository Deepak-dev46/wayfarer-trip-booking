const BASE_URL= "http://localhost:8085"

import axios from 'axios';

export let authApi={
    login: (email,password)=>{return axios.post(`${BASE_URL}/api/auth/login`,{email,password})},
    register: (body)=>{return axios.post(`${BASE_URL}/api/auth/register`,body)},
}

export let packageApi={
    getPackages: ()=>{return axios.get(`${BASE_URL}/api/packages`)},
    getPackageById: (id)=>{return axios.get(`${BASE_URL}/api/packages/${id}`)},
    updatePackage: (id,body)=>{return axios.put(`${BASE_URL}/api/packages/${id}`,body)},
    deletePackage: (id)=>{return axios.delete(`${BASE_URL}/api/packages/${id}`)},
    addPackage:(body)=>{return axios.post(`${BASE_URL}/api/packages`,body)}
}

export let offerApi={
    getOffers: ()=>{return axios.get(`${BASE_URL}/api/offers`)},
    getOfferById: (id)=>{return axios.get(`${BASE_URL}/api/offers/${id}`)},
    updateOffer: (id,body)=>{return axios.put(`${BASE_URL}/api/offers/${id}`,body)},
    deleteOffer: (id)=>{return axios.delete(`${BASE_URL}/api/offers/${id}`)},
    addOffer:(body)=>{return axios.post(`${BASE_URL}/api/offers`,body)}
}

export let contactApi={
    getContacts: ()=>{return axios.get(`${BASE_URL}/api/contacts`)},
    addContact:(body)=>{return axios.post(`${BASE_URL}/api/contacts`,body)},
    deleteContact: (id)=>{return axios.delete(`${BASE_URL}/api/contact/${id}`)},
    updateContact: (id,body)=>{return axios.put(`${BASE_URL}/api/contacts/${id}/read`,body)},
}

export let bookingApi={
    getBookings: ()=>{return axios.get(`${BASE_URL}/api/bookings`)},
    getBookingById: (id)=>{return axios.get(`${BASE_URL}/api/bookings/${id}`)},
    deleteBooking: (id)=>{return axios.delete(`${BASE_URL}/api/bookings/${id}`)},
    addBookings: (body)=>{return axios.post(`${BASE_URL}/api/bookings`,body)},
    updateBookings: (id,body)=>{return axios.put(`${BASE_URL}/api/bookings/${id}/status`,body)},
}

export let userApi={
    getUser: ()=>{return axios.get(`${BASE_URL}/api/users`)},
    deleteUser: (id)=>{return axios.delete(`${BASE_URL}/api/users/${id}`)},
}

export let reviewApi={
    getReviews:()=>{return axios.get(`${BASE_URL}/api/reviews`)}
}

export let destinationApi={
    getDestinations:()=>{return axios.get(`${BASE_URL}/api/destinations`)},
    getDestinationById:(id)=>{return axios.get(`${BASE_URL}/api/destinations/${id}`)}
}

