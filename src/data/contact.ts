export const CONTACT = {
  phone: '+91 87565 57994',
  phoneTel: '+918756557994',
  phoneWa: '918756557994',
  email: 'cscpipraichgkp@gmail.com',
  addressLine1: 'Near Saint Xavier\'s School, Bhatahat Road',
  addressLine2: 'Buddh Nagar, Nagar Panchayat Pipraich',
  addressLine3: 'Gorakhpur, Uttar Pradesh, India',
  hours: 'Monday – Saturday: 9:00 AM – 8:00 PM',
  dayOff: 'Sunday: Closed',
  mapsUrl: 'https://maps.google.com/?q=Near+Saint+Xaviers+School+Bhatahat+Road+Buddh+Nagar+Pipraich+Gorakhpur+Uttar+Pradesh',
};

export function waLink(serviceOrMessage = '', isCustomMessage = false) {
  let msg = '';
  if (isCustomMessage && serviceOrMessage) {
    msg = serviceOrMessage;
  } else if (serviceOrMessage) {
    msg = `Hello Gupta Enterprises, I need assistance regarding ${serviceOrMessage}. Please share the requirements and details.`;
  } else {
    msg = 'Hello Gupta Enterprises, I need assistance with digital services. Please share the requirements and details.';
  }
  return `https://wa.me/${CONTACT.phoneWa}?text=${encodeURIComponent(msg)}`;
}

