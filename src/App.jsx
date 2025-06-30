
import './App.css'
import ProfileCard from './componets/profilecard'
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {

  return (
  <BrowserRouter>
  <Routes>
<Route path="/" element={<ProfileCard/>} />

  </Routes>
  </BrowserRouter>
  )
}

export default App
