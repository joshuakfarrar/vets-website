import React from 'react';
import { connect } from 'react-redux';
import {
  openReasonForAppointment,
  updateReasonForAppointmentData,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
} from '../actions/newAppointment.js';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import FormButtons from '../components/FormButtons';
import { getFormPageInfo } from '../utils/selectors';
import { PURPOSE_TEXT } from '../utils/constants';
import TextareaWidget from '../components/TextareaWidget';

const initialSchema = {
  type: 'object',
  required: ['reasonForAppointment', 'reasonAdditionalInfo'],
  properties: {
    reasonForAppointment: {
      type: 'string',
      enum: PURPOSE_TEXT.map(purpose => purpose.id),
      enumNames: PURPOSE_TEXT.map(purpose => purpose.label),
    },
    reasonAdditionalInfo: {
      type: 'string',
    },
  },
};

const uiSchema = {
  reasonForAppointment: {
    'ui:widget': 'radio',
    'ui:title': 'Why are you making this appointment?',
  },
  reasonAdditionalInfo: {
    'ui:widget': TextareaWidget,
    'ui:options': {
      rows: 5,
      expandUnder: 'reasonForAppointment',
      expandUnderCondition: reasonForAppointment => !!reasonForAppointment,
    },
  },
};

const pageKey = 'reasonForAppointment';

export class ReasonForAppointmentPage extends React.Component {
  componentDidMount() {
    this.props.openReasonForAppointment(pageKey, uiSchema, initialSchema);
  }

  goBack = () => {
    this.props.routeToPreviousAppointmentPage(this.props.router, pageKey);
  };

  goForward = () => {
    this.props.routeToNextAppointmentPage(this.props.router, pageKey);
  };

  render() {
    const { schema, data, pageChangeInProgress } = this.props;

    return (
      <div>
        <h1 className="vads-u-font-size--h2">Reason for appointment</h1>
        <SchemaForm
          name="Reason for appointment"
          title="Reason for appointment"
          schema={schema || initialSchema}
          uiSchema={uiSchema}
          onSubmit={this.goForward}
          onChange={newData =>
            this.props.updateReasonForAppointmentData(
              pageKey,
              uiSchema,
              newData,
            )
          }
          data={data}
        >
          <FormButtons
            onBack={this.goBack}
            pageChangeInProgress={pageChangeInProgress}
          />
          <div aria-atomic="true" aria-live="assertive">
            <AlertBox
              status="warning"
              headline="If you have an urgent medical need, please:"
              className="vads-u-margin-y--3"
              content={
                <ul>
                  <li>
                    Call <a href="tel:911">911</a>,{' '}
                    <span className="vads-u-font-weight--bold">or</span>
                  </li>
                  <li>
                    Call the Veterans Crisis hotline at{' '}
                    <a href="tel:8002738255">800-273-8255</a> and press 1,{' '}
                    <span className="vads-u-font-weight--bold">or</span>
                  </li>
                  <li>
                    Go to your nearest emergency room or VA medical center.{' '}
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href="/find-locations"
                    >
                      Find your nearest VA medical center
                    </a>
                  </li>
                </ul>
              }
            />
          </div>
        </SchemaForm>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return getFormPageInfo(state, pageKey);
}

const mapDispatchToProps = {
  openReasonForAppointment,
  updateReasonForAppointmentData,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReasonForAppointmentPage);
