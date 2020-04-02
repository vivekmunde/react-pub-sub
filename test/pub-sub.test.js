import createPublication from '../src/create-publication';
import publish from '../src/publish';
import subscribe from '../src/subscribe';

describe('pub-sub', () => {
    test('Should publish & call the subscribers with args', () => {
        expect.hasAssertions();

        const testData1 = 'test-data1';
        const testData2 = { data: 'test-data2' };
        const testData3 = ['test-data3'];

        const publication = createPublication('test');

        const subscriber1 = jest.fn(val => val);
        const subscriber2 = jest.fn(val => val);

        const unsubscribe1 = subscribe(publication, subscriber1);
        const unsubscribe2 = subscribe(publication, subscriber2);

        publish(publication, testData1, testData2, testData3)

        expect(subscriber1).toHaveBeenCalledWith(testData1, testData2, testData3);
        expect(subscriber2).toHaveBeenCalledWith(testData1, testData2, testData3);

        unsubscribe1();
        unsubscribe2();
    });

    test('Should remove subscribers on unsubscribe', () => {
        expect.hasAssertions();

        const publication = createPublication('test');

        const subscriber1 = jest.fn(val => val);
        const subscriber2 = jest.fn(val => val);

        const unsubscribe1 = subscribe(publication, subscriber1);
        const unsubscribe2 = subscribe(publication, subscriber2);

        publish(publication, 'value1')

        expect(subscriber1).toHaveBeenCalledWith('value1');
        expect(subscriber2).toHaveBeenCalledWith('value1');

        unsubscribe1();

        publish(publication, 'value2')

        expect(subscriber2).toHaveBeenCalledWith('value2');

        unsubscribe2();

        publish(publication, 'value3')

        expect(subscriber1).toHaveBeenCalledTimes(1);
        expect(subscriber2).toHaveBeenCalledTimes(2);
    });
});
