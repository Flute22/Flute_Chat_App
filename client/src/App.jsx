import { Button } from "@/components/ui/button"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import Auth from "./pages/auth/auth.jsx"
import Chat from "./pages/chat/chat.jsx"
import Profile from "./pages/profile/profile.jsx"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/profile" element={<Profile />} />

        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
