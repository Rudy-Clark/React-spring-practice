import React from 'react';
import { DndProvider } from 'react-dnd';
import backend from 'react-dnd-html5-backend';

import Basics from './Basics';
import SpringExamples from './SpringExamples';
import Transition from './Transition';

const App: React.FC = () => {
  return (
    <div className="container">
      <h2>Basics:</h2>
      <Basics />
      <h2>Spring Examples: </h2>
      <SpringExamples />
      <h2>Springs: </h2>
      <DndProvider backend={backend}>
        <Transition />
      </DndProvider>
      
    </div>
  );
}

export default App;
