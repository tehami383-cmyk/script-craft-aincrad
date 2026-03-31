/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Exercise from './pages/Exercise';
import Profile from './pages/Profile';
import Leaderboard from './pages/Leaderboard';
import BackgroundMusic from './components/BackgroundMusic';
import NeuralAssistant from './components/NeuralAssistant';

export default function App() {
  return (
    <BrowserRouter>
      <BackgroundMusic />
      <NeuralAssistant />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/exercise/:moduleId/:exerciseId" element={<Exercise />} />
      </Routes>
    </BrowserRouter>
  );
}
