# Migrating from 1.1 to 1.2 & from 2.0 to 2.1


## Breaking change

The versions 1.2 & 2.1 will allow only one parameter while publishing the data & subscribing to the data.


### 1.1 & 2.0

The versions 1.1 & 2.0 were allowing more than one parameters while publishing the data.

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

const DashboardCompanySatistics = () => {
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

export default DashboardCompanySatistics;
```


### 1.2 & 2.1

The versions 1.2 & 2.1 will allow only one parameter while publishing the data & subscribing to the data.

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

class DashboardCompanySatistics extends React.Component {
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

export default withSubscribe(DashboardCompanySatistics);
```

#### 2.1

```
import { useSubscribe } from 'react-pusu';
import refreshPageDataPublication from './publications/refresh-page-data-publication';

const DashboardCompanySatistics = () => {
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

export default DashboardCompanySatistics;
```
