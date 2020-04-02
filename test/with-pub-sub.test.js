import React from 'react';
import { mount } from 'enzyme';
import createPublication from '../src/create-publication';
import withPublish from '../src/with-publish';
import withSubscribe from '../src/with-subscribe';

describe('with-pub-sub', () => {
    test('Should publish & call the subscribers with args', () => {
        expect.hasAssertions();

        const testData = 'test-data';

        const publication = createPublication('test');

        const PublisherHoc = withPublish(({ publish }) => (
            <button
                id="btn1"
                onClick={() => {
                    publish(publication, testData);
                }}
            >
                Publisher
            </button>
        ));

        const subscriber1Listener = jest.fn(() => { });

        class Subscriber1 extends React.Component {
            constructor(props, context) {
                super(props, context);
                this.state = { data: 'none' };
                props.subscribe(publication, this.subscriber);
            }

            subscriber = (data) => {
                this.setState({ data });
                subscriber1Listener(data);
            }

            render() {
                return (
                    <div
                        id="div1"
                    >
                        {this.state.data}
                    </div>
                )
            }
        }

        const subscriber2Listener = jest.fn(() => { });

        class Subscriber2 extends React.Component {
            constructor(props, context) {
                super(props, context);
                this.state = { data: 'none' };
                props.subscribe(publication, this.subscriber);
            }

            subscriber = (data) => {
                this.setState({ data });
                subscriber2Listener(data);
            }

            render() {
                return (
                    <span
                        id="span2"
                    >
                        {this.state.data}
                    </span>
                )
            }
        }

        const SubscriberHoc1 = withSubscribe(Subscriber1);
        const SubscriberHoc2 = withSubscribe(Subscriber2);

        const wrapper = mount(
            <div>
                <PublisherHoc />
                <SubscriberHoc1 />
                <SubscriberHoc2 />
            </div>
        );

        expect(wrapper.find('#div1').text()).toEqual('none');
        expect(wrapper.find('#span2').text()).toEqual('none');

        wrapper.find('#btn1').simulate('click');

        expect(wrapper.find('#div1').text()).toEqual(testData);
        expect(wrapper.find('#span2').text()).toEqual(testData);
        expect(subscriber1Listener).toHaveBeenCalledTimes(1);
        expect(subscriber2Listener).toHaveBeenCalledTimes(1);
    });

    test('Should unsubscribe from publication on component removal', () => {
        expect.hasAssertions();

        let testData = 'test-data-1';

        const publication = createPublication('test');

        const PublisherHoc = withPublish(({ publish }) => (
            <button
                id="btn1"
                onClick={() => {
                    publish(publication, testData);
                }}
            >
                Publisher
            </button>
        ));

        const subscriber1Listener = jest.fn(() => { });

        class Subscriber1 extends React.Component {
            constructor(props, context) {
                super(props, context);
                props.subscribe(publication, subscriber1Listener);
            }

            render() {
                return (
                    <div
                        id="div1"
                    >
                        Subscriber1
                    </div>
                )
            }
        }

        const subscriber2Listener = jest.fn(() => { });

        class Subscriber2 extends React.Component {
            constructor(props, context) {
                super(props, context);
                props.subscribe(publication, subscriber2Listener);
            }

            render() {
                return (
                    <span
                        id="span2"
                    >
                        Subscriber2
                    </span>
                )
            }
        }

        const SubscriberHoc1 = withSubscribe(Subscriber1);
        const SubscriberHoc2 = withSubscribe(Subscriber2);

        class MainComponent extends React.Component {
            constructor(props, context) {
                super(props, context);
                this.state = { show: true };
            }

            toggle = () => {
                this.setState({ show: !this.state.show });
            }

            render() {
                return (
                    <div>
                        <PublisherHoc />
                        <SubscriberHoc1 />
                        <button
                            id="btnToggle"
                            onClick={this.toggle}
                        >
                            Toggle
                        </button>
                        {this.state.show && <SubscriberHoc2 />}
                    </div>
                )
            }
        }

        const wrapper = mount(
            <MainComponent />
        );

        wrapper.find('#btn1').simulate('click');

        expect(subscriber1Listener).toHaveBeenCalledWith(testData);
        expect(subscriber2Listener).toHaveBeenCalledWith(testData);
        expect(subscriber1Listener).toHaveBeenCalledTimes(1);
        expect(subscriber2Listener).toHaveBeenCalledTimes(1);

        testData = 'test-data-2';

        wrapper.find('#btnToggle').simulate('click');
        wrapper.find('#btn1').simulate('click');

        expect(subscriber1Listener).toHaveBeenCalledWith(testData);
        expect(subscriber1Listener).toHaveBeenCalledTimes(2);
        expect(subscriber2Listener).toHaveBeenCalledTimes(1);

        testData = 'test-data-3';

        wrapper.find('#btnToggle').simulate('click');
        wrapper.find('#btn1').simulate('click');

        expect(subscriber1Listener).toHaveBeenCalledWith(testData);
        expect(subscriber2Listener).toHaveBeenCalledWith(testData);
        expect(subscriber1Listener).toHaveBeenCalledTimes(3);
        expect(subscriber2Listener).toHaveBeenCalledTimes(2);
    });
});
