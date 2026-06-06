import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';
import Home from './pages/public/Home.jsx';
import Menu from './pages/public/Menu.jsx';
import Gallery from './pages/public/Gallery.jsx';
import Offers from './pages/public/Offers.jsx';
import BookBirthday from './pages/public/BookBirthday.jsx';
import BookEvent from './pages/public/BookEvent.jsx';
import AdminLogin from './pages/admin/Login.jsx';
import Dashboard from './pages/admin/Dashboard.jsx';
import MenuMgmt from './pages/admin/MenuMgmt.jsx';
import OffersMgmt from './pages/admin/OffersMgmt.jsx';
import GalleryMgmt from './pages/admin/GalleryMgmt.jsx';
import TodaySpecial from './pages/admin/TodaySpecial.jsx';
import BirthdayRequests from './pages/admin/BirthdayRequests.jsx';
import EventRequests from './pages/admin/EventRequests.jsx';
import SiteSettings from './pages/admin/SiteSettings.jsx';
import Contact from './pages/public/Contact.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="menu" element={<Menu />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="offers" element={<Offers />} />
          <Route path="book-birthday" element={<BookBirthday />} />
          <Route path="book-event" element={<BookEvent />} />
          <Route path="contact" element={<Contact />} />
        </Route>

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="menu" element={<MenuMgmt />} />
          <Route path="offers" element={<OffersMgmt />} />
          <Route path="gallery" element={<GalleryMgmt />} />
          <Route path="today-special" element={<TodaySpecial />} />
          <Route path="birthday-requests" element={<BirthdayRequests />} />
          <Route path="event-requests" element={<EventRequests />} />
          <Route path="settings" element={<SiteSettings />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
