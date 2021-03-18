// libs
import React from 'react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import sinon from 'sinon';

import createCommonStore from 'platform/startup/store';
import createSchemaFormReducer from 'platform/forms-system/src/js/state';
import reducers from 'platform/forms-system/src/js/state/reducers';

import ValidationError from '../../../../src/js/review/submit-states/ValidationError';

const createForm = options => ({
  submission: {
    hasAttemptedSubmit: false,
    status: false,
  },
  pages: {
    page1: {
      schema: {},
    },
    page2: {
      schema: {},
    },
    page3: {
      schema: {},
    },
  },
  data: {},
  ...options,
});

const createStore = (options = {}) => {
  return createCommonStore({
    form: createForm(options?.form || {}),
    router: options?.router || {},
  });
};

const createformReducer = (options = {}) =>
  createSchemaFormReducer(
    options?.formConfig || {},
    options?.formConfig || {},
    reducers,
  );

const getFormConfig = (options = {}) => ({
  preSubmitInfo: {
    required: true,
    field: 'privacyAgreementAccepted',
    notice: '<div>Notice</div>',
    label: 'I accept the privacy agreement',
    error: 'You must accept the privacy agreement',
  },
  chapters: {
    chapter1: {
      pages: {
        page1: {
          schema: {},
        },
        page2: {
          schema: {},
        },
      },
    },
    chapter2: {
      pages: {
        page3: {
          schema: {},
        },
      },
    },
  },
  ...options,
});

describe('Schemaform review: <ValidationError />', () => {
  it('has a back button', () => {
    const onBack = sinon.spy();
    const onSubmit = sinon.spy();

    const form = createForm();
    const formConfig = getFormConfig();

    const formReducer = createformReducer({
      formConfig: form,
    });

    const store = createStore();
    store.injectReducer('form', formReducer);

    const tree = render(
      <Provider store={store}>
        <ValidationError
          appType="test"
          buttonText="test"
          formConfig={formConfig}
          onBack={onBack}
          onSubmit={onSubmit}
        />
      </Provider>,
    );

    const backButton = tree.getByText('Back');
    expect(backButton).to.not.be.null;
    fireEvent.click(backButton);
    expect(onBack.called).to.be.true;

    tree.unmount();
  });

  it('has a pre-submit section', () => {
    const onBack = sinon.spy();
    const onSubmit = sinon.spy();

    const form = createForm();
    const formConfig = getFormConfig();

    const formReducer = createformReducer({
      formConfig: form,
    });

    const store = createStore();
    store.injectReducer('form', formReducer);

    const tree = render(
      <Provider store={store}>
        <ValidationError
          appType="test"
          buttonText="test"
          formConfig={formConfig}
          onBack={onBack}
          onSubmit={onSubmit}
        />
      </Provider>,
    );

    expect(tree.getByText('I accept the privacy agreement')).to.not.be.null;

    tree.unmount();
  });

  it('has an enabled submit button', () => {
    const onBack = sinon.spy();
    const onSubmit = sinon.spy();

    const form = createForm();
    const formConfig = getFormConfig();

    const formReducer = createformReducer({
      formConfig: form,
    });

    const store = createStore();
    store.injectReducer('form', formReducer);

    const tree = render(
      <Provider store={store}>
        <ValidationError
          appType="test"
          buttonText="custom text"
          formConfig={formConfig}
          onBack={onBack}
          onSubmit={onSubmit}
        />
      </Provider>,
    );

    const submitButton = tree.getByText('custom text');
    expect(submitButton).to.not.be.null;

    expect(submitButton).to.not.have.attribute('disabled');
    fireEvent.click(submitButton);
    expect(onBack.called).to.be.false;

    tree.unmount();
  });

  it('has the expected error message', () => {
    const onBack = sinon.spy();
    const onSubmit = sinon.spy();

    const form = createForm();
    const formConfig = getFormConfig();

    const formReducer = createformReducer({
      formConfig: form,
    });

    const store = createStore();
    store.injectReducer('form', formReducer);

    const tree = render(
      <Provider store={store}>
        <ValidationError
          appType="test"
          buttonText="test"
          formConfig={formConfig}
          onBack={onBack}
          onSubmit={onSubmit}
          testId={'12345'}
        />
      </Provider>,
    );

    expect(
      tree.getByText(
        'We’re sorry. Some information in your test is missing or not valid.',
      ),
    ).to.not.be.null;
    expect(tree.getByTestId('12345')).to.have.attribute('role', 'alert');

    tree.unmount();
  });

  it('has the expected list of errors', () => {
    const onBack = sinon.spy();
    const onSubmit = sinon.spy();

    const form = createForm();
    form.formErrors = {
      errors: [
        {
          name: 'test',
          message: 'Missing test',
          chapterKey: 'Test',
          index: 0,
        },
        { name: 'zip', message: 'Zip', chapterKey: 'Zip', pageKey: 'zip' },
        // No chapter = no link to open accordion
        { name: 'empty', message: 'Property not found', chapterKey: '' },
      ],
    };

    const formConfig = getFormConfig();
    formConfig.showReviewErrors = () => true;

    const formReducer = createformReducer({
      formConfig: form,
    });

    const store = createStore();
    store.injectReducer('form', formReducer);

    const tree = render(
      <Provider store={store}>
        <ValidationError
          appType="test"
          buttonText="test"
          formConfig={formConfig}
          onBack={onBack}
          onSubmit={onSubmit}
          testId={'12345'}
        />
      </Provider>,
    );
    expect(tree.getByText(/your test is missing or not valid/)).to.exist;
    expect(tree.getByText(/preventing submission/)).to.exist;
    expect(tree.getByText('Missing test')).to.exist;
    expect(tree.getByText('Zip')).to.exist;
    expect(tree.getByText('Property not found')).to.exist;
    tree.unmount();
  });
});
