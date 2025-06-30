
import './App.css'
import Robot from './Components/3dRobot'
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {

  return (
  <BrowserRouter>
  <Routes>
<Route path="/" element={<Robot/>} />

  </Routes>
  </BrowserRouter>
  )
}

export default App