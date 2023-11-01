# react-pusu 

Simple `pub-sub` implementation APIs, HOCs & Hooks using [pusu](https://www.npmjs.com/package/pusu) for [React](https://reactjs.org/) Components. `react-pusu` uses [pusu](https://www.npmjs.com/package/pusu) internally and provides an HOC for better usability. 

## Compatibility
| React Version | react-pusu Compatibility |
|--|--|
| >= React@16.8 | ^2.0.0 |
| React@15, <= React@16.7 | ^1.0.0 |

## Installation

`npm install --save pusu react-pusu`

## createPublication, publish & subscribe

Please refer [pusu](https://www.npmjs.com/package/pusu).

## useSubscribe

**Type Definition**

```
import type { TSubscribe } from 'pusu';

type TUseSubscribe = () => TSubscribe;
```

`useSubscribe` hook returns a function `subscribe`. The Component can subscribe to the publication and can receive the data using this `subscribe` function, whenver the publisher publishes it.

**`useSubscribe` makes sure that all the subscriptions are removed/unsubscribed before the component is unmounted.** This way the consumer React Component can use the `subscribe`, even multiple times, without worrying about unsubscribing before it is unmounted.

```
import { useSubscribe } from 'react-pusu';
import refreshPageDataPublication from './publications/refresh-page-data-publication';

const DashboardSatistics = () => {
  const subscribe = useSubscribe();
  
  useEffect(() => {
    const refreshData = ({ asOfDate }) => {
      // load the data
    }

    subscribe(refreshPageDataPublication, refreshData);
  }
   
  return (
    <section>
      // render the statistics here ...
    </section>
  );
};

export default DashboardSatistics;
```

### Unsubscribing explicitely

`subscribe`, when called, returns a function which can be called to unsubscribe from the publication. Sometimes component may need to unsubscribe based on some condition or action, for those cases the function returned by `subscribe` can be called to unsubscribe.

```
import { useSubscribe } from 'react-pusu';
import refreshPageDataPublication from './publications/refresh-page-data-publication';

const DashboardSatistics = () => {
  const ref = useRef({ unsubscribeFromRefreshPublication: () => {} });
  const subscribe = useSubscribe();
  
  useEffect(() => {
    const refreshData = ({ asOfDate }) => {
      // load the data
    }

    ref.current.unsubscribeFromRefreshPublication = subscribe(refreshPageDataPublication, refreshData);
  }
  
  const onSomeAction = () => {
    // Unsubscribe from publication
    ref.current.unsubscribeFromRefreshPublication();
  }
   
  return (
    <section>
      // render the statistics here ...
    </section>
  );
};

export default DashboardSatistics;
```

## withSubscribe

**Type Definition**

```
import type { TSubscribe } from 'pusu';

type TWithSubscribe = <P, S>(Component: React.ComponentClass<P & { subscribe: TSubscribe }, S> | React.FunctionComponent<P & { subscribe: TSubscribe }>) => React.FC<P>;
```

**Parameters**:
- `Component`: *(Required)* - React Component

`withSubscribe` supplies a function `subscribe` as a property to the React Component. The Component can subscribe to the publication and can receive the data using this function, whenver the publisher publishes it.

**`withSubscribe` makes sure that all the subscriptions are removed/unsubscribed before the component is unmounted.** This way the consumer React Component can use the `props.subscribe`, even multiple times, without worrying about unsubscribing before it is unmounted.

```
import { withSubscribe } from 'react-pusu';
import refreshPageDataPublication from './publications/refresh-page-data-publication';

class DashboardSatistics extends React.Component {
  constructor(props, context) {
    super(props, context);
    props.subscribe(refreshPageDataPublication, this.refreshData);
  }

  refreshData = ({ asOfDate }) => {
    // load the data (may be using redux)
  }
  
  render() {
    return (
      <section>
        // render the statistics here ...
      </section>
    );
  }
}

export default withSubscribe(DashboardSatistics);
```

### Unsubscribing explicitely

`props.subscribe`, when called, returns a function which can be called to unsubscribe from the publication. Sometimes component may need to unsubscribe based on some condition or action, for those cases the function returned by `props.subscribe` can be called to unsubscribe.

```
import { withSubscribe } from 'react-pusu';
import refreshPageDataPublication from './publications/refresh-page-data-publication';

class DashboardSatistics extends React.Component {
  constructor(props, context) {
    super(props, context);

    // Assign the unsubscriber function to the class member/variable
    this.unsubscribeFromRefreshPublication = props.subscribe(refreshPageDataPublication, this.refreshData);
  }

  refreshData = ({ asOfDate }) => {
    // load the data (may be using redux)
  }

  onSomeAction = () => {
    // Unsubscribe from publication
    this.unsubscribeFromRefreshPublication();
  }
  
  render() {
    return (
      <section>
        // render the statistics here ...
      </section>
    );
  }
}

export default withSubscribe(DashboardSatistics);
```

## Migrating from 2.0 to 2.1

### Breaking change

- The version 2.1 will need `pusu` as a separate dependency to be installed
- The version 2.1 will allow only one parameter while publishing the data & subscribing to the data.

### 2.0

The version 2.0 were allowing more than one parameters while publishing the data.

In the example below, publisher is publishing date and company id as two different parameters.

```
import { publish } from 'pusu';
import refreshPageDataPublication from './publications/refresh-page-data-publication';

const RefreshPageDataButton = ({ company }) => (
  <button
    onClick={()=> {
      // Publish the data 
      publish(publication, new Date(), company._id);
    }}
  >
    Refresh
  </button>
);

export default RefreshPageDataButton;
```

The subscriber receives two arguments as date and company id.
 
```
import { useSubscribe } from 'react-pusu';
import refreshPageDataPublication from './publications/refresh-page-data-publication';

const DashboardSatistics = () => {
  const subscribe = useSubscribe();
  
  useEffect(() => {
    const refreshData = (asOf, companyId) => {
      // load the data (may be using redux)
    }

    subscribe(refreshPageDataPublication, refreshData);
  }
   
  return (
    <section>
      // render the statistics here ...
    </section>
  );
};

export default DashboardSatistics;
```

### 2.1

The version 2.1 will allow only one parameter while publishing the data & subscribing to the data.

In the example below, publisher is publishing one JSON object consisting of date and company id.

```
import { publish } from 'pusu';
import refreshPageDataPublication from './publications/refresh-page-data-publication';

const RefreshPageDataButton = ({ company }) => (
  <button
    onClick={()=> {
      // Publish the data 
      publish(publication, { asOfDate: new Date(), companyId: company._id });
    }}
  >
    Refresh
  </button>
);

export default RefreshPageDataButton;
```

The subscriber receives it as the same JSON object consisting of date and company id.

```
import { withSubscribe } from 'react-pusu';
import refreshPageDataPublication from './publications/refresh-page-data-publication';

class DashboardSatistics extends React.Component {
  constructor(props, context) {
    super(props, context);
    props.subscribe(refreshPageDataPublication, this.refreshData);
  }

  refreshData = ({ asOfDate, companyId }) => {
    // load the data (may be using redux)
  }
  
  render() {
    return (
      <section>
        // render the statistics here ...
      </section>
    );
  }
}

export default withSubscribe(DashboardSatistics);
```

```
import { useSubscribe } from 'react-pusu';
import refreshPageDataPublication from './publications/refresh-page-data-publication';

const DashboardSatistics = () => {
  const subscribe = useSubscribe();
  
  useEffect(() => {
    const refreshData = ({ asOfDate, companyId }) => {
      // load the data (may be using redux)
    }

    subscribe(refreshPageDataPublication, refreshData);
  }
   
  return (
    <section>
      // render the statistics here ...
    </section>
  );
};

export default DashboardSatistics;
```

## License

MIT
