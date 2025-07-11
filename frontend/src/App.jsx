import React from 'react'
import HomeScreen from './components/HomeScreen'
import TitleBar from './components/TitleBar'
import CustomCursor from './components/CustomCursor'

export default function App() {
  return (
    <>
      <TitleBar />
      <CustomCursor />
      <HomeScreen />
    </>
  )
}
