import React, { useEffect } from 'react';
import { Element } from 'react-scroll';
import moment from 'moment';
import classnames from 'classnames';
import { scrollerTo } from '../lib';

const Incomplete = () => <div>Please answer all the questions above.</div>;

function Complete({ children }) {
  return (
    <div>
      {children}
      <div className="covid-screener-date vads-u-font-weight--bold">
        <div className="vads-u-font-size--xl">Valid for</div>
        <div className="covid-screener-400">{moment().format('dddd')}</div>
        <div className="covid-screener-500">{moment().format('MMM D')}</div>
        <div className="vads-u-font-size--xl">{moment().format('h:mm a')}</div>
      </div>
      <div className="vads-u-font-size--lg">
        <p>
          Please show this screen to the staff member at the facility entrance.
        </p>
        <p>Thank you for helping us protect you and others during this time.</p>
      </div>
    </div>
  );
}

const Pass = () => (
  <Complete>
    <i aria-hidden="true" role="presentation" className="fas fa-check" />
    <h2 className="vads-u-font-size--2xl">OK to proceed</h2>
  </Complete>
);

const MoreScreening = () => (
  <Complete>
    <h2 className="vads-u-font-size--2xl">More screening needed</h2>
  </Complete>
);

export default function FormResult({ formState }) {
  const scrollElementName = 'multi-question-form-result-scroll-element';

  useEffect(() => {
    // only scroll when form is complete
    if (formState.status !== 'incomplete') {
      scrollerTo(scrollElementName);
    }
  });

  const resultList = {
    pass: {
      content: <Pass />,
      class: 'pass',
    },
    'more-screening': {
      content: <MoreScreening />,
      class: 'more-screening',
    },
    incomplete: {
      content: <Incomplete />,
      class: 'incomplete',
    },
  };

  const resultContent = resultList[formState.status].content;

  return (
    <div
      className={classnames(
        'feature',
        'covid-screener-results',
        `covid-screener-results-${resultList[formState.status].class}`,
      )}
    >
      <Element name={scrollElementName} />
      <div>{resultContent}</div>
    </div>
  );
}
