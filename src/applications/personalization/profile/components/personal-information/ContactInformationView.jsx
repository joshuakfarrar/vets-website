import React from 'react';
import { formatAddress } from 'platform/forms/address/helpers';
import ReceiveTextMessages from 'platform/user/profile/vap-svc/containers/ReceiveTextMessages';
import { FIELD_NAMES } from '@@vap-svc/constants';
import Telephone from '@department-of-veterans-affairs/formation-react/Telephone';

import {
  addresses,
  phoneNumbers,
} from '~/applications/personalization/profile/util/deriveContactInfoProperties';

const ContactInformationView = props => {
  const { data, fieldName } = props;
  if (!data) {
    return null;
  }

  if (fieldName === FIELD_NAMES.EMAIL) {
    return <span>{data?.emailAddress}</span>;
  }

  if (phoneNumbers.includes(fieldName)) {
    return (
      <div>
        <Telephone
          contact={`${data?.areaCode}${data?.phoneNumber}`}
          extension={data?.extension}
          notClickable
        />

        {fieldName === FIELD_NAMES.MOBILE_PHONE && (
          <ReceiveTextMessages fieldName={FIELD_NAMES.MOBILE_PHONE} />
        )}
      </div>
    );
  }

  if (addresses.includes(fieldName)) {
    const { street, cityStateZip, country } = formatAddress(data);

    return (
      <div>
        {street}
        <br />
        {cityStateZip}

        {country && (
          <>
            <br />
            {country}
          </>
        )}
      </div>
    );
  }

  return null;
};

export default ContactInformationView;
