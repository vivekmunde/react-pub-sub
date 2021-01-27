import React, { useEffect, useRef, useState } from 'react';
import { mount } from 'enzyme';
import { createPublication } from 'pusu';
import withPublish from '../src/with-publish';
import withSubscribe from '../src/with-subscribe';
import useSubscribe from '../src/use-subscribe';

describe('with-pub-sub', () => {
  test('Should publish & call the subscribers with args', () => {
    expect.hasAssertions();

    const testData1 = 'test-data1';
    const testData2 = { data: 'test-data2' };
    const testData3 = ['test-data3', 'test-data3'];

    const publication = createPublication('test');

    const PublisherHoc = withPublish(({ publish }) => (
      <button
        id="btn1"
        onClick={() => {
          publish(publication, testData1, testData2, testData3);
        }}
      >
        Publisher
      </button>
    ));

    const subscriber1Listener = jest.fn(() => { });

    class Subscriber1 extends React.Component {
      constructor(props, context) {
        super(props, context);
        this.state = {
          data: {
            testData1: null, testData2: { data: null }, testData3: []
          }
        };
        props.subscribe(publication, this.subscriber);
      }

      subscriber = (testData1, testData2, testData3) => {
        this.setState({ data: { testData1, testData2, testData3 } });
        subscriber1Listener(testData1, testData2, testData3);
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

    const subscriber2Listener = jest.fn(() => { });

    const Subscriber2 = () => {
      const [state, setState] = useState({
        data: {
          testData1: null, testData2: { data: null }, testData3: []
        }
      });

      const subscribe = useSubscribe();

      useEffect(() => {
        const subscriber = (testData1, testData2, testData3) => {
          setState({ data: { testData1, testData2, testData3 } });
          subscriber2Listener(testData1, testData2, testData3);
        };
        subscribe(publication, subscriber);
      }, []);

      return (
        <span
          id="span2"
        >
          {state.data.testData1}{state.data.testData2.data}{state.data.testData3.join('')}
        </span>
      );
    }

    const SubscriberHoc1 = withSubscribe(Subscriber1);

    const wrapper = mount(
      <div>
        <PublisherHoc />
        <SubscriberHoc1 />
        <Subscriber2 />
      </div>
    );

    expect(wrapper.find('#div1').text()).toEqual('');
    expect(wrapper.find('#span2').text()).toEqual('');

    wrapper.find('#btn1').simulate('click');

    expect(wrapper.find('#div1').text()).toEqual(`${testData1}${testData2.data}${testData3.join('')}`);
    expect(wrapper.find('#span2').text()).toEqual(`${testData1}${testData2.data}${testData3.join('')}`);
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

    const Subscriber2 = () => {
      const subscribe = useSubscribe();

      useEffect(() => {
        subscribe(publication, subscriber2Listener);
      });

      return (
        <span
          id="span2"
        >
          Subscriber2
        </span>
      );
    };

    const SubscriberHoc1 = withSubscribe(Subscriber1);

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
            {this.state.show && <Subscriber2 />}
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

  test('Should unsubscribe when called to unsubscribe explicitly', () => {
    expect.hasAssertions();

    const testData1 = 'test-data1';

    const publication = createPublication('test');

    const PublisherHoc = withPublish(({ publish }) => (
      <button
        id="btn1"
        onClick={() => {
          publish(publication, testData1);
        }}
      >
        Publisher
      </button>
    ));

    const subscriber1Listener = jest.fn(() => { });
    const subscriber2Listener = jest.fn(() => { });

    class Subscriber1 extends React.Component {
      constructor(props, context) {
        super(props, context);
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

    const Subscriber2 = () => {
      const [state, setState] = useState({
        data: {
          testData1: null, testData2: { data: null }, testData3: []
        }
      });

      const ref = useRef({ unsubscribe: () => { } });
      const subscribe = useSubscribe();

      useEffect(() => {
        const subscriber = (testData1) => {
          setState({ data: { testData1 } });
          subscriber2Listener(testData1);
        }

        ref.current.unsubscribe = subscribe(publication, subscriber);
      }, []);

      const handleUnsubscribe = () => {
        ref.current.unsubscribe();
      }

      return (
        <div>
          <div
            id="div3"
          >
            {state.data.testData1}
          </div>
          <button
            id="btn3"
            onClick={handleUnsubscribe}
          >
            Unsubscribe
            </button>
        </div>
      );
    };

    const SubscriberHoc1 = withSubscribe(Subscriber1);

    const wrapper = mount(
      <div>
        <PublisherHoc />
        <SubscriberHoc1 />
        <Subscriber2 />
      </div>
    );

    wrapper.find('#btn1').simulate('click');

    expect(subscriber1Listener).toHaveBeenCalledTimes(1);
    expect(subscriber2Listener).toHaveBeenCalledTimes(1);

    wrapper.find('#btn1').simulate('click');

    expect(subscriber1Listener).toHaveBeenCalledTimes(2);
    expect(subscriber2Listener).toHaveBeenCalledTimes(2);

    wrapper.find('#btn2').simulate('click');
    wrapper.find('#btn3').simulate('click');

    wrapper.find('#btn1').simulate('click');

    expect(subscriber1Listener).toHaveBeenCalledTimes(2);
    expect(subscriber2Listener).toHaveBeenCalledTimes(2);
  });

  test('Should not error on calling unsubscribe again even when it was unsubscribed explicitly before component removal', () => {
    expect.hasAssertions();

    const testData1 = 'test-data1';

    const publication = createPublication('test');

    const PublisherHoc = withPublish(({ publish }) => (
      <button
        id="btn1"
        onClick={() => {
          publish(publication, testData1);
        }}
      >
        Publisher
      </button>
    ));

    const subscriber1Listener = jest.fn(() => { });
    const subscriber2Listener = jest.fn(() => { });

    class Subscriber1 extends React.Component {
      constructor(props, context) {
        super(props, context);
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

    const Subscriber2 = () => {
      const [state, setState] = useState({
        data: {
          testData1: null, testData2: { data: null }, testData3: []
        }
      });

      const ref = useRef({ unsubscribe: () => { } });
      const subscribe = useSubscribe();

      useEffect(() => {
        const subscriber = (testData1) => {
          setState({ data: { testData1 } });
          subscriber2Listener(testData1);
        }

        ref.current.unsubscribe = subscribe(publication, subscriber);
      }, []);

      const handleUnsubscribe = () => {
        ref.current.unsubscribe();
      }

      return (
        <div>
          <div
            id="div3"
          >
            {state.data.testData1}
          </div>
          <button
            id="btn3"
            onClick={handleUnsubscribe}
          >
            Unsubscribe
            </button>
        </div>
      );
    };

    const SubscriberHoc1 = withSubscribe(Subscriber1);

    const wrapper1 = mount(
      <PublisherHoc />
    );

    const wrapper2 = mount(
      <SubscriberHoc1 />
    );

    const wrapper3 = mount(
      <Subscriber2 />
    );

    wrapper1.find('#btn1').simulate('click');

    wrapper2.find('#btn2').simulate('click');
    wrapper3.find('#btn3').simulate('click');

    wrapper2.unmount();
    wrapper3.unmount();

    wrapper1.find('#btn1').simulate('click');

    expect(subscriber1Listener).toHaveBeenCalledTimes(1);
    expect(subscriber2Listener).toHaveBeenCalledTimes(1);
  });
});
