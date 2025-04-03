import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import Auth from "./pages/auth/Auth"
import Chat from "./pages/chat/Chat"
import Profile from "./pages/profile/Profile"
import { userAppStore } from "./store"
import { useEffect, useState } from "react"
import { apiClient } from "./lib/api-client"
import { GET_USER_INFO } from "./utils/constants"


const PrivateRoute = ({ children }) => {
  const { userInfo } = userAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? children : <Navigate to="/auth" />;
}

const AuthRoute = ({ children }) => {
  const { userInfo } = userAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? <Navigate to="/chat" /> : children;
}

function App() {
  const { userInfo, setUserInfo } = userAppStore();
  const [ loading, setLoading ] = useState(true);

  useEffect( () => {
    const getUserData = async () => {
      try {
        const response = await apiClient.get(
          GET_USER_INFO,

          {
            withCredentials: true,
          }

        );

        if ( response.status === 200 && response.data.data._id ) {
          setUserInfo( response.data.data );
        } else {
          setUserInfo(undefined)
        }

        console.log(response);

      } catch (error) {
        console.log(error);
        setUserInfo(undefined)
        
      } finally {
        setLoading(false)
      }
    }

    if ( !userInfo ) {
      getUserData();
    } else {
      setLoading(false);
    }

  }, [ userInfo, setUserInfo ]);

  if ( loading ) 
    return <div>Loading...</div> 

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={
          <AuthRoute>
            <Auth />
          </AuthRoute>
        } />

        <Route path="/chat" element={
          <PrivateRoute>
            <Chat />
          </PrivateRoute>
        } />

        <Route path="/profile" element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        } />

        <Route path="*" element={ <Navigate to="/auth"/> } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
