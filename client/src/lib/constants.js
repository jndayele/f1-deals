export const WHATSAPP_NUMBER = "233554367094"; // 055 436 7094 with country code

export const getWhatsAppLink = (message) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

export const SERVICES = [
  {
    id: "01",
    title: "Car Buying",
    description: "We source the best vehicles globally and locally to match your exact specifications.",
    whatsappMessage: "Hi F1 Deals, I want to buy a car."
  },
  {
    id: "02",
    title: "Car Selling",
    description: "Get the best market value for your vehicle without the hassle of dealing with buyers.",
    whatsappMessage: "Hi F1 Deals, I want to sell a car."
  },
  {
    id: "03",
    title: "Car Swapping",
    description: "Trade in your current vehicle and upgrade to a newer model seamlessly.",
    whatsappMessage: "Hi F1 Deals, I want to swap my car."
  },
  {
    id: "04",
    title: "Car Shipping",
    description: "Secure, insured vehicle shipping from overseas straight to your doorstep.",
    whatsappMessage: "Hi F1 Deals, I want to ship a car."
  },
  {
    id: "05",
    title: "Maintenance",
    description: "Expert servicing to keep your vehicle running at optimal performance.",
    whatsappMessage: "Hi F1 Deals, I need maintenance service."
  },
  {
    id: "06",
    title: "Parts",
    description: "Genuine automotive parts sourced and delivered nationwide.",
    whatsappMessage: "Hi F1 Deals, I am looking for parts."
  }
];
