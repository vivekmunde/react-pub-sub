import createPublication from '../src/create-publication';

describe('createPublication()', () => {
    test('Should return new publication object', () => {
        expect.hasAssertions();
        expect(createPublication('publication-name')).toEqual({ name: 'publication-name', subscribers: [] });
    });

    test(`Should return new publication object with name as 'anonymous'`, () => {
        expect.hasAssertions();
        expect(createPublication()).toEqual({ name: 'anonymous', subscribers: [] });
    });
});
