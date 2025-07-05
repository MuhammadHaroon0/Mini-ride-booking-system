
import { Route, Routes } from 'react-router-dom'
import './App.css'
import Footer from './components/Footer'
import Navbar from './components/navbar/Navbar'
import Login from './pages/login/Login'
import Signup from './pages/signup/Signup'
import RequestRide from './pages/request-a-ride/RequestRide'
import RidesHistory from './pages/ride-history/RidesHistory'

function App() {

  return (
    <>
      <Navbar currentUser={null} />
      <Routes>
        <Route element={<Login />} path='/auth/login' />
        <Route element={<Signup />} path='/auth/signup' />
        <Route element={<RequestRide />} path='/request-a-ride' />
        <Route element={<RidesHistory />} path='/' />
      </Routes>
      <Footer />
    </>
  )
}

export default App
