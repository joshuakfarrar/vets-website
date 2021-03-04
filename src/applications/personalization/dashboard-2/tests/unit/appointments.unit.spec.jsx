// Ensure sorting is done correctly (startsAt wise)
// Ensure we display the correct location for CC and VA
// Ensure we show correct additional Info for video
// Ensure we display correct timezone

import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';

import Appointments from '~/applications/personalization/dashboard-2/components/health-care/Appointments';

import {
  upcomingVAAppointment,
  upcomingCCAppointment,
  upcomingVideoAppointment,
  farFutureAppointments,
} from '~/applications/personalization/dashboard-2/utils/mocks/appointments';

describe('Appointments', () => {
  describe('when we have an upcoming VA appointment', () => {
    const props = {
      authenticatedWithSSOe: true,
      appointments: upcomingVAAppointment,
    };
    const wrapper = mount(<Appointments {...props} />);

    it('should render all necessary elements', () => {
      expect(wrapper.text()).to.contain('Cheyenne VA Medical Center');
      expect(wrapper.text()).to.contain('3 upcoming appointments');
      wrapper.unmount();
    });
  });

  describe('when we have an upcoming CC appointment', () => {
    const props = {
      authenticatedWithSSOe: true,
      appointments: upcomingCCAppointment,
    };

    const wrapper = mount(<Appointments {...props} />);

    it('should render all necessary elements', () => {
      expect(wrapper.text()).to.contain('Jeckle and Hyde');
      expect(wrapper.text()).to.contain('3 upcoming appointments');
      wrapper.unmount();
    });
  });

  describe('when we have an upcoming video appointment', () => {
    const props = {
      authenticatedWithSSOe: true,
      appointments: upcomingVideoAppointment,
    };
    const wrapper = mount(<Appointments {...props} />);

    it('should render all necessary elements', () => {
      expect(wrapper.text()).to.contain('VA Video Connect at home');
      expect(wrapper.text()).to.contain('3 upcoming appointments');
      wrapper.unmount();
    });
  });

  describe('when we do not have any scheduled appointments', () => {
    const props = {
      authenticatedWithSSOe: true,
      appointments: [],
    };
    const wrapper = mount(<Appointments {...props} />);

    it('should render all necessary elements', () => {
      expect(wrapper.text()).not.to.contain('Appointments');
      wrapper.unmount();
    });
  });

  describe('when we do not have upcoming appointments in the next 30 days, but after', () => {
    const props = {
      authenticatedWithSSOe: true,
      appointments: farFutureAppointments,
    };
    const wrapper = mount(<Appointments {...props} />);

    it('should render all necessary elements', () => {
      expect(wrapper.text()).to.contain(
        'You have no appointments scheduled in the next 30 days.',
      );
      expect(wrapper.text()).to.contain('3 upcoming appointments');
      wrapper.unmount();
    });
  });
});
