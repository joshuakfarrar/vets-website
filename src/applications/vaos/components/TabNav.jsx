import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { focusElement } from 'platform/utilities/ui';

import TabItem from './TabItem';

export default function TabNav({ hasExpressCareRequests }) {
  const history = useHistory();
  const location = useLocation();

  const isExpressCareTab = location.pathname === '/express-care';
  return (
    <ul className="va-tabs vaos-appts__tabs" role="tablist">
      <TabItem
        id="upcoming"
        tabpath="/"
        isActive={location.pathname.endsWith('appointments/')}
        firstTab
        onNextTab={() => {
          history.push('/past');
          focusElement('#tabpast');
        }}
        title={hasExpressCareRequests ? 'Upcoming' : 'Upcoming appointments'}
      />
      <TabItem
        id="past"
        tabpath="/past"
        isActive={location.pathname.endsWith('past/')}
        onPreviousTab={() => {
          history.push('/');
          focusElement('#tabupcoming');
        }}
        onNextTab={() => {
          if (hasExpressCareRequests || isExpressCareTab) {
            history.push('/express-care');
            focusElement('#tabexpress-care');
          }
        }}
        title={hasExpressCareRequests ? 'Past' : 'Past appointments'}
      />
      {(hasExpressCareRequests || isExpressCareTab) && (
        <TabItem
          id="express-care"
          tabpath="/express-care"
          isActive={isExpressCareTab}
          onPreviousTab={() => {
            history.push('/past');
            focusElement('#tabpast');
          }}
          title="Express Care"
        />
      )}
    </ul>
  );
}
