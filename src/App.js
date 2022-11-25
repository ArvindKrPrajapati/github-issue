import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Issues from './Issues'
function App() {
  return (
    <Routes>
      <Route exact path="/" element={<Issues />} />
      <Route path="/:page" element={<Issues />} />
    </Routes>
  )
}

export default App