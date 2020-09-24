import _ from 'lodash/fp'; // eslint-disable-line no-restricted-imports
import { createSelector } from 'reselect';

import {
  countries,
  states,
  isValidUSZipCode,
  isValidCanPostalCode,
} from 'platform/forms/address';

function validatePostalCodes(errors, address) {
  let isValidPostalCode = true;

  // Checks if postal code is valid
  if (address.country === 'USA') {
    isValidPostalCode =
      isValidPostalCode && isValidUSZipCode(address.postalCode);
  }
  if (address.country === 'CAN') {
    isValidPostalCode =
      isValidPostalCode && isValidCanPostalCode(address.postalCode);
  }

  // Add error message for postal code if it is invalid
  if (address.postalCode && !isValidPostalCode) {
    errors.postalCode.addError('Please provide a valid postal code');
  }
}

export const stateRequiredCountries = new Set(['USA', 'CAN']);

const countryLabels = [
  'Belize',
  'Botswana',
  'Cameroon',
  'Central African Republic',
  'Chad',
  'Gambia',
  'Grenada',
  'Hong Kong',
  'Ireland',
  'Mauritania',
  'Netherlands Antilles',
  'Qatar',
  'Seychelles',
  'Syrian Arab Republic',
  'Tanzania',
  'Tonga',
  'Yemen',
  'Zimbabwe',
];

const targetValues = countries.map(country => {
  if (countryLabels.includes(country.label)) {
    return country.value;
  }
  return '';
});

const postalCodeNotRequiredCountries = new Set(targetValues);

function validateAddress(errors, address, formData, currentSchema) {
  // Adds error message for state if it is blank and one of the following countries:
  // USA, Canada, or Mexico
  if (
    stateRequiredCountries.has(address.country) &&
    address.state === undefined &&
    currentSchema.required.length
  ) {
    errors.state.addError('Please select a state or province');
  }

  const hasAddressInfo =
    stateRequiredCountries.has(address.country) &&
    !currentSchema.required.length &&
    typeof address.street !== 'undefined' &&
    typeof address.city !== 'undefined' &&
    typeof address.postalCode !== 'undefined';

  if (hasAddressInfo && typeof address.state === 'undefined') {
    errors.state.addError(
      'Please enter a state or province, or remove other address information.',
    );
  }

  validatePostalCodes(errors, address);
}

const countryValues = countries.map(object => object.value);
const countryNames = countries.map(object => object.label);
const militaryStates = states.USA.filter(
  state => state.value === 'AE' || state.value === 'AP' || state.value === 'AA',
).map(state => state.value);
const militaryLabels = states.USA.filter(
  state => state.value === 'AE' || state.value === 'AP' || state.value === 'AA',
).map(state => state.label);
const usaStates = states.USA.map(state => state.value);
const usaLabels = states.USA.map(state => state.label);
const canProvinces = states.CAN.map(state => state.value);
const canLabels = states.CAN.map(state => state.label);
const mexStates = states.MEX.map(state => state.value);
const mexLabels = states.MEX.map(state => state.label);

function isMilitaryCity(city = '') {
  const lowerCity = city.toLowerCase().trim();

  return lowerCity === 'apo' || lowerCity === 'fpo' || lowerCity === 'dpo';
}

const requiredFields = ['street', 'city', 'country'];

/*
 * Create schema for addresses
 *
 * @param {object} schema - Schema for a full form, including address definition in definitions
 * @param {boolean} isRequired - If the address is required or not, defaults to false
 * @param {string} addressProperty - The name of the address definition to use from the common
 *   definitions in currentSchema
 */
export function schema(
  currentSchema,
  isRequired = false,
  addressProperty = 'address',
) {
  const addressSchema = currentSchema.definitions[addressProperty];
  return {
    type: 'object',
    required: isRequired ? requiredFields : ['country', 'postalCode'],
    properties: _.assign(addressSchema.properties, {
      country: {
        default: 'USA',
        type: 'string',
        enum: countryValues,
        enumNames: countryNames,
      },
      state: {
        title: 'State',
        type: 'string',
        maxLength: 51,
      },
      postalCode: {
        title: 'Postal code',
        type: 'string',
        maxLength: 10,
      },
    }),
  };
}

/*
 * Create uiSchema for addresses
 *
 * @param {string} label - Block label for the address
 * @param {boolean} useStreet3 - Show a third line in the address
 * @param {function} isRequired - A function for conditionally setting if an address is required.
 *   Receives formData and an index (if in an array item)
 * @param {boolean} ignoreRequired - Ignore the required fields array, to avoid overwriting form specific
 *   customizations
 */
