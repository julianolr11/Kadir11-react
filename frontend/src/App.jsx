import React from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import HomeScreen from './components/HomeScreen'
import IntroPage from './components/IntroPage'
import QuestionnairePage from './components/QuestionnairePage'
import ElementPage from './components/ElementPage'
import TitleBar from './components/TitleBar'
import CustomCursor from './components/CustomCursor'

export default function App() {
  return (
    <Router>
      <TitleBar />
      <CustomCursor />
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/intro" element={<IntroPage />} />
        <Route path="/questions" element={<QuestionnairePage />} />
        <Route path="/element" element={<ElementPage />} />
      </Routes>
    </Router>
  )
}
