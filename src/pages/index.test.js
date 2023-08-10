import React from 'react';

import data from './index.instances.json';
import { render } from './../utils/testUtils';
import {
  PAGE_SIZE,
  SORT_TYPES,
  QUERY_SORT_PREFIX,
} from './../constants/dashboard';

import Dashboard, { Methods, getServerSideProps } from './index';

describe('<Dashboard />', () => {
  let wrapper;
  let defaultProps;
  const getJSONWrapper = () => wrapper.container.firstChild;
  const populateWrapper = (props) => {
    wrapper = render(<Dashboard {...Object.assign(defaultProps, props)} />);
  };

  beforeEach(() => {
    defaultProps = {
      instancesData: {
        instances: data.slice(0, PAGE_SIZE),
        pagination: {
          currentPage: 3,
          pagesAmount: 36,
        },
      },
    };
  });

  describe('Basic', () => {
    it('should have not log errors in console', () => {
      const spy = jest.spyOn(global.console, 'error');

      populateWrapper();
      expect(spy).not.toHaveBeenCalled();
    });

    it('should default export to be a function', () => {
      expect(typeof Dashboard).toEqual('function');
    });
  });

  describe('DOM elements', () => {
    [
      'table-head',
      'search-form',
      'table-table',
      'heading-text',
      'search-button',
      'tabs-container',
      'table-container',
      'table-sort-head-0',
      'table-sort-head-1',
      'table-sort-head-2',
      'table-sort-head-3',
      'table-sort-head-4',
      'table-sort-head-5',
      'table-sort-head-6',
      'search-search-input',
      'search-search-container',
      'search-search-icon-container',
    ].forEach((testIdSufix) => {
      it(`should have an element with testId sufix: ${testIdSufix}`, () => {
        populateWrapper();

        expect(wrapper.getByTestId(`dashboard-${testIdSufix}`)).not.toBe(null);
      });
    });
  });

  describe('Controller', () => {
    let controller;
    let mockProperties;

    beforeEach(() => {
      const {
        instancesData: {
          instances,
          pagination: { pagesAmount, currentPage },
        },
      } = defaultProps;

      mockProperties = {
        testId: 'dashboard',
        searchRef: { current: { value: 'test-search-value' } },
        instances,
        pagesAmount,
        currentPage,

        router: { query: {}, push: jest.fn() },
        getAppendedQueryParams: jest.fn(() => 'test=test'),
      };
      controller = Object.assign(new Methods(), mockProperties);
    });

    describe('common', () => {
      [
        'search',
        'onInit',
        'goPage',
        'getTabs',
        'setFilter',
        'getInstances',
        'applySortRules',
      ].forEach((functionName) => {
        it(`should exist a function called ${functionName}`, () => {
          expect(typeof controller[functionName]).toEqual('function');
        });
      });
    });

    describe('onInit', () => {
      let setFilterSpy;

      beforeEach(() => {
        setFilterSpy = jest.spyOn(controller, 'setFilter');
        setFilterSpy.mockImplementationOnce(() => {});
      });

      it('should avoid to call setFilter controller methods with none filters', () => {
        controller.router.query = {
          page: 1,
          status: Methods.TABS[0].queryId,
        };
        controller.onInit();

        expect(setFilterSpy).toHaveBeenCalledTimes(0);
      });

      it('should call setFilter controller methods with page filter', () => {
        controller.router.query = {
          status: Methods.TABS[0].queryId,
        };
        controller.onInit();

        expect(setFilterSpy).toHaveBeenCalledTimes(1);
        expect(setFilterSpy).toHaveBeenCalledWith([
          {
            key: 'page',
            value: 1,
          },
        ]);
      });

      it('should call setFilter controller methods with status filter', () => {
        controller.router.query = {
          page: 1,
        };
        controller.onInit();

        expect(setFilterSpy).toHaveBeenCalledTimes(1);
        expect(setFilterSpy).toHaveBeenCalledWith([
          {
            key: 'status',
            value: Methods.TABS[0].queryId,
          },
        ]);
      });

      it('should call setFilter controller methods with status and page filters', () => {
        controller.router.query = {};
        controller.onInit();

        expect(setFilterSpy).toHaveBeenCalledTimes(1);
        expect(setFilterSpy).toHaveBeenCalledWith([
          {
            key: 'page',
            value: 1,
          },
          {
            key: 'status',
            value: Methods.TABS[0].queryId,
          },
        ]);
      });
    });

    describe('setFilter', () => {
      const filters = [{ key: 'key', value: 'test-filters' }];

      it('should call getAppendedQueryParams controller function', () => {
        controller.setFilter(filters);

        expect(controller.getAppendedQueryParams).toHaveBeenCalledTimes(1);
        expect(controller.getAppendedQueryParams).toHaveBeenCalledWith(filters);
      });

      it('should call router push', () => {
        controller.setFilter(filters);

        expect(controller.router.push).toHaveBeenCalledTimes(1);
        expect(controller.router.push).toHaveBeenCalledWith(`/?test=test`);
      });
    });

    describe('applySortRules', () => {
      it('should call setFilter controller function', () => {
        const spy = jest.spyOn(controller, 'setFilter');
        const sortRules = [
          {
            key: 'query-test',
            value: SORT_TYPES.NONE,
          },
          {
            key: 'query-test2',
            value: SORT_TYPES.ASC,
          },
        ];

        spy.mockImplementationOnce(() => {});
        controller.applySortRules(sortRules);

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith([
          {
            value: null,
            key: 'query-test',
          },
          {
            key: 'query-test2',
            value: SORT_TYPES.ASC,
          },
        ]);
      });
    });

    describe('getTabs', () => {
      it('should match the snapshot', () => {
        controller.router.query = {
          status: Methods.TABS[0].queryId,
        };

        expect(controller.getTabs()).toMatchSnapshot();
      });
    });

    describe('search', () => {
      it('should call setFilter controller function with corresponding filter', () => {
        const spy = jest.spyOn(controller, 'setFilter');
        const searchTerm = 'searchTerm';

        spy.mockImplementationOnce(() => {});
        controller.search(searchTerm);

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith([
          {
            value: 1,
            key: 'page',
          },
          {
            key: 'searchBy',
            value: searchTerm,
          },
        ]);
      });

      it('should call setFilter controller function with null', () => {
        const spy = jest.spyOn(controller, 'setFilter');

        spy.mockImplementationOnce(() => {});
        controller.search();

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith([
          {
            value: 1,
            key: 'page',
          },
          {
            value: null,
            key: 'searchBy',
          },
        ]);
      });
    });

    describe('goPage', () => {
      it('should call setFilter controller function', () => {
        const newPage = 1;
        const spy = jest.spyOn(controller, 'setFilter');

        spy.mockImplementationOnce(() => {});
        controller.goPage(newPage);

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith([{ key: 'page', value: newPage }]);
      });
    });

    describe('getInstances', () => {
      it('should match the snapshot', () => {
        expect(controller.getInstances()).toMatchSnapshot();
      });
    });
  });

  describe('getServerSideProps', () => {
    let windowSpy;

    beforeEach(() => {
      windowSpy = jest.spyOn(window, 'window', 'get');
      windowSpy.mockImplementation(() => undefined);
    });

    afterEach(() => {
      windowSpy.mockRestore();
    });

    it('should be a function', () => {
      expect(typeof getServerSideProps).toEqual('function');
    });
    [
      ['page', { page: 1 }],
      ['page', { page: 12 }],
      ['status', { status: Methods.TABS[0].queryId }],
      ['status', { status: Methods.TABS[1].queryId }],
      ['status', { status: Methods.TABS[2].queryId }],
      ['search term', { searchBy: 'l' }],
      ['search term', { searchBy: 'la' }],
      ['search term', { searchBy: 'testing' }],
      [
        'page and status',
        {
          page: 2,
          status: Methods.TABS[0].queryId,
        },
      ],
      [
        'page, status and search term',
        {
          page: 2,
          searchTerm: 'a',
          status: Methods.TABS[1].queryId,
        },
      ],
      [
        'page, status, search term and sort by id',
        {
          page: 2,
          searchTerm: 'a',
          status: Methods.TABS[1].queryId,
          [`${QUERY_SORT_PREFIX}id`]: SORT_TYPES.ASC,
        },
      ],
    ].forEach(([filterByName, query]) => {
      it(`should filter by ${filterByName}`, () => {
        expect(getServerSideProps({ query })).toMatchSnapshot();
      });
    });
  });

  describe('Snapshot testing', () => {
    it('with defaultProps', () => {
      populateWrapper();

      expect(getJSONWrapper()).toMatchSnapshot();
    });
  });
});
