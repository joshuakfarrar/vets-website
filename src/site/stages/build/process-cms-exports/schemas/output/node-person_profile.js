module.exports = {
  type: 'object',
  properties: {
    contentModelType: { enum: ['node-person_profile'] },
    entityType: { enum: ['node'] },
    entityBundle: { enum: ['person_profile'] },
    entityUrl: { $ref: 'EntityUrl' },
    title: { type: 'string' },
    fieldBody: {
      type: ['object', 'null'],
      properties: {
        processed: { type: 'string' },
      },
    },
    fieldDescription: { type: ['string', 'null'] },
    fieldEmailAddress: { type: ['string', 'null'] },
    fieldLastName: { type: ['string', 'null'] },
    fieldMedia: { $ref: 'Media' },
    fieldNameFirst: { type: 'string' },
    // This isn't a node-office $ref because we only want
    // some of the properties in the entity
    fieldOffice: {
      type: ['object', 'null'],
      properties: {
        entity: {
          type: 'object',
          properties: {
            entityLabel: { type: 'string' },
            entityType: { type: 'string' },
            entityUrl: { $ref: 'EntityUrl' },
          },
          required: ['entityLabel'],
        },
      },
      required: ['entity'],
    },
    fieldPhoneNumber: { type: ['string', 'null'] },
    fieldSuffix: { type: ['string', 'null'] },
    entityPublished: { type: 'boolean' },
    fieldIntroText: { type: ['string', 'null'] },
    fieldPhotoAllowHiresDownload: { type: 'boolean' },
    changed: { type: 'number' },
    status: { type: 'boolean' },
    entityMetatags: { $ref: 'MetaTags' },
    fieldCompleteBiography: { type: ['string', 'null'] },
  },
  required: [
    'title',
    'fieldBody',
    'fieldDescription',
    'fieldEmailAddress',
    'fieldLastName',
    'fieldMedia',
    'fieldNameFirst',
    'fieldOffice',
    'fieldPhoneNumber',
    'fieldSuffix',
    'entityPublished',
    'fieldIntroText',
    'fieldPhotoAllowHiresDownload',
    'changed',
    'status',
    'entityMetatags',
    'fieldCompleteBiography',
  ],
};