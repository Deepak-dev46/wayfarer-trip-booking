import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { mockApi } from '../services/mockApi';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [packages, setPackages] = useState([]);
  const [offers, setOffers] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  const refreshAll = useCallback(async () => {
    setLoading(true);
    const [pk, of, de, rv, us, bk, ct] = await Promise.all([
      mockApi.getPackages(),
      mockApi.getOffers(),
      mockApi.getDestinations(),
      mockApi.getReviews(),
      mockApi.getUsers(),
      mockApi.getBookings(),
      mockApi.getContacts(),
    ]);
    setPackages(pk);
    setOffers(of);
    setDestinations(de);
    setReviews(rv);
    setUsers(us);
    setBookings(bk);
    setContacts(ct);
    setLoading(false);
  }, []);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  // ---- Packages ----
  const addPackage = async (pkg) => {
    const created = await mockApi.createPackage(pkg);
    setPackages((prev) => [created, ...prev]);
    return created;
  };
  const editPackage = async (id, updates) => {
    const updated = await mockApi.updatePackage(id, updates);
    setPackages((prev) => prev.map((p) => (p.id === id ? updated : p)));
    return updated;
  };
  const removePackage = async (id) => {
    await mockApi.deletePackage(id);
    setPackages((prev) => prev.filter((p) => p.id !== id));
  };

  // ---- Offers ----
  const addOffer = async (offer) => {
    const created = await mockApi.createOffer(offer);
    setOffers((prev) => [created, ...prev]);
    return created;
  };
  const editOffer = async (id, updates) => {
    const updated = await mockApi.updateOffer(id, updates);
    setOffers((prev) => prev.map((o) => (o.id === id ? updated : o)));
    return updated;
  };
  const removeOffer = async (id) => {
    await mockApi.deleteOffer(id);
    setOffers((prev) => prev.filter((o) => o.id !== id));
  };

  // ---- Bookings ----
  const addBooking = async (booking) => {
    const created = await mockApi.createBooking(booking);
    setBookings((prev) => [created, ...prev]);
    return created;
  };
  const setBookingStatus = async (id, status) => {
    const updated = await mockApi.updateBookingStatus(id, status);
    setBookings((prev) => prev.map((b) => (b.id === id ? updated : b)));
    return updated;
  };
  const removeBooking = async (id) => {
    await mockApi.deleteBooking(id);
    setBookings((prev) => prev.filter((b) => b.id !== id));
  };

  // ---- Contacts ----
  const addContact = async (contact) => {
    const created = await mockApi.createContact(contact);
    setContacts((prev) => [created, ...prev]);
    return created;
  };
  const markContactRead = async (id) => {
    await mockApi.markContactRead(id);
    setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, read: true } : c)));
  };
  const removeContact = async (id) => {
    await mockApi.deleteContact(id);
    setContacts((prev) => prev.filter((c) => c.id !== id));
  };

  // ---- Users ----
  const removeUser = async (id) => {
    await mockApi.deleteUser(id);
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const value = {
    loading,
    packages,
    offers,
    destinations,
    reviews,
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
