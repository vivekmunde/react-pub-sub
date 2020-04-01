import validatePublicationSchema from './validate-publication-schema';

const subscribe = (publication, subscriber) => {
    validatePublicationSchema(publication);

    const { subscribers } = publication;

    subscribers.push(subscriber);

    const unsubscribe = () => {
        const index = subscribers.indexOf(subscriber);

        if (index > -1) {
            subscribers.splice(index, 1);
        }
        else {
            console.warn(`Subscriber was already unsubscribed from publication '${publication.name}'.`);
        }
    };

    return unsubscribe;
};

export default subscribe;
