import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { SearchPage } from "./pages/SearchPage";
import { StayDetailPage } from "./pages/StayDetailPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { BookingConfirmationPage } from "./pages/BookingConfirmationPage";

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<SearchPage />} />
        <Route path="/stays/:id" element={<StayDetailPage />} />
        <Route path="/checkout/:stayId" element={<CheckoutPage />} />
        <Route path="/bookings/:id" element={<BookingConfirmationPage />} />
      </Route>
    </Routes>
  );
}
