import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';

import Gallery from './pages/Gallery';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Gallery />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
