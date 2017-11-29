import moment from 'moment';

export function validate(type, value) {
  if(value.length < 1) {
    return 'error';
  }
  switch(type) {
    case "string":
      return 'success';
    case "number":
      if(isNaN(value)) {
        return 'error';
      }
      return 'success';
    case "date":
      const m = moment(value, [moment.ISO_8601, "MM/DD/YYYY"])
      if(!m.isValid()) {
        return 'error'
      }
      return 'success';
    default:
      return null;
  }
}