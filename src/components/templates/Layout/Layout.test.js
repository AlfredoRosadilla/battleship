import React from 'react';

import { render } from './../../../utils/testUtils';

import Layout, { Methods } from './index';

describe('<Layout />', () => {
  let wrapper;
  let defaultProps;
  const getJSONWrapper = () => wrapper.container.firstChild;
  const populateWrapper = (props) => {
    wrapper = render(<Layout {...Object.assign(defaultProps, props)} />);
  };

  beforeEach(() => {
    defaultProps = {
      testId: 'test-id',
      children: <div />,
    };
  });

  describe('Basic', () => {
    it('should have not log errors in console', () => {
      const spy = jest.spyOn(global.console, 'error');

      populateWrapper();
      expect(spy).not.toHaveBeenCalled();
    });

    it('should default export to be a function', () => {
      expect(typeof Layout).toEqual('function');
    });
  });

  describe('DOM elements', () => {
    ['container'].forEach((testIdSufix) => {
      it(`should have an element with testId sufix: ${testIdSufix}`, () => {
        populateWrapper();

        expect(
          wrapper.getByTestId(`${defaultProps.testId}-${testIdSufix}`),
        ).not.toBe(null);
      });
    });
  });

  describe('Snapshot testing', () => {
    it('with defaultProps', () => {
      populateWrapper();

      expect(getJSONWrapper()).toMatchSnapshot();
    });

    it('with className', () => {
      populateWrapper({
        className: 'test-class-name',
      });

      expect(getJSONWrapper()).toMatchSnapshot();
    });
  });
});
