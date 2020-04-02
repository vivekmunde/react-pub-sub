const createPublication = (name) => {
    if (!name) {
        console.info('Recommended to provide publication name as it can be helpful in debugging the issues.');
    };

    return {
        name: name || 'anonymous',
        subscribers: [],
    };
};

export default createPublication;
