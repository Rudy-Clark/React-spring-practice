import React from 'react';

import Basics from './Basics';
import SpringExamples from './SpringExamples';

const App: React.FC = () => {
  return (
    <div className="container">
      <h2>Basics:</h2>
      <Basics />
      <h2>Spring Examples: </h2>
      <SpringExamples />
    </div>
  );
}

export default App;
