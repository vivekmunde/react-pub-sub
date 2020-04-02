import React from 'react';
import _publish from './publish';

const withPublish = Component => {

    class Publish extends React.Component {

        publish = (publication, ...args) => {
            _publish(publication, ...args);
        }

        render() {
            return (
                <Component
                    {...this.props}
                    publish={this.publish}
                />
            );
        }

    }

    return Publish;

}

export default withPublish;
