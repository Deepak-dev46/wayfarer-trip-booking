import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { packageApi, offerApi, bookingApi, contactApi, userApi, destinationApi, reviewApi, videoApi } from '../services/api';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [packages, setPackages] = useState([]);
  const [offers, setOffers] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [videos, setVideos] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  const refreshAll = useCallback(async () => {
    setLoading(true);
    const [pkRes, ofRes, deRes, rvRes, viRes, usRes, bkRes, ctRes] = await Promise.all([
      packageApi.getPackages(),
      offerApi.getOffers(),
      destinationApi.getDestinations(),
      reviewApi.getReviews(),
      videoApi.getVideos(),
      userApi.getUser(),
      bookingApi.getBookings(),
      contactApi.getContacts(),
    ]);
    setPackages(pkRes.data);
    setOffers(ofRes.data);
    setDestinations(deRes.data);
    setReviews(rvRes.data);
    setVideos(viRes.data);
    setUsers(usRes.data);
    setBookings(bkRes.data);
    setContacts(ctRes.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  // ---- Packages ----
  const addPackage = async (pkg) => {
    const { data: created } = await packageApi.addPackage(pkg);
    setPackages((prev) => [created, ...prev]);
    return created;
  };
  const editPackage = async (id, updates) => {
    const { data: updated } = await packageApi.updatePackage(id, updates);
    setPackages((prev) => prev.map((p) => (String(p.id) === String(id) ? updated : p)));
    return updated;
  };
  const removePackage = async (id) => {
    await packageApi.deletePackage(id);
    setPackages((prev) => prev.filter((p) => String(p.id) !== String(id)));
  };

  // ---- Offers ----
  const addOffer = async (offer) => {
    const { data: created } = await offerApi.addOffer(offer);
    setOffers((prev) => [created, ...prev]);
    return created;
  };
  const editOffer = async (id, updates) => {
    const { data: updated } = await offerApi.updateOffer(id, updates);
    setOffers((prev) => prev.map((o) => (String(o.id) === String(id) ? updated : o)));
    return updated;
  };
  const removeOffer = async (id) => {
    await offerApi.deleteOffer(id);
    setOffers((prev) => prev.filter((o) => String(o.id) !== String(id)));
  };

  // ---- Bookings ----
  const addBooking = async (booking) => {
    const { data: created } = await bookingApi.addBookings(booking);
    setBookings((prev) => [created, ...prev]);
    return created;
  };
  const setBookingStatus = async (id, status) => {
    const { data: updated } = await bookingApi.updateBookings(id, { status });
    setBookings((prev) => prev.map((b) => (String(b.id) === String(id) ? updated : b)));
    return updated;
  };
  const removeBooking = async (id) => {
    await bookingApi.deleteBooking(id);
    setBookings((prev) => prev.filter((b) => String(b.id) !== String(id)));
  };

  // ---- Contacts ----
  const addContact = async (contact) => {
    const { data: created } = await contactApi.addContact(contact);
    setContacts((prev) => [created, ...prev]);
    return created;
  };
  const markContactRead = async (id) => {
    const { data: updated } = await contactApi.updateContact(id, {});
    setContacts((prev) => prev.map((c) => (String(c.id) === String(id) ? updated : c)));
    return updated;
  };
  const removeContact = async (id) => {
    await contactApi.deleteContact(id);
    setContacts((prev) => prev.filter((c) => String(c.id) !== String(id)));
  };

  // ---- Videos ----
  const addVideo = async (video) => {
    const { data: created } = await videoApi.addVideo(video);
    setVideos((prev) => [created, ...prev]);
    return created;
  };
  const editVideo = async (id, updates) => {
    const { data: updated } = await videoApi.updateVideo(id, updates);
    setVideos((prev) => prev.map((v) => (String(v.id) === String(id) ? updated : v)));
    return updated;
  };
  const removeVideo = async (id) => {
    await videoApi.deleteVideo(id);
    setVideos((prev) => prev.filter((v) => String(v.id) !== String(id)));
  };

  // ---- Users ----
  const removeUser = async (id) => {
    await userApi.deleteUser(id);
    setUsers((prev) => prev.filter((u) => String(u.id) !== String(id)));
  };

  const value = {
    loading,
    packages,
    offers,
    destinations,
    reviews,
    videos,
    users,
    bookings,
    contacts,
    refreshAll,
    addPackage,
    editPackage,
    removePackage,
    addOffer,
    editOffer,
    removeOffer,
    addVideo,
    editVideo,
    removeVideo,
    addBooking,
    setBookingStatus,
    removeBooking,
    addContact,
    markContactRead,
    removeContact,
    removeUser,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
