# Overview
`react-fps-monitor` is a lightweight npm package designed for React applications that empowers developers to dynamically adjust rendering quality based on the frames-per-second (FPS) performance of the user's device.

The main use of this package is to allow developers the option to render lower quality graphics to users with weaker devices, while still being able to render high quality graphics to users with stronger devices.

# Features
- Monitor FPS performance within your React application.
- Emit level of detail signals ('high' or 'low') based on configurable FPS thresholds.
- Allows you to dynamically adjust render quality for better accessibility to your web application.
- Ideal for React applications, particularly beneficial when used with r3f (React Three Fiber) for dynamic scene rendering.

# Usage:

## Dynamic rendering based on level of detail

The example below showcases how you can conditionally render different components or quality levels based on the detected levelOfDetail.

```
// YourComponent.js
import React from 'react';
import { useFpsMonitor } from 'react-fps-monitor';

const YourComponent = () => {
  const { levelOfDetail, resetLOD } = useFpsMonitor();

  return (
    <div>
      {levelOfDetail === 'high' ? renderHighQuality() : renderLowQuality()}
    </div>
  );
};

export default YourComponent;
```

## Working with multiple components
### Context Provider Pattern
Enable all components in your React application to access the level of detail state through the Context Provider pattern in react-fps-monitor.

```
// FpsContext.js
import React, { createContext, useContext } from 'react';
import { useFpsMonitor } from 'react-fps-monitor';

const FpsContext = createContext();

export const FpsProvider = ({ children }) => {
  const {
    levelOfDetail,
    resetLOD
  } = useFpsMonitor();

  return (
    <FpsContext.Provider value={{ levelOfDetail, resetLOD }}>
      {children}
    </FpsContext.Provider>
  );
};

export const useFps = () => {
  return useContext(FpsContext);
};

// YourComponent.js
import React from 'react';
import { useFps } from './FpsContext';

const YourComponent = () => {
  const { levelOfDetail, resetLOD } = useFps();

  return (
    <div>
      {levelOfDetail === 'high' ? renderHighQuality() : renderLowQuality()}
    </div>
  );
};

export default YourComponent;

// App.js
import React from 'react';
import { FpsProvider } from './FpsContext';
import YourComponent from './YourComponent';

const App = () => {
  return (
    <FpsProvider>
      <YourComponent />
    </FpsProvider>
  );
};

export default App;
```

## Resetting the level of detail
You can utilize the `resetLOD` function available from the useFpsMonitor hook to manually reset the Level of Detail whenever necessary within your components.

By calling `resetLOD`, you can reset the Level of Detail to its initial state, which may be useful when you'd like to load in a new scene with the highest level of detail.


# Parameters
The `useFpsMonitor` custom hook accepts a bunch of parameters you can use to customize the FPS monitoring behavior and the granularity of the desired level of detail of your application. You can override these defaults by passing your custom values when initializing the hook. For example:

```
const { levelOfDetail, resetLOD } = useFpsMonitor({
  levelOfDetails: ['low', 'medium', 'high'],
  updateInterval: 500,
  minFpsThreshold: 25,
});
```

- `levelOfDetails` *(optional)*: An array defining the possible levels of detail values. Allows you to customize the granularity of the level of detail you wish to bring to your application. Default: ['high', 'low'].

- `updateInterval` *(optional)*: The time interval (in milliseconds) between FPS checks. Default: 1000 milliseconds.

- `minFpsThreshold` *(optional)*: The minimum FPS threshold that triggers a downgrade in the level of detail. Default: 30 FPS.