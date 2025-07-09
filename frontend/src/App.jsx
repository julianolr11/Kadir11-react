import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import StartView from './components/StartView.jsx'
import TrayView from './components/TrayView.jsx'
import CreatePetView from './components/CreatePetView.jsx'
import LoadPetView from './components/LoadPetView.jsx'
import PenView from './components/PenView.jsx'
import StatusView from './components/StatusView.jsx'
import BattleModeView from './components/BattleModeView.jsx'
import ItemsView from './components/ItemsView.jsx'
import StoreView from './components/StoreView.jsx'
import JourneyModeView from './components/JourneyModeView.jsx'
import JourneySceneView from './components/JourneySceneView.jsx'
import HatchView from './components/HatchView.jsx'
import TrainView from './components/TrainView.jsx'
import NestsView from './components/NestsView.jsx'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function IpcNavigationListener() {
  const navigate = useNavigate()
  useEffect(() => {
    const handler = (_event, route) => navigate(route)
    window.electronAPI?.on('navigate', handler)
  }, [navigate])
  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <IpcNavigationListener />
      <Routes>
        <Route path="/" element={<StartView />} />
        <Route path="/tray" element={<TrayView />} />
        <Route path="/create-pet" element={<CreatePetView />} />
        <Route path="/load-pet" element={<LoadPetView />} />
        <Route path="/pen" element={<PenView />} />
        <Route path="/status" element={<StatusView />} />
        <Route path="/battle" element={<BattleModeView />} />
        <Route path="/items" element={<ItemsView />} />
        <Route path="/store" element={<StoreView />} />
        <Route path="/journey" element={<JourneyModeView />} />
        <Route path="/journey-scene" element={<JourneySceneView />} />
        <Route path="/hatch" element={<HatchView />} />
        <Route path="/train" element={<TrainView />} />
        <Route path="/nests" element={<NestsView />} />
        <Route path="*" element={<StartView />} />
      </Routes>
    </BrowserRouter>
  )
}
