# react-pusu 

Simple `pub-sub` implementation APIs, HOCs for [React](https://reactjs.org/) Components.

> **Pub-Sub** implementation is one of the effective ways and most useful when the components, which are rendered across the page, even under different component hierarchies, need to communicate with each other.
A simple example can be, a data refresh button placed in the header of the application. On click of this button the page should reload the data from server. There can be multiple pages which may need this type of functionality. Also, there can be multiple sections on a page which need to reload the data using their own API calls (may be using redux). So all these pages & components can actually subscribe to the refresh publication event. The refresh button can, on click, publish the event. And then all the subscribers can reload the data (may be using redux) from server by calling their own apis.

## Compatibility
| React Version | react-pusu Compatibility |
|--|--|
| >= React@16.8 | ^2.0.0 |
| React@15, <= React@16.7 | ^1.0.0 |

## createPublication([name])
**Parameters**:
- `name`: *(Optional)* String - Publication name. Useful in debugging.

**Return value**: Object - New publication

Creates & returns a unique new publication object.

Publication object is a simple javascript object `{ subscribers: [] }` which has an array named `subscribers`. The array `subscribers` actually holds the references to the subscriber functions. Result is, all the subscribers (i.e. functions) of the publication are mapped inside the publication object itself. Whenever a publiser publishes any data for a publication then all the subscribers inside the publication are called with this data.

```
// refresh-page-data-publication.js

import { createPublication } from 'react-pusu';

export default createPublication('Refresh Page Data');
```

### Unique publication every time

**Creation of a publication makes sure that each publication is unique in itself and removes the need of maintaining a unique key for each publication.**

Even if multiple publications created with same `name`, then each publication will be treated as a separate publication without any conflicts.

Below code creates two separate unique publications `publication1` & `publication2` even though the publication names are same. Name is just for the sake of naming the publication so that its useful during debugging any issues.

```
import { createPublication } from 'react-pusu';

const publication1 = createPublication('Refresh Page Data');
const publication2 = createPublication('Refresh Page Data');

console.log(publication1 === publication2); //false
```

## publish(publication [, ... nParams])
**Parameters**:
- `publication`: *(Required)* Object - Publication object created using the api `createPublication()`
- `[, ... nParams]`: *(Optional)* Any - These parameters/arguments are passed as is to the subscribers listening to the publication. Its a way of passing data to the subscribers.

`publish` method calls all the subscribers subscribed to the `publication` (provided as a first argument). It calls the subscribers with all the rest of the arguments/data (`[, ... nParams]`).

```
import { publish } from 'react-pusu';
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

## subscribe(publication, subscriber)
**Parameters**:
- `publication`: *(Required)* Object - Publication object created using the api `createPublication`
- `subscriber`: *(Required)* Function - A subscriber function which will be called by the publisher. This function will receive any argument(s) i.e. data published by the publisher.

**Return value**: Function - A function when called then the `subscriber` is unsubscribed and no longer called by the publisher.

> Using HOC `withSubscribe` removes the need of unsubscribe implementation, which is explained in the later section.

```
import { subscribe } from 'react-pusu';
import refreshPageDataPublication from './publications/refresh-page-data-publication';

class DashboardCompanySatistics extends React.Component {
  constructor(props, context) {
    super(props, context);

    // Subscribe to the publication
    this.unsubscribe = props.subscribe(refreshPageDataPublication, this.refreshData);
  }

  refreshData = (asOf, companyId) => {
    // load the data (may be using redux)
  }

  componentWillUnmount() {
    // Unsubscribe from the publication
    if(this.unsubscribe) {
      this.unsubscribe();
    }

    // Note: 
    // Using HOC `withSubscribe` removes the need of above unsubscribe implementation, which is explained in the later section. 
  }
  
  render() {
    return (
      <section>
        // render the statistics here ...
      </section>
    );
  }
}

export default DashboardCompanySatistics;
```

## withSubscribe(Component)
**Parameters**:
- `Component`: *(Required)* - React Component

`withSubscribe` supplies a function `subscribe` as a property to the React Component. The Component can subscribe to the publication and can receive the data using this function, whenver the publisher publishes it.

**`withSubscribe` makes sure that all the subscriptions are removed/unsubscribed before the component is unmounted.** This way the consumer React Component can use the `props.subscribe`, even multiple times, without worrying about unsubscribing before it is unmounted.

```
import { withSubscribe } from 'react-pusu';
import refreshPageDataPublication from './publications/refresh-page-data-publication';

class DashboardCompanySatistics extends React.Component {
  constructor(props, context) {
    super(props, context);
    props.subscribe(refreshPageDataPublication, this.refreshData);
  }

  refreshData = (asOf, companyId) => {
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

export default withSubscribe(DashboardCompanySatistics);
```

#### Unsubscribing explicitely 
`props.subscribe`, when called, returns a function which can be called to unsubscribe from the publication. Sometimes component may need to unsubscribe based on some condition or action, for those cases the function returned by `props.subscribe` can be called to unsubscribe.

```
import { withSubscribe } from 'react-pusu';
import refreshPageDataPublication from './publications/refresh-page-data-publication';

class DashboardCompanySatistics extends React.Component {
  constructor(props, context) {
    super(props, context);

    // Assign the unsubscriber function to the class member/variable
    this.unsubscribeFromRefreshPublication = props.subscribe(refreshPageDataPublication, this.refreshData);
  }

  refreshData = (asOf, companyId) => {
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

export default withSubscribe(DashboardCompanySatistics);
```

## License

MIT
