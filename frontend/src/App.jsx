import React from 'react'
import { Routes, Route } from 'react-router-dom'
import HomeScreen from './components/HomeScreen'
import IntroPage from './components/IntroPage'
import QuestionnairePage from './components/QuestionnairePage'
import ElementPage from './components/ElementPage'
import HatchPage from './components/HatchPage'
import MapPage from './components/MapPage'
import TitleBar from './components/TitleBar'
import CustomCursor from './components/CustomCursor'

export default function App() {
  return (
    <>
      <TitleBar />
      <CustomCursor />
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/intro" element={<IntroPage />} />
        <Route path="/questions" element={<QuestionnairePage />} />
        <Route path="/element" element={<ElementPage />} />
        <Route path="/hatch" element={<HatchPage />} />
        <Route path="/map" element={<MapPage />} />
      </Routes>
    </>
  )
}
