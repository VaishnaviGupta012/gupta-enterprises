/**
 * Gupta Enterprises - Business Contact & Location Information
 */

export const CONTACT = {
  name: "Gupta Enterprises",
  tagline: "Authorized CSC & Digital Seva Kendra",
  centreHead: "Mr. Gupta",
  phone: "+91 87565 57994",
  phoneTel: "+918756557994",
  phoneWa: "918756557994",
  email: "cscpipraichgkp@gmail.com",
  addressLine1: "Near Saint Xavier's School, Bhatahat Road",
  addressLine2: "Buddh Nagar, Nagar Panchayat Pipraich",
  addressLine3: "Gorakhpur, Uttar Pradesh - 273152, India",
  fullAddress:
    "Near Saint Xavier's School, Bhatahat Road, Buddh Nagar, Pipraich, Gorakhpur, UP - 273152",
  hours: "Monday – Saturday: 9:00 AM – 8:00 PM",
  dayOff: "Sunday: Closed (Available on-call for urgent requirements)",
  mapsUrl:
    "https://maps.google.com/?q=Near+Saint+Xaviers+School+Bhatahat+Road+Buddh+Nagar+Pipraich+Gorakhpur+Uttar+Pradesh",
}

/**
 * Generate a pre-filled WhatsApp click-to-chat URL
 */
export function waLink(serviceOrMessage = "", isCustomMessage = false): string {
  let msg = ""
  if (isCustomMessage && serviceOrMessage) {
    msg = serviceOrMessage
  } else if (serviceOrMessage) {
    msg = `Hello Gupta Enterprises, I need assistance regarding ${serviceOrMessage}. Please share the required documents and details.`
  } else {
    msg =
      "Hello Gupta Enterprises, I need assistance with your digital citizen services. Please guide me."
  }
  return `https://wa.me/${CONTACT.phoneWa}?text=${encodeURIComponent(msg)}`
}
