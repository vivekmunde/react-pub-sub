# react-pub-sub

Simple `pub-sub` APIs & HOCs for [React](https://reactjs.org/) Components.

## createPublication([name])
**Parameters**:
- `name`: *(Optional)* String 
Publication name. Helpful in debugging. 

**Return value**: New publication (object).

Creates & returns a unique new publication object. **Creation of the publication in this way makes sure that each publication is unique in itself and removes the need of maintaining a unique key for each publication.** Meaning, even if multiple publications created with same `name`, then each publication will be treated as a separate publication without any conflicts.

```
// refresh-page-data-publication.js

import { createPublication } from 'react-pub-sub';

export default createPublication('Refresh Page Data');
```

Below code create two separate unique publications `publication1` & `publication2` even though the name supplied is same. Name is just for the sake of naming the publication so that its useful during debugging any issues.

```
import { createPublication } from 'react-pub-sub';

const publication1 = createPublication('Refresh Page Data');
const publication2 = createPublication('Refresh Page Data');

console.log(publication1 === publication2); //false
```


## publish(publication [, ... nParams])
**Parameters**:
- `publication`: *(Required)* Object
Publication object created using the api `createPublication()`
- `[, ... nParams]`: *(Optional)* Any
These parameters/arguments are passed as is to the subscribers listening to the publication. Its a way of passing data to the subscribers.

`publish` method calls all the subscribers subscribed to the `publication` (provided as a first argument). It calls the subscribers with all the rest of the arguments/data (`[, ... nParams]`).

```
import { publish } from 'react-pub-sub';
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
- `publication`: *(Required)* Object
Publication object created using the api `createPublication`
- `subscriber`: *(Required)* Function
A subscriber function which will be called by the publisher. This function will receive any argument(s) i.e. data published by the publisher.

**Return value**: Function
A function when called then the `subscriber` is unsubscribed and no longer called by the publisher.

```
import { subscribe } from 'react-pub-sub';
import refreshPageDataPublication from './publications/refresh-page-data-publication';

class DashboardCompanySatistics extends React.Component {
  constructor(props, context) {
    super(props, context);

    // Subscribe to the publication
    this.unsubscribe = props.subscribe(refreshPageDataPublication, this.refreshData);
  }

  refreshData = (asOf, companyId) => {
    // load the data as of "asOf" date (may be using redux)
  }

  componentWillUnmount() {
    // Unsubscribe from the publication
    if(this.unsubscribe) {
      this.unsubscribe();
    }

    // Note: 
    // Using HOC `withSubscribe` removes the need of above unsubscribe implementation, which is explained in the next sections. 
  }
  
  render() {
    return (
      <section>
        // render the statistics here ...
      </section>
    );
  }
}

export default withPublish(DashboardCompanySatistics);
```

## withPublish(Component)
**Parameters**:
- `Component`: *(Required)* React Component

`withPublish` supplies the function `publish` as a property to the React Component. The Component can publish data using this function.

```
import { withPublish } from 'react-pub-sub';
import refreshPageDataPublication from './publications/refresh-page-data-publication';

const RefreshPageDataButton = ({ publish, company }) => (
  <button
    onClick={()=> {
      publish(publication, new Date(), company._id);
    }}
  >
    Refresh
  </button>
);

export default withPublish(RefreshPageDataButton);
```

## withSubscribe(Component)
**Parameters**:
- `Component`: *(Required)* React Component

`withSubscribe` supplies a function `subscribe` as a property to the React Component. The Component can subscribe to the publication and can receive the data using this function.
It makes sure that all the subscriptions are removed or unsubscribed before the component is unmounted. This way the consumer React Component can use the `props.subscribe`, even multiple times, without worrying about unsubscribing before its unmounted.

```
import { withSubscribe } from 'react-pub-sub';
import refreshPageDataPublication from './publications/refresh-page-data-publication';

class DashboardCompanySatistics extends React.Component {
  constructor(props, context) {
    super(props, context);
    props.subscribe(refreshPageDataPublication, this.refreshData);
  }

  refreshData = (asOf, companyId) => {
    // load the data as of "asOf" date (may be using redux)
  }
  
  render() {
    return (
      <section>
        // render the statistics here ...
      </section>
    );
  }
}

export default withPublish(DashboardCompanySatistics);
```
