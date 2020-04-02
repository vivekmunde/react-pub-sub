const validatePublicationSchema = publication => {
    if (!publication) {
        throw new Error('Publication does not exist. Use createPublication([name]) to create a new publication.');
    }

    if (!publication.subscribers) {
        throw new Error(`Subscribers collection not found in the publication '${publication.name}'. Always use createPublication([name]) to create a publication.`);
    }

    return true;
};

export default validatePublicationSchema;