export function uiSchema(
  label = 'Address',
  useStreet3 = false,
  isRequired = null,
  ignoreRequired = false,
) {
  let fieldOrder = [
    'country',
    'street',
    'street2',
    'street3',
    'city',
    'state',
    'postalCode',
  ];
  if (!useStreet3) {
    fieldOrder = fieldOrder.filter(field => field !== 'street3');
  }

  const addressChangeSelector = createSelector(
    ({ formData, path }) => _.get(path.concat('country'), formData),
    ({ formData, path }) => _.get(path.concat('city'), formData),
    _.get('addressSchema'),
    (currentCountry, city, addressSchema) => {
      const schemaUpdate = {
        properties: addressSchema.properties,
        required: addressSchema.required,
      };
      const country =
        currentCountry || addressSchema.properties.country.default;
      const required = addressSchema.required.length > 0;

      let stateList;
      let labelList;
      if (country === 'USA') {
        stateList = usaStates;
        labelList = usaLabels;
      } else if (country === 'CAN') {
        stateList = canProvinces;
        labelList = canLabels;
      } else if (country === 'MEX') {
        stateList = mexStates;
        labelList = mexLabels;
      }

      if (stateList) {
        // We have a list and it’s different, so we need to make schema updates
        if (addressSchema.properties.state.enum !== stateList) {
          const withEnum = _.set(
            'state.enum',
            stateList,
            schemaUpdate.properties,
          );
          schemaUpdate.properties = _.set(
            'state.enumNames',
            labelList,
            withEnum,
          );

          // all the countries with state lists require the state field, so add that if necessary
          if (
            !ignoreRequired &&
            required &&
            !addressSchema.required.some(field => field === 'state') &&
            country !== 'MEX'
          ) {
            schemaUpdate.required = addressSchema.required.concat('state');
          }
        }
        // We don’t have a state list for the current country, but there’s an enum in the schema
        // so we need to update it
      } else if (addressSchema.properties.state.enum) {
        const withoutEnum = _.unset('state.enum', schemaUpdate.properties);
        schemaUpdate.properties = _.unset('state.enumNames', withoutEnum);
        if (!ignoreRequired && required) {
          schemaUpdate.required = addressSchema.required.filter(
            field => field !== 'state',
          );
        }
      }

      // Canada has a different title than others, so set that when necessary
      if (
        country === 'CAN' &&
        addressSchema.properties.state.title !== 'Province'
      ) {
        schemaUpdate.properties = _.set(
          'state.title',
          'Province',
          schemaUpdate.properties,
        );
      } else if (
        country !== 'CAN' &&
        addressSchema.properties.state.title !== 'State'
      ) {
        schemaUpdate.properties = _.set(
          'state.title',
          'State',
          schemaUpdate.properties,
        );
      }

      if (
        country === 'USA' &&
        addressSchema.properties.postalCode.title !== 'Zip code'
      ) {
        schemaUpdate.properties = _.set(
          'postalCode.title',
          'Zip code',
          schemaUpdate.properties,
        );
      } else if (
        country !== 'USA' &&
        addressSchema.properties.postalCode.title !== 'Postal code'
      ) {
        schemaUpdate.properties = _.set(
          'postalCode.title',
          'Postal code',
          schemaUpdate.properties,
        );
      }

      // We constrain the state list when someone picks a city that’s a military base
      if (
        country === 'USA' &&
        isMilitaryCity(city) &&
        schemaUpdate.properties.state.enum !== militaryStates
      ) {
        const withEnum = _.set(
          'state.enum',
          militaryStates,
          schemaUpdate.properties,
        );
        schemaUpdate.properties = _.set(
          'state.enumNames',
          militaryLabels,
          withEnum,
        );
      }

      return schemaUpdate;
    },
  );

  function postalCodeRequired(formData) {
    return !postalCodeNotRequiredCountries.has(formData.address.country);
  }

  function stateRequired(formData) {
    return stateRequiredCountries.has(formData.address.country);
  }

  function setRequiredFields(required, currentSchema, formData) {
    const addressFields = [];
    if (required) {
      requiredFields.forEach(field => {
        addressFields.push(field);
      });
      if (postalCodeRequired(formData)) {
        addressFields.push('postalCode');
      }
    } else if (!required) {
      addressFields.push('country');
    }
    if (stateRequired(formData)) {
      addressFields.push('state');
    }
    return _.set('required', addressFields, currentSchema);
  }

  return {
    'ui:title': label,
    'ui:validations': [validateAddress],
    'ui:options': {
      updateSchema: (formData, addressSchema, addressUiSchema, index, path) => {
        let currentSchema = addressSchema;
        if (isRequired) {
          const required = isRequired(formData, index);
          currentSchema = setRequiredFields(required, currentSchema, formData);
        }
        return addressChangeSelector({
          formData,
          addressSchema: currentSchema,
          path,
        });
      },
    },
    'ui:order': fieldOrder,
    country: {
      'ui:title': 'Country',
    },
    street: {
      'ui:title': 'Street',
      'ui:errorMessages': {
        required: 'Please enter a street address',
      },
    },
    street2: {
      'ui:title': 'Line 2',
    },
    street3: {
      'ui:title': 'Line 3',
    },
    city: {
      'ui:title': 'City',
      'ui:errorMessages': {
        required: 'Please enter a city',
      },
    },
    state: {
      'ui:errorMessages': {
        required: 'Please enter a state',
      },
    },
    postalCode: {
      'ui:options': {
        widgetClassNames: 'usa-input-medium',
      },
      'ui:errorMessages': {
        required: 'Please enter a zip code',
        pattern: 'Please enter a valid 5- or 9-digit zip code (dashes allowed)',
      },
    },
  };
}
