const CountEntityTypes = `
{

  benefitPages: nodeQuery(
    filter: {
      conditions: [
        {field: "status", value: ["1"]},
        {field: "type", value: ["page"]}
      ]}
  	) {
    count
  }

  vaForm: nodeQuery(
    filter: {
      conditions: [
        {field: "status", value: ["1"]},
        {field: "type", value: ["va_form"]}
      ]}
  	) {
    count
  }

  healthCareLocalFacility: nodeQuery(
    filter: {
      conditions: [
        {field: "status", value: ["1"]},
        {field: "type", value: ["health_care_local_facility"]}
      ]}
  	) {
    count
  }

  healthServicesListing: nodeQuery(
    filter: {
      conditions: [
        {field: "status", value: ["1"]},
        {field: "type", value: ["health_services_listing"]}
      ]}
  	) {
    count
  }

  event: nodeQuery(
    filter: {
      conditions: [
        {field: "status", value: ["1"]},
        {field: "type", value: ["event"]}
      ]}
  	) {
    count
  }

  healthCareRegionDetailPage: nodeQuery(
    filter: {
      conditions: [
        {field: "status", value: ["1"]},
        {field: "type", value: ["health_care_region_detail_page"]}
      ]}
  	) {
    count
  }

  personProfile: nodeQuery(
    filter: {
      conditions: [
        {field: "status", value: ["1"]},
        {field: "type", value: ["person_profile"]}
      ]}
  	) {
    count
  }
}
`;

module.exports = {
  CountEntityTypes,
};
