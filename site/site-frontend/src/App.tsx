import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home';

function App() {
  return (
    <Router>
      <Routes>
        {/* Home Page */}
        <Route path="/" element={<HomePage />} />

        {/* New Functional Page */}
        {/*<Route path="/functional" element={<FunctionalPage />} />*/}
      </Routes>
    </Router>
  );
}

export default App;
