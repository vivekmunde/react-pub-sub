import { mount } from 'enzyme';
import React from 'react';
import { createPublication, publish, withSubscribe } from '../lib/es';

describe('pub-sub', () => {
  test('Should publish & call the subscribers with args', () => {
    expect.hasAssertions();

    const testData1 = 'test-data1';
    const testData2 = { data: 'test-data2' };
    const testData3 = ['test-data3', 'test-data3'];

    const publication = createPublication('test');

    const PublisherHoc = () => (
      <button
        id="btn1"
        onClick={() => {
          publish(publication, { testData1, testData2, testData3 });
        }}
      >
        Publisher
      </button>
    );

    const subscriber1Listener = jest.fn(() => { });

    class Subscriber1 extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          data: {
            testData1: null, testData2: { data: null }, testData3: []
          }
        };
        props.subscribe(publication, this.subscriber);
      }

      subscriber = ({ testData1, testData2, testData3 }) => {
        this.setState({ data: { testData1, testData2, testData3 } });
        subscriber1Listener({ testData1, testData2, testData3 });
      }

      render() {
        return (
          <div
            id="div1"
          >
            {this.state.data.testData1}{this.state.data.testData2.data}{this.state.data.testData3.join('')}
          </div>
        )
      }
    }

    const SubscriberHoc1 = withSubscribe(Subscriber1);

    const wrapper = mount(
      <div>
        <PublisherHoc />
        <SubscriberHoc1 />
      </div>
    );

    expect(wrapper.find('#div1').text()).toEqual('');

    wrapper.find('#btn1').simulate('click');

    expect(wrapper.find('#div1').text()).toEqual(`${testData1}${testData2.data}${testData3.join('')}`);
    expect(subscriber1Listener).toHaveBeenCalledTimes(1);
  });

  test('Should unsubscribe from publication on component removal', () => {
    expect.hasAssertions();

    let testData = 'test-data-1';

    const publication = createPublication('test');

    const PublisherHoc = () => (
      <button
        id="btn1"
        onClick={() => {
          publish(publication, testData);
        }}
      >
        Publisher
      </button>
    );

    const subscriber1Listener = jest.fn(() => { });

    class Subscriber1 extends React.Component {
      constructor(props) {
        super(props);
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

    const SubscriberHoc1 = withSubscribe(Subscriber1);

    class MainComponent extends React.Component {
      constructor(props) {
        super(props);
        this.state = { show: true };
      }

      toggle = () => {
        this.setState({ show: !this.state.show });
      }

      render() {
        return (
          <div>
            <PublisherHoc />
            <button
              id="btnToggle"
              onClick={this.toggle}
            >
              Toggle
            </button>
            {this.state.show && <SubscriberHoc1 />}
          </div>
        )
      }
    }

    const wrapper = mount(
      <MainComponent />
    );

    wrapper.find('#btn1').simulate('click');

    expect(subscriber1Listener).toHaveBeenCalledWith(testData);
    expect(subscriber1Listener).toHaveBeenCalledTimes(1);

    wrapper.find('#btnToggle').simulate('click');
    wrapper.find('#btn1').simulate('click');

    expect(subscriber1Listener).toHaveBeenCalledWith(testData);
    expect(subscriber1Listener).toHaveBeenCalledTimes(1);

    testData = 'test-data-2';

    wrapper.find('#btnToggle').simulate('click');
    wrapper.find('#btn1').simulate('click');

    expect(subscriber1Listener).toHaveBeenCalledWith(testData);
    expect(subscriber1Listener).toHaveBeenCalledTimes(2);
  });

  test('Should unsubscribe when called to unsubscribe explicitly', () => {
    expect.hasAssertions();

    const testData1 = 'test-data1';

    const publication = createPublication('test');

    const PublisherHoc = () => (
      <button
        id="btn1"
        onClick={() => {
          publish(publication, testData1);
        }}
      >
        Publisher
      </button>
    );

    const subscriber1Listener = jest.fn(() => { });

    class Subscriber1 extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          data: {
            testData1: null, testData2: { data: null }, testData3: []
          }
        };
        this.unsubscribe = props.subscribe(publication, this.subscriber);
      }

      subscriber = (testData1) => {
        this.setState({ data: { testData1 } });
        subscriber1Listener(testData1);
      }

      handleUnsubscribe = () => {
        this.unsubscribe();
      }

      render() {
        return (
          <div>
            <div
              id="div2"
            >
              {this.state.data.testData1}
            </div>
            <button
              id="btn2"
              onClick={this.handleUnsubscribe}
            >
              Unsubscribe
            </button>
          </div>
        )
      }
    }

    const SubscriberHoc1 = withSubscribe(Subscriber1);

    const wrapper = mount(
      <div>
        <PublisherHoc />
        <SubscriberHoc1 />
      </div>
    );

    wrapper.find('#btn1').simulate('click');

    expect(subscriber1Listener).toHaveBeenCalledTimes(1);

    wrapper.find('#btn1').simulate('click');

    expect(subscriber1Listener).toHaveBeenCalledTimes(2);

    wrapper.find('#btn2').simulate('click');

    wrapper.find('#btn1').simulate('click');

    expect(subscriber1Listener).toHaveBeenCalledTimes(2);
  });

  test('Should not error on calling unsubscribe again even when it was unsubscribed explicitly before component removal', () => {
    expect.hasAssertions();

    const testData1 = 'test-data1';

    const publication = createPublication('test');

    const PublisherHoc = () => (
      <button
        id="btn1"
        onClick={() => {
          publish(publication, testData1);
        }}
      >
        Publisher
      </button>
    );

    const subscriber1Listener = jest.fn(() => { });

    class Subscriber1 extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          data: {
            testData1: null, testData2: { data: null }, testData3: []
          }
        };
        this.unsubscribe = props.subscribe(publication, this.subscriber);
      }

      subscriber = (testData1) => {
        this.setState({ data: { testData1 } });
        subscriber1Listener(testData1);
      }

      handleUnsubscribe = () => {
        this.unsubscribe();
      }

      render() {
        return (
          <div>
            <div
              id="div2"
            >
              {this.state.data.testData1}
            </div>
            <button
              id="btn2"
              onClick={this.handleUnsubscribe}
            >
              Unsubscribe
            </button>
          </div>
        )
      }
    }

    const SubscriberHoc1 = withSubscribe(Subscriber1);

    const wrapper1 = mount(
      <PublisherHoc />
    );

    const wrapper2 = mount(
      <SubscriberHoc1 />
    );

    wrapper1.find('#btn1').simulate('click');

    wrapper2.find('#btn2').simulate('click');

    wrapper2.unmount();

    wrapper1.find('#btn1').simulate('click');

    expect(subscriber1Listener).toHaveBeenCalledTimes(1);
  });
});
