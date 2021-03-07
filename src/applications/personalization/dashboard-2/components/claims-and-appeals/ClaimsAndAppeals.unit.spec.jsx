import React from 'react';
import moment from 'moment';
import { expect } from 'chai';

import { mockFetch, resetFetch } from '~/platform/testing/unit/helpers';
import { renderInReduxProvider } from '~/platform/testing/unit/react-testing-library-helpers';

import reducers from '~/applications/personalization/dashboard/reducers';
import ClaimsAndAppeals from './ClaimsAndAppeals';

function claimsAppealsUser() {
  return {
    profile: {
      services: ['appeals-status', 'evss-claims'],
    },
  };
}

function wait(timeout) {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}

// returns a date string in the format: '1999-01-31'
function daysAgo(days) {
  const oneDayInMS = 24 * 60 * 60 * 1000;
  const now = Date.now();
  return moment(now - oneDayInMS * days).format('YYYY-MM-DD');
}

describe('ClaimsAndAppeals component', () => {
  let view;
  let initialState;
  describe('data loading', () => {
    context(
      'when user lacks both the `appeals-status` and `evss-claims` services',
      () => {
        beforeEach(() => {
          mockFetch();
          initialState = {
            user: {
              profile: {
                services: [],
              },
            },
          };
          view = renderInReduxProvider(<ClaimsAndAppeals />, {
            initialState,
            reducers,
          });
        });
        afterEach(() => {
          resetFetch();
        });
        it('should not attempt to get claims or appeals data', async () => {
          // Because fetch is called as part of an async Redux thunk, we need to
          // wait here before confirming that fetch was called or not called.
          await wait(1);
          const fetchCalls = global.fetch.getCalls();
          // make sure we are not fetching appeals data
          expect(
            fetchCalls.some(call => {
              return call.args[0].includes('v0/appeals');
            }),
          ).to.be.false;
          // make sure we are not fetching claims data
          expect(
            fetchCalls.some(call => {
              return call.args[0].includes('v0/evss_claims_async');
            }),
          ).to.be.false;
        });
        it('should not render anything at all', () => {
          expect(view.queryByRole('progressbar', { label: /loading/i })).to.not
            .exist;
          expect(view.queryByRole('heading', { name: /^claims & appeals$/i }))
            .to.not.exist;
        });
      },
    );
    context(
      'when user has the `appeals-status` service but lacks the `evss-claims` service',
      () => {
        beforeEach(() => {
          mockFetch();
          initialState = {
            user: {
              profile: {
                services: ['appeals-status'],
              },
            },
          };
          view = renderInReduxProvider(<ClaimsAndAppeals />, {
            initialState,
            reducers,
          });
        });
        afterEach(() => {
          resetFetch();
        });
        it('should attempt to get appeals data', async () => {
          // Because fetch is called as part of an async Redux thunk, we need to
          // wait here before confirming that fetch was called or not called.
          await wait(1);
          const fetchCalls = global.fetch.getCalls();
          // make sure we are fetching appeals data
          expect(
            fetchCalls.some(call => {
              return call.args[0].includes('v0/appeals');
            }),
          ).to.be.true;
        });
        it('should not attempt to get claims data', async () => {
          // Because fetch is called as part of an async Redux thunk, we need to
          // wait here before confirming that fetch was called or not called.
          await wait(1);
          const fetchCalls = global.fetch.getCalls();
          // make sure we are not fetching claims data
          expect(
            fetchCalls.some(call => {
              return call.args[0].includes('v0/evss_claims_async');
            }),
          ).to.be.false;
        });
        it('should render a loading spinner but no section headline while loading data', () => {
          expect(view.queryByRole('progressbar', { label: /loading/i })).to
            .exist;
          expect(view.queryByRole('heading', { name: /^claims & appeals$/i }))
            .to.not.exist;
        });
      },
    );
    context(
      'when user has the `evss-claims` service but lacks the `appeals-status` service',
      () => {
        beforeEach(() => {
          mockFetch();
          initialState = {
            user: {
              profile: {
                services: ['evss-claims'],
              },
            },
          };
          view = renderInReduxProvider(<ClaimsAndAppeals />, {
            initialState,
            reducers,
          });
        });
        afterEach(() => {
          resetFetch();
        });
        it('should not attempt to get appeals data', async () => {
          // Because fetch is called as part of an async Redux thunk, we need to
          // wait here before confirming that fetch was called or not called.
          await wait(1);
          const fetchCalls = global.fetch.getCalls();
          // make sure we are not fetching appeals data
          expect(
            fetchCalls.some(call => {
              return call.args[0].includes('v0/appeals');
            }),
          ).to.be.false;
        });
        it('should attempt to get claims data', async () => {
          // Because fetch is called as part of an async Redux thunk, we need to
          // wait here before confirming that fetch was called or not called.
          await wait(1);
          const fetchCalls = global.fetch.getCalls();
          // make sure we are fetching claims data
          expect(
            fetchCalls.some(call => {
              return call.args[0].includes('v0/evss_claims_async');
            }),
          ).to.be.true;
        });
        it('should render a loading spinner but no section headline while loading data', () => {
          expect(view.queryByRole('progressbar', { label: /loading/i })).to
            .exist;
          expect(view.queryByRole('heading', { name: /^claims & appeals$/i }))
            .to.not.exist;
        });
      },
    );
    context(
      'when user has both the `evss-claims` and `appeals-status` services',
      () => {
        beforeEach(() => {
          mockFetch();
          initialState = {
            user: {
              profile: {
                services: ['evss-claims', 'appeals-status'],
              },
            },
          };
          view = renderInReduxProvider(<ClaimsAndAppeals />, {
            initialState,
            reducers,
          });
        });
        afterEach(() => {
          resetFetch();
        });
        it('should attempt to get appeals and claims data', async () => {
          // Because fetch is called as part of an async Redux thunk, we need to
          // wait here before confirming that fetch was called or not called.
          await wait(1);
          const fetchCalls = global.fetch.getCalls();
          expect(
            fetchCalls.some(call => {
              return call.args[0].includes('v0/appeals');
            }),
          ).to.be.true;
          expect(
            fetchCalls.some(call => {
              return call.args[0].includes('v0/evss_claims_async');
            }),
          ).to.be.true;
        });
        it('should render a loading spinner but no section headline while loading data', () => {
          expect(view.queryByRole('progressbar', { label: /loading/i })).to
            .exist;
          expect(view.queryByRole('heading', { name: /^claims & appeals$/i }))
            .to.not.exist;
        });
      },
    );
  });

  describe('render logic', () => {
    context('when the user has no claims or appeals on file', () => {
      beforeEach(() => {
        initialState = {
          user: claimsAppealsUser(),
          disability: {
            status: {
              claimsV2: {
                appealsLoading: false,
                claimsLoading: false,
                appeals: [],
                claims: [],
              },
            },
          },
        };
        view = renderInReduxProvider(<ClaimsAndAppeals dataLoadingDisabled />, {
          initialState,
          reducers,
        });
      });
      it('does not render anything, even a headline', () => {
        expect(view.queryByRole('progressbar')).to.not.exist;
        expect(view.queryByRole('heading', { name: /^claims & appeals$/i })).to
          .not.exist;
      });
    });
    context(
      'when the user has 3 claims that were all updated in the past 30 days',
      () => {
        beforeEach(() => {
          initialState = {
            user: claimsAppealsUser(),
            disability: {
              status: {
                claimsV2: {
                  appealsLoading: false,
                  claimsLoading: false,
                  appeals: [],
                  claims: [
                    // claim with recent activity
                    {
                      id: '600214206',
                      type: 'evss_claims',
                      attributes: {
                        evssId: 600214206,
                        dateFiled: '2021-01-21',
                        minEstDate: null,
                        maxEstDate: null,
                        phaseChangeDate: daysAgo(7),
                        open: true,
                        waiverSubmitted: false,
                        documentsNeeded: false,
                        developmentLetterSent: false,
                        decisionLetterSent: false,
                        phase: 3,
                        everPhaseBack: false,
                        currentPhaseBack: false,
                        requestedDecision: false,
                        claimType: 'Compensation',
                        updatedAt: '2021-01-07T20:47:32.248Z',
                      },
                    },
                    // claim with most recent activity
                    {
                      id: '600214718',
                      type: 'evss_claims',
                      attributes: {
                        evssId: 600214718,
                        dateFiled: '2020-12-17',
                        minEstDate: '2021-03-02',
                        maxEstDate: '2021-03-09',
                        phaseChangeDate: daysAgo(1),
                        open: true,
                        waiverSubmitted: false,
                        documentsNeeded: false,
                        developmentLetterSent: true,
                        decisionLetterSent: false,
                        phase: 7,
                        everPhaseBack: false,
                        currentPhaseBack: false,
                        requestedDecision: false,
                        claimType: 'Compensation',
                        updatedAt: '2021-01-07T20:47:32.248Z',
                      },
                    },
                    // claim with recent activity
                    {
                      id: '600222604',
                      type: 'evss_claims',
                      attributes: {
                        evssId: 600222604,
                        dateFiled: daysAgo(5),
                        minEstDate: '2021-03-21',
                        maxEstDate: '2021-04-12',
                        // when phaseChangeDate is not set, we fall back to
                        // using dateFiled
                        phaseChangeDate: null,
                        open: true,
                        waiverSubmitted: false,
                        documentsNeeded: false,
                        developmentLetterSent: false,
                        decisionLetterSent: false,
                        phase: 1,
                        everPhaseBack: false,
                        currentPhaseBack: false,
                        requestedDecision: false,
                        claimType: 'Compensation',
                        updatedAt: '2021-01-07T20:47:32.248Z',
                      },
                    },
                  ],
                },
              },
            },
          };
          view = renderInReduxProvider(
            <ClaimsAndAppeals dataLoadingDisabled />,
            {
              initialState,
              reducers,
            },
          );
        });
        it('shows the correct number of open claims on the CTA', () => {
          expect(view.queryByRole('progressbar')).to.not.exist;
          expect(view.getByRole('heading', { name: /^claims & appeals$/i })).to
            .exist;
          expect(
            view.getByRole('link', {
              name: /3 claims or appeals in progress/i,
            }),
          ).to.exist;
        });
        it('shows details about the most recently updated claim or appeal', () => {
          expect(view.getByRole('link', { name: /^view details$/i })).to.exist;
          // TODO: uncomment when the component is updated
          // expect(view.getByText(/received.*dec.*17, 2020/i)).to.exist;
        });
      },
    );
    context(
      'when the user has 2 claims (1 closed) and 2 appeals (1 closed) that were all updated in the past 30 days',
      () => {
        beforeEach(() => {
          initialState = {
            user: claimsAppealsUser(),
            disability: {
              status: {
                claimsV2: {
                  appealsLoading: false,
                  claimsLoading: false,
                  appeals: [
                    // closed appeal updated 5 days ago
                    {
                      id: '2765759',
                      type: 'legacyAppeal',
                      attributes: {
                        appealIds: ['2765759'],
                        updated: '2021-03-04T19:55:21-05:00',
                        incompleteHistory: false,
                        type: 'original',
                        active: false,
                        description:
                          'Benefits as a result of VA error (Section 1151)',
                        aod: false,
                        location: 'bva',
                        aoj: 'vba',
                        programArea: 'compensation',
                        status: { type: 'on_docket', details: {} },
                        alerts: [],
                        docket: {
                          front: false,
                          total: 140135,
                          ahead: 101381,
                          ready: 16432,
                          month: '2012-04-01',
                          docketMonth: '2011-01-01',
                          eta: null,
                        },
                        issues: [
                          {
                            description:
                              'Benefits as a result of VA error (Section 1151)',
                            diagnosticCode: null,
                            active: true,
                            lastAction: null,
                            date: null,
                          },
                        ],
                        events: [
                          { type: 'nod', date: '2012-02-02' },
                          { type: 'soc', date: '2012-03-03' },
                          { type: 'form9', date: '2012-04-04' },
                          { type: 'hearing_held', date: daysAgo(5) },
                        ],
                        evidence: [],
                      },
                    },
                    // appeal updated one day ago
                    {
                      id: '2765759',
                      type: 'legacyAppeal',
                      attributes: {
                        appealIds: ['2765759'],
                        updated: '2021-03-04T19:55:21-05:00',
                        incompleteHistory: false,
                        type: 'original',
                        active: true,
                        description:
                          'Benefits as a result of VA error (Section 1151)',
                        aod: false,
                        location: 'bva',
                        aoj: 'vba',
                        programArea: 'compensation',
                        status: { type: 'on_docket', details: {} },
                        alerts: [],
                        docket: {
                          front: false,
                          total: 140135,
                          ahead: 101381,
                          ready: 16432,
                          month: '2012-04-01',
                          docketMonth: '2011-01-01',
                          eta: null,
                        },
                        issues: [
                          {
                            description:
                              'Benefits as a result of VA error (Section 1151)',
                            diagnosticCode: null,
                            active: true,
                            lastAction: null,
                            date: null,
                          },
                        ],
                        events: [
                          { type: 'nod', date: '2012-02-02' },
                          { type: 'soc', date: '2012-03-03' },
                          { type: 'form9', date: '2012-04-04' },
                          { type: 'hearing_held', date: daysAgo(1) },
                        ],
                        evidence: [],
                      },
                    },
                  ],
                  claims: [
                    // closed claim updated 5 days ago
                    {
                      id: '600214206',
                      type: 'evss_claims',
                      attributes: {
                        evssId: 600214206,
                        dateFiled: '2021-01-21',
                        minEstDate: null,
                        maxEstDate: null,
                        phaseChangeDate: daysAgo(5),
                        open: false,
                        waiverSubmitted: false,
                        documentsNeeded: false,
                        developmentLetterSent: false,
                        decisionLetterSent: false,
                        phase: 8,
                        everPhaseBack: false,
                        currentPhaseBack: false,
                        requestedDecision: false,
                        claimType: 'Compensation',
                        updatedAt: '2021-01-07T20:47:32.248Z',
                      },
                    },
                    // open claim updated 10 days ago
                    {
                      id: '600214718',
                      type: 'evss_claims',
                      attributes: {
                        evssId: 600214718,
                        dateFiled: '2020-12-17',
                        minEstDate: '2021-03-02',
                        maxEstDate: '2021-03-09',
                        phaseChangeDate: daysAgo(10),
                        open: true,
                        waiverSubmitted: false,
                        documentsNeeded: false,
                        developmentLetterSent: true,
                        decisionLetterSent: false,
                        phase: 7,
                        everPhaseBack: false,
                        currentPhaseBack: false,
                        requestedDecision: false,
                        claimType: 'Compensation',
                        updatedAt: '2021-01-07T20:47:32.248Z',
                      },
                    },
                  ],
                },
              },
            },
          };
          view = renderInReduxProvider(
            <ClaimsAndAppeals dataLoadingDisabled />,
            {
              initialState,
              reducers,
            },
          );
        });
        it('shows the correct number of open claims and appeals on the CTA', () => {
          expect(view.queryByRole('progressbar')).to.not.exist;
          expect(view.getByRole('heading', { name: /^claims & appeals$/i })).to
            .exist;
          expect(
            view.getByRole('link', {
              name: /2 claims or appeals in progress/i,
            }),
          ).to.exist;
        });
        it('shows details about the most recently updated claim or appeal', () => {
          expect(view.getByRole('link', { name: /^view details$/i })).to.exist;
          // TODO: uncomment when the component is updated to render claim details
          // expect(view.getByText(/received.*dec.*17, 2020/i)).to.exist;
        });
      },
    );
    context(
      'when user has two open claims (one recently updated), one open appeal, and one closed claim',
      () => {
        beforeEach(() => {
          initialState = {
            user: claimsAppealsUser(),
            disability: {
              status: {
                claimsV2: {
                  appealsLoading: false,
                  claimsLoading: false,
                  appeals: [
                    // open appeal that changed 31 days ago
                    {
                      id: '2765759',
                      type: 'legacyAppeal',
                      attributes: {
                        appealIds: ['2765759'],
                        updated: '2021-03-04T19:55:21-05:00',
                        incompleteHistory: false,
                        type: 'original',
                        active: true,
                        description:
                          'Benefits as a result of VA error (Section 1151)',
                        aod: false,
                        location: 'bva',
                        aoj: 'vba',
                        programArea: 'compensation',
                        status: { type: 'on_docket', details: {} },
                        alerts: [],
                        docket: {
                          front: false,
                          total: 140135,
                          ahead: 101381,
                          ready: 16432,
                          month: '2012-04-01',
                          docketMonth: '2011-01-01',
                          eta: null,
                        },
                        issues: [
                          {
                            description:
                              'Benefits as a result of VA error (Section 1151)',
                            diagnosticCode: null,
                            active: true,
                            lastAction: null,
                            date: null,
                          },
                        ],
                        events: [
                          { type: 'nod', date: '2012-02-02' },
                          { type: 'soc', date: '2012-03-03' },
                          { type: 'form9', date: '2012-04-04' },
                          { type: 'hearing_held', date: daysAgo(31) },
                        ],
                        evidence: [],
                      },
                    },
                  ],
                  claims: [
                    // open claim updated 29 days ago
                    {
                      id: '600214206',
                      type: 'evss_claims',
                      attributes: {
                        evssId: 600214206,
                        dateFiled: '2021-01-21',
                        minEstDate: null,
                        maxEstDate: null,
                        phaseChangeDate: daysAgo(29),
                        open: true,
                        waiverSubmitted: false,
                        documentsNeeded: false,
                        developmentLetterSent: false,
                        decisionLetterSent: false,
                        phase: 7,
                        everPhaseBack: false,
                        currentPhaseBack: false,
                        requestedDecision: false,
                        claimType: 'Compensation',
                        updatedAt: '2021-01-07T20:47:32.248Z',
                      },
                    },
                    // closed claim without recent activity
                    {
                      id: '600214718',
                      type: 'evss_claims',
                      attributes: {
                        evssId: 600214718,
                        dateFiled: '2020-12-17',
                        minEstDate: '2021-03-02',
                        maxEstDate: '2021-03-09',
                        phaseChangeDate: daysAgo(31),
                        open: false,
                        waiverSubmitted: false,
                        documentsNeeded: false,
                        developmentLetterSent: true,
                        decisionLetterSent: false,
                        phase: 8,
                        everPhaseBack: false,
                        currentPhaseBack: false,
                        requestedDecision: false,
                        claimType: 'Compensation',
                        updatedAt: '2021-01-07T20:47:32.248Z',
                      },
                    },
                    // open claim without recent activity
                    {
                      id: '600222604',
                      type: 'evss_claims',
                      attributes: {
                        evssId: 600222604,
                        dateFiled: daysAgo(100),
                        minEstDate: '2021-03-21',
                        maxEstDate: '2021-04-12',
                        // when phaseChangeDate is not set, we fall back to
                        // using dateFiled
                        phaseChangeDate: null,
                        open: true,
                        waiverSubmitted: false,
                        documentsNeeded: false,
                        developmentLetterSent: false,
                        decisionLetterSent: false,
                        phase: 1,
                        everPhaseBack: false,
                        currentPhaseBack: false,
                        requestedDecision: false,
                        claimType: 'Compensation',
                        updatedAt: '2021-01-07T20:47:32.248Z',
                      },
                    },
                  ],
                },
              },
            },
          };
          view = renderInReduxProvider(
            <ClaimsAndAppeals dataLoadingDisabled />,
            {
              initialState,
              reducers,
            },
          );
        });
        it('shows the correct number of open claims on the CTA', () => {
          expect(view.queryByRole('progressbar')).to.not.exist;
          expect(view.getByRole('heading', { name: /^claims & appeals$/i })).to
            .exist;
          expect(
            view.getByRole('link', {
              name: /3 claims or appeals in progress/i,
            }),
          ).to.exist;
        });
        it('shows details for the most recently updated claim', () => {
          expect(view.getByRole('link', { name: /^view details$/i })).to.exist;
          // TODO: determine what text to show for a recently closed claims
          // expect(view.getByText('')).to.exist;
        });
      },
    );
    context(
      'when the user has no open claims or appeals, but does have one that closed within the past thirty days',
      () => {
        beforeEach(() => {
          initialState = {
            user: claimsAppealsUser(),
            disability: {
              status: {
                claimsV2: {
                  appealsLoading: false,
                  claimsLoading: false,
                  appeals: [
                    // closed appeal that was closed 10 days ago
                    {
                      id: '2765759',
                      type: 'legacyAppeal',
                      attributes: {
                        appealIds: ['2765759'],
                        updated: '2021-03-04T19:55:21-05:00',
                        incompleteHistory: false,
                        type: 'original',
                        // this determines if the appeal is open or closed
                        active: false,
                        description:
                          'Benefits as a result of VA error (Section 1151)',
                        aod: false,
                        location: 'bva',
                        aoj: 'vba',
                        programArea: 'compensation',
                        status: { type: 'on_docket', details: {} },
                        alerts: [],
                        docket: {
                          front: false,
                          total: 140135,
                          ahead: 101381,
                          ready: 16432,
                          month: '2012-04-01',
                          docketMonth: '2011-01-01',
                          eta: null,
                        },
                        issues: [
                          {
                            description:
                              'Benefits as a result of VA error (Section 1151)',
                            diagnosticCode: null,
                            active: true,
                            lastAction: null,
                            date: null,
                          },
                        ],
                        events: [
                          { type: 'nod', date: '2012-02-02' },
                          { type: 'hearing_held', date: daysAgo(10) },
                        ],
                        evidence: [],
                      },
                    },
                  ],
                  claims: [
                    // closed claim with no recent activity
                    {
                      id: '600214206',
                      type: 'evss_claims',
                      attributes: {
                        evssId: 600214206,
                        dateFiled: '2021-01-21',
                        minEstDate: null,
                        maxEstDate: null,
                        phaseChangeDate: daysAgo(3000),
                        open: false,
                        waiverSubmitted: false,
                        documentsNeeded: false,
                        developmentLetterSent: false,
                        decisionLetterSent: false,
                        phase: 8,
                        everPhaseBack: false,
                        currentPhaseBack: false,
                        requestedDecision: false,
                        claimType: 'Compensation',
                        updatedAt: '2021-01-07T20:47:32.248Z',
                      },
                    },
                    // closed claim without recent activity
                    {
                      id: '600214718',
                      type: 'evss_claims',
                      attributes: {
                        evssId: 600214718,
                        dateFiled: '2020-12-17',
                        minEstDate: '2021-03-02',
                        maxEstDate: '2021-03-09',
                        phaseChangeDate: daysAgo(31),
                        open: false,
                        waiverSubmitted: false,
                        documentsNeeded: false,
                        developmentLetterSent: true,
                        decisionLetterSent: false,
                        phase: 8,
                        everPhaseBack: false,
                        currentPhaseBack: false,
                        requestedDecision: false,
                        claimType: 'Compensation',
                        updatedAt: '2021-01-07T20:47:32.248Z',
                      },
                    },
                  ],
                },
              },
            },
          };
          view = renderInReduxProvider(
            <ClaimsAndAppeals dataLoadingDisabled />,
            {
              initialState,
              reducers,
            },
          );
        });
        it('shows the correct text on the CTA', () => {
          expect(
            view.getByRole('link', {
              name: /go to all claims or appeals/i,
            }),
          ).to.exist;
        });
        it('shows details about the recently closed claim', () => {
          // TODO: add a test to make sure the recently closed claim details are shown
          expect(view.getByRole('link', { name: /^view details$/i })).to.exist;
        });
      },
    );
    context(
      'the user has one open appeal that was updated over thirty days ago',
      () => {
        beforeEach(() => {
          initialState = {
            user: claimsAppealsUser(),
            disability: {
              status: {
                claimsV2: {
                  appealsLoading: false,
                  claimsLoading: false,
                  appeals: [
                    {
                      id: '2765759',
                      type: 'legacyAppeal',
                      attributes: {
                        appealIds: ['2765759'],
                        updated: '2021-03-04T19:55:21-05:00',
                        incompleteHistory: false,
                        type: 'original',
                        // this determines if the appeal is open or closed
                        active: true,
                        description:
                          'Benefits as a result of VA error (Section 1151)',
                        aod: false,
                        location: 'bva',
                        aoj: 'vba',
                        programArea: 'compensation',
                        status: { type: 'on_docket', details: {} },
                        alerts: [],
                        docket: {
                          front: false,
                          total: 140135,
                          ahead: 101381,
                          ready: 16432,
                          month: '2012-04-01',
                          docketMonth: '2011-01-01',
                          eta: null,
                        },
                        issues: [
                          {
                            description:
                              'Benefits as a result of VA error (Section 1151)',
                            diagnosticCode: null,
                            active: true,
                            lastAction: null,
                            date: null,
                          },
                        ],
                        events: [
                          { type: 'nod', date: '2012-02-02' },
                          { type: 'soc', date: '2012-03-03' },
                          { type: 'form9', date: '2012-04-04' },
                          { type: 'hearing_held', date: daysAgo(31) },
                        ],
                        evidence: [],
                      },
                    },
                  ],
                  claims: [],
                },
              },
            },
          };
          view = renderInReduxProvider(
            <ClaimsAndAppeals dataLoadingDisabled />,
            {
              initialState,
              reducers,
            },
          );
        });
        it('shows the correct number of open claims on the CTA', () => {
          expect(view.getByRole('heading', { name: /^claims & appeals$/i })).to
            .exist;
          expect(
            view.getByRole('link', {
              name: /1 claim or appeal in progress/i,
            }),
          ).to.exist;
        });
        it('does not show details about the open claim', () => {
          expect(view.queryByRole('link', { name: /^view details$/i })).to.not
            .exist;
        });
        it('displays text about no recent activity', () => {
          expect(
            view.getByText(
              /You have no claims or appeals updates in the last 30 days/i,
            ),
          ).to.exist;
        });
      },
    );
    context(
      'the user only has claims and appeals that closed over thirty days ago',
      () => {
        beforeEach(() => {
          initialState = {
            user: claimsAppealsUser(),
            disability: {
              status: {
                claimsV2: {
                  appealsLoading: false,
                  claimsLoading: false,
                  appeals: [
                    {
                      id: '2765759',
                      type: 'legacyAppeal',
                      attributes: {
                        appealIds: ['2765759'],
                        updated: '2021-03-04T19:55:21-05:00',
                        incompleteHistory: false,
                        type: 'original',
                        // this determines if the appeal is open or closed
                        active: false,
                        description:
                          'Benefits as a result of VA error (Section 1151)',
                        aod: false,
                        location: 'bva',
                        aoj: 'vba',
                        programArea: 'compensation',
                        status: { type: 'on_docket', details: {} },
                        alerts: [],
                        docket: {
                          front: false,
                          total: 140135,
                          ahead: 101381,
                          ready: 16432,
                          month: '2012-04-01',
                          docketMonth: '2011-01-01',
                          eta: null,
                        },
                        issues: [
                          {
                            description:
                              'Benefits as a result of VA error (Section 1151)',
                            diagnosticCode: null,
                            active: true,
                            lastAction: null,
                            date: null,
                          },
                        ],
                        events: [
                          { type: 'nod', date: '2012-02-02' },
                          { type: 'soc', date: '2012-03-03' },
                          { type: 'form9', date: '2012-04-04' },
                          { type: 'hearing_held', date: daysAgo(1000) },
                        ],
                        evidence: [],
                      },
                    },
                  ],
                  claims: [
                    {
                      id: '600214206',
                      type: 'evss_claims',
                      attributes: {
                        evssId: 600214206,
                        dateFiled: '2021-01-21',
                        minEstDate: null,
                        maxEstDate: null,
                        phaseChangeDate: daysAgo(100),
                        open: false,
                        waiverSubmitted: false,
                        documentsNeeded: false,
                        developmentLetterSent: false,
                        decisionLetterSent: false,
                        phase: 8,
                        everPhaseBack: false,
                        currentPhaseBack: false,
                        requestedDecision: false,
                        claimType: 'Compensation',
                        updatedAt: '2021-01-07T20:47:32.248Z',
                      },
                    },
                    {
                      id: '600214718',
                      type: 'evss_claims',
                      attributes: {
                        evssId: 600214718,
                        dateFiled: '2020-12-17',
                        minEstDate: '2021-03-02',
                        maxEstDate: '2021-03-09',
                        phaseChangeDate: daysAgo(35),
                        open: false,
                        waiverSubmitted: false,
                        documentsNeeded: false,
                        developmentLetterSent: true,
                        decisionLetterSent: false,
                        phase: 8,
                        everPhaseBack: false,
                        currentPhaseBack: false,
                        requestedDecision: false,
                        claimType: 'Compensation',
                        updatedAt: '2021-01-07T20:47:32.248Z',
                      },
                    },
                    {
                      id: '600222604',
                      type: 'evss_claims',
                      attributes: {
                        evssId: 600222604,
                        dateFiled: '2021-02-01',
                        minEstDate: '2021-03-21',
                        maxEstDate: '2021-04-12',
                        phaseChangeDate: daysAgo(60),
                        open: false,
                        waiverSubmitted: false,
                        documentsNeeded: false,
                        developmentLetterSent: false,
                        decisionLetterSent: false,
                        phase: 8,
                        everPhaseBack: false,
                        currentPhaseBack: false,
                        requestedDecision: false,
                        claimType: 'Compensation',
                        updatedAt: '2021-01-07T20:47:32.248Z',
                      },
                    },
                  ],
                },
              },
            },
          };
          view = renderInReduxProvider(
            <ClaimsAndAppeals dataLoadingDisabled />,
            {
              initialState,
              reducers,
            },
          );
        });
        it('does not render anything, even a headline', () => {
          expect(view.queryByRole('progressbar')).to.not.exist;
          expect(view.queryByRole('heading', { name: /^claims & appeals$/i }))
            .to.not.exist;
        });
      },
    );
  });
});
