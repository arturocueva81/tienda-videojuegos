import { useState } from 'react';
import TablaVideojuegos from './components/TablaVideojuegos';
import data from './data/videojuegos';

function App() {
  const [videojuegos, setVideojuegos] = useState(data);

  return (
    <div>
      <TablaVideojuegos videojuegos={videojuegos} />
    </div>
  );
}

export default App;