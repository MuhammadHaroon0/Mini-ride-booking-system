
import { Route, Routes } from 'react-router-dom'
import './App.css'
import Footer from './components/Footer'
import Navbar from './components/navbar/Navbar'
import Login from './pages/login/Login'
import Signup from './pages/signup/Signup'
import RequestRide from './pages/request-a-ride/RequestRide'
import RidesHistory from './pages/ride-history/RidesHistory'
import IndividualRide from './pages/individual-ride/IndividualRide'
import { RideRequests } from './pages/ride-requests/RideRequests'
import { useLayoutEffect } from 'react'
import useAuthStore from './stores/authStore'

function App() {
  const { getMe } = useAuthStore()
  useLayoutEffect(() => {
    getMe()
  }, []);

  return (
    <>
      <Navbar />
      <Routes>
        <Route element={<Login />} path='/auth/login' />
        <Route element={<Signup />} path='/auth/signup' />
        <Route element={<RequestRide />} path='/request-a-ride' />
        <Route element={<RidesHistory />} path='/ride-history' />
        <Route element={<IndividualRide />} path='/ride/:id' />
        <Route element={<RideRequests />} path='/ride-requests' />
      </Routes>
      <Footer />
    </>
  )
}

export default App
