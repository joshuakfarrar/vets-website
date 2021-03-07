import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';

import CancelAppointmentModal from '../cancel/CancelAppointmentModal';
import AddToCalendar from '../../../components/AddToCalendar';
import VAFacilityLocation from '../../../components/VAFacilityLocation';
import moment from '../../../lib/moment-tz';
import {
  getVAAppointmentLocationId,
  getVARFacilityId,
  getVideoAppointmentLocation,
  isAtlasLocation,
  isVAPhoneAppointment,
  isVideoAppointment,
  isVideoGFE,
  isVideoHome,
  isVideoVAFacility,
} from '../../../services/appointment';
import {
  APPOINTMENT_STATUS,
  FETCH_STATUS,
  PURPOSE_TEXT,
} from '../../../utils/constants';
import { scrollAndFocus } from '../../../utils/scrollAndFocus';
import * as actions from '../../redux/actions';
import AppointmentDateTime from './AppointmentDateTime';
import AppointmentInstructions from './AppointmentInstructions';
import {
  getCancelInfo,
  selectConfirmedAppointmentById,
} from '../../redux/selectors';
import { selectFeatureCancel } from '../../../redux/selectors';
import VideoVisitSection from './VideoVisitSection';
import { formatFacilityAddress } from 'applications/vaos/services/location';
import PageLayout from '../AppointmentsPage/PageLayout';
import ErrorMessage from '../../../components/ErrorMessage';
import FullWidthLayout from '../../../components/FullWidthLayout';

function formatAppointmentDate(date) {
  if (!date.isValid()) {
    return null;
  }

  return date.format('MMMM D, YYYY');
}

function formatHeader(appointment) {
  if (isVideoGFE(appointment)) {
    return 'VA Video Connect using VA device';
  } else if (isVideoVAFacility(appointment)) {
    return 'VA Video Connect at VA location';
  } else if (isAtlasLocation(appointment)) {
    return 'VA Video Connect at an ATLAS location';
  } else if (isVideoHome(appointment)) {
    return 'VA Video Connect at home';
  } else {
    return 'VA Appointment';
  }
}

