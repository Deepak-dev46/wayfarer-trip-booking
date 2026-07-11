import packagesSeed from '../data/packages.json';
import offersSeed from '../data/offers.json';
import destinationsSeed from '../data/destinations.json';
import reviewsSeed from '../data/reviews.json';
import usersSeed from '../data/users.json';
import bookingsSeed from '../data/bookings.json';
import contactsSeed from '../data/contacts.json';

// Simulated network delay, like an axios call to a real backend.
const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

const STORAGE_KEY = 'wayfarer_mock_db_v1';

function loadDb() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // fall through to seed
  }
  const seeded = {
    packages: packagesSeed,
    offers: offersSeed,
    destinations: destinationsSeed,
    reviews: reviewsSeed,
    users: usersSeed,
    bookings: bookingsSeed,
    contacts: contactsSeed,
  };
  saveDb(seeded);
  return seeded;
}

function saveDb(db) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

function uid(prefix) {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
}

let db = loadDb();

function commit() {
  saveDb(db);
}

export const mockApi = {
  // ---------- READ ----------
  async getPackages() {
    await delay();
    return [...db.packages];
  },
  async getPackageById(id) {
    await delay(300);
    return db.packages.find((p) => p.id === id) || null;
  },
  async getOffers() {
    await delay(350);
    return [...db.offers];
  },
  async getDestinations() {
    await delay(350);
    return [...db.destinations];
  },
  async getReviews(packageId) {
    await delay(300);
    return packageId ? db.reviews.filter((r) => r.packageId === packageId) : [...db.reviews];
  },
  async getUsers() {
    await delay(300);
    return [...db.users];
  },
  async getBookings() {
    await delay(300);
    return [...db.bookings];
  },
  async getContacts() {
    await delay(300);
    return [...db.contacts];
  },

  // ---------- AUTH ----------
  async login(email, password) {
    await delay(500);
    if (email === 'admin@trip.com' && password === 'admin123') {
      return { role: 'admin', user: { id: 'admin', name: 'Admin', email } };
    }
    const found = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (found) return { role: 'user', user: found };
    throw new Error('Invalid email or password.');
  },
  async register({ name, email, password, phone }) {
    await delay(500);
    if (db.users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('An account with this email already exists.');
    }
    const newUser = { id: uid('u'), name, email, password, phone: phone || '', joined: new Date().toISOString().slice(0, 10), role: 'user' };
    db.users.push(newUser);
    commit();
    return { role: 'user', user: newUser };
  },

  // ---------- PACKAGES CRUD ----------
  async createPackage(pkg) {
    await delay(500);
    const newPkg = { ...pkg, id: uid('p'), rating: pkg.rating || 4.5, reviewCount: 0 };
    db.packages.unshift(newPkg);
    commit();
    return newPkg;
  },
  async updatePackage(id, updates) {
    await delay(500);
    db.packages = db.packages.map((p) => (p.id === id ? { ...p, ...updates } : p));
    commit();
    return db.packages.find((p) => p.id === id);
  },
  async deletePackage(id) {
    await delay(400);
    db.packages = db.packages.filter((p) => p.id !== id);
    commit();
    return true;
  },

  // ---------- OFFERS CRUD ----------
  async createOffer(offer) {
    await delay(500);
    const newOffer = { ...offer, id: uid('o') };
    db.offers.unshift(newOffer);
    commit();
    return newOffer;
  },
  async updateOffer(id, updates) {
    await delay(500);
    db.offers = db.offers.map((o) => (o.id === id ? { ...o, ...updates } : o));
    commit();
    return db.offers.find((o) => o.id === id);
  },
  async deleteOffer(id) {
    await delay(400);
    db.offers = db.offers.filter((o) => o.id !== id);
    commit();
    return true;
  },

  // ---------- BOOKINGS ----------
  async createBooking(booking) {
    await delay(600);
    const newBooking = { ...booking, id: uid('b'), status: 'Pending', createdAt: new Date().toISOString().slice(0, 10) };
    db.bookings.unshift(newBooking);
    commit();
    return newBooking;
  },
  async updateBookingStatus(id, status) {
    await delay(350);
    db.bookings = db.bookings.map((b) => (b.id === id ? { ...b, status } : b));
    commit();
    return db.bookings.find((b) => b.id === id);
  },
  async deleteBooking(id) {
    await delay(350);
    db.bookings = db.bookings.filter((b) => b.id !== id);
    commit();
    return true;
  },

  // ---------- CONTACTS ----------
  async createContact(contact) {
    await delay(500);
    const newContact = { ...contact, id: uid('c'), date: new Date().toISOString().slice(0, 10), read: false };
    db.contacts.unshift(newContact);
    commit();
    return newContact;
  },
  async markContactRead(id) {
    await delay(250);
    db.contacts = db.contacts.map((c) => (c.id === id ? { ...c, read: true } : c));
    commit();
    return true;
  },
  async deleteContact(id) {
    await delay(350);
    db.contacts = db.contacts.filter((c) => c.id !== id);
    commit();
    return true;
  },

  // ---------- USERS ----------
  async deleteUser(id) {
    await delay(350);
    db.users = db.users.filter((u) => u.id !== id);
    commit();
    return true;
  },

  async resetDatabase() {
    localStorage.removeItem(STORAGE_KEY);
    db = loadDb();
    return true;
  },
};
