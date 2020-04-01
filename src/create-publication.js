const createPublication = (name) => {
    if (!name) {
        console.warn('Publication name not provided. Publication name is helpful in debugging the issues.');
    };

    return {
        name: name || 'anonymous',
        subscribers: [],
    };
};

export default createPublication;