function ConfirmedAppointmentDetailsPage({
  appointment,
  appointmentDetailsStatus,
  cancelAppointment,
  cancelInfo,
  closeCancelAppointment,
  confirmCancelAppointment,
  facilityData,
  fetchConfirmedAppointmentDetails,
  showCancelButton,
}) {
  const { id } = useParams();

  useEffect(() => {
    fetchConfirmedAppointmentDetails(id, 'va');

    scrollAndFocus();
  }, []);

  useEffect(
    () => {
      if (
        !cancelInfo.showCancelModal &&
        cancelInfo.cancelAppointmentStatus === FETCH_STATUS.succeeded
      ) {
        scrollAndFocus();
      }
    },
    [cancelInfo.showCancelModal, cancelInfo.cancelAppointmentStatus],
  );

  if (
    appointmentDetailsStatus === FETCH_STATUS.failed ||
    (appointmentDetailsStatus === FETCH_STATUS.succeeded && !appointment)
  ) {
    return (
      <FullWidthLayout>
        <ErrorMessage level={1} />
      </FullWidthLayout>
    );
  }

  if (!appointment || appointmentDetailsStatus === FETCH_STATUS.loading) {
    return (
      <FullWidthLayout>
        <LoadingIndicator message="Loading your appointment..." />
      </FullWidthLayout>
    );
  }

  const canceled = appointment.status === APPOINTMENT_STATUS.cancelled;
  const isVideo = isVideoAppointment(appointment);
  const isPhone = isVAPhoneAppointment(appointment);
  const facilityId = isVideo
    ? getVideoAppointmentLocation(appointment)
    : getVAAppointmentLocationId(appointment);
  const facility = facilityData?.[facilityId];
  const isInPersonVAAppointment = !isVideo;

  const header = formatHeader(appointment);

  const showInstructions =
    isInPersonVAAppointment &&
    PURPOSE_TEXT.some(purpose =>
      appointment?.comment?.startsWith(purpose.short),
    );

  return (
    <PageLayout>
      <div className="vads-u-display--block vads-u-padding-y--2p5 vaos-hide-for-print">
        ‹ <Link to="/">Manage appointments</Link>
      </div>

      <h1>
        <AppointmentDateTime
          appointmentDate={moment.parseZone(appointment.start)}
          facilityId={getVARFacilityId(appointment)}
        />
      </h1>

      {canceled && (
        <AlertBox
          status="error"
          className="vads-u-display--block vads-u-margin-bottom--2"
          backgroundOnly
        >
          This appointment has been canceled
        </AlertBox>
      )}

      {isVideo && (
        <>
          <h2 className="vads-u-font-size--base vads-u-font-family--sans vads-u-margin-bottom--0">
            {header}
          </h2>
          <VideoVisitSection
            header={header}
            facility={facility}
            appointment={appointment}
          />
        </>
      )}

      {!!facility &&
        !isVideo && (
          <>
            <h2 className="vads-u-font-size--base vads-u-font-family--sans vads-u-margin-bottom--0">
              {header}
            </h2>
            <VAFacilityLocation
              facility={facility}
              facilityName={facility?.name}
              facilityId={facilityId}
              isHomepageRefresh
              clinicFriendlyName={appointment.participant[0].actor.display}
            />

            {showInstructions &&
              isInPersonVAAppointment && (
                <div className="vads-u-margin-top--3 vaos-appts__block-label">
                  <AppointmentInstructions instructions={appointment.comment} />
                </div>
              )}
            {!canceled && (
              <>
                <div className="vads-u-margin-top--3 vaos-appts__block-label vaos-hide-for-print">
                  <i
                    aria-hidden="true"
                    className="far fa-calendar vads-u-margin-right--1"
                  />
                  <AddToCalendar
                    summary={`${header}`}
                    description={`instructionText`}
                    location={
                      isPhone ? 'Phone call' : formatFacilityAddress(facility)
                    }
                    duration={appointment.minutesDuration}
                    startDateTime={appointment.start}
                  />
                </div>

                <div className="vads-u-margin-top--2 vaos-appts__block-label vaos-hide-for-print">
                  <i
                    aria-hidden="true"
                    className="fas fa-print vads-u-margin-right--1"
                  />
                  <button
                    className="va-button-link"
                    onClick={() => window.print()}
                  >
                    Print
                  </button>
                </div>

                <div className="vads-u-margin-top--2 vaos-appts__block-label vaos-hide-for-print">
                  <i
                    aria-hidden="true"
                    className="fas fa-clock vads-u-margin-right--1"
                  />
                  <a href="#">Reschedule</a>
                </div>

                {showCancelButton && (
                  <div className="vads-u-margin-top--2 vaos-appts__block-label vaos-hide-for-print">
                    <i
                      aria-hidden="true"
                      className="fas fa-times vads-u-margin-right--1 vads-u-font-size--lg"
                    />
                    <button
                      onClick={() => cancelAppointment(appointment)}
                      aria-label={`Cancel appointment on ${formatAppointmentDate(
                        moment.parseZone(appointment.start),
                      )}`}
                      className="vaos-appts__cancel-btn va-button-link vads-u-margin--0 vads-u-flex--0"
                    >
                      Cancel appointment
                      <span className="sr-only">
                        {' '}
                        on{' '}
                        {formatAppointmentDate(
                          moment.parseZone(appointment.start),
                        )}
                      </span>
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}

      <div className="vads-u-margin-top--3 vaos-appts__block-label vaos-hide-for-print">
        <Link to="/" className="usa-button vads-u-margin-top--2" role="button">
          « Go back to appointments
        </Link>
      </div>
      <CancelAppointmentModal
        {...cancelInfo}
        onConfirm={confirmCancelAppointment}
        onClose={closeCancelAppointment}
      />
    </PageLayout>
  );
}

function mapStateToProps(state, ownProps) {
  const { appointmentDetailsStatus, facilityData } = state.appointments;

  return {
    appointment: selectConfirmedAppointmentById(
      state,
      ownProps.match.params.id,
    ),
    appointmentDetailsStatus,
    cancelInfo: getCancelInfo(state),
    facilityData,
    showCancelButton: selectFeatureCancel(state),
  };
}

const mapDispatchToProps = {
  cancelAppointment: actions.cancelAppointment,
  closeCancelAppointment: actions.closeCancelAppointment,
  confirmCancelAppointment: actions.confirmCancelAppointment,
  fetchConfirmedAppointmentDetails: actions.fetchConfirmedAppointmentDetails,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ConfirmedAppointmentDetailsPage);
