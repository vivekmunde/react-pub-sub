import validatePublicationSchema from './validate-publication-schema';

const publish = (publication, ...args) => {
    validatePublicationSchema(publication);

    const { subscribers } = publication;

    if (subscribers.length > 0) {
        for (const subscriber of subscribers) {
            subscriber(...args);
        }
    }
    else {
        console.warn(`Nobody subscribed for publication '${publication.name}'`);
    }
};

export default publish;
