// Data used to build parts of the site at runtime.
// Kept in a separate file so main.js stays readable.

// Recent work shown in the home page gallery. The photos are the same
// Unsplash images used across the site, cited in the README.
const recentWork = [
  {
    src: "images/hero-electric.jpg",
    thumb: "images/hero-electric-480.jpg",
    alt: "DB board upgrade completed in Bryanston",
    caption: "DB board upgrade, Bryanston",
    category: "electrical"
  },
  {
    src: "images/plumber-sink.jpg",
    thumb: "images/plumber-sink-480.jpg",
    alt: "Kitchen mixer replacement in Sandton",
    caption: "Kitchen mixer replacement, Sandton",
    category: "plumbing"
  },
  {
    src: "images/electrician-panel.jpg",
    thumb: "images/electrician-panel-480.jpg",
    alt: "Certificate of Compliance inspection in Randburg",
    caption: "CoC inspection, Randburg",
    category: "electrical"
  },
  {
    src: "images/pipes-industrial.jpg",
    thumb: "images/pipes-industrial-480.jpg",
    alt: "Borehole pump installation in Midrand",
    caption: "Borehole pump installation, Midrand",
    category: "plumbing"
  },
  {
    src: "images/electrician-work.jpg",
    thumb: "images/electrician-work-480.jpg",
    alt: "Emergency rewiring after a power surge",
    caption: "Emergency rewiring after a surge",
    category: "electrical"
  },
  {
    src: "images/engineer-team.jpg",
    thumb: "images/engineer-team.jpg",
    alt: "Solar backup installation in Fourways",
    caption: "Solar backup installation, Fourways",
    category: "electrical"
  },
  {
    src: "images/house-exterior.jpg",
    thumb: "images/house-exterior-480.jpg",
    alt: "Leak detection at a Rosebank home",
    caption: "Leak detection, Rosebank",
    category: "plumbing"
  },
  {
    src: "images/blueprint.jpg",
    thumb: "images/blueprint.jpg",
    alt: "Bathroom renovation plan being measured up",
    caption: "Bathroom renovation, Parkhurst",
    category: "plumbing"
  }
];

// Testimonials rendered onto the home page by main.js.
const testimonials = [
  {
    quote: "Our geyser burst on a Sunday night. VoltStream arrived in 40 minutes, replaced the unit by 10pm and cleaned up perfectly. Incredible service.",
    name: "Lerato M.",
    area: "Bryanston"
  },
  {
    quote: "They upgraded our DB board and issued the CoC the same week. Professional, tidy and fairly priced. Highly recommended.",
    name: "Johan V.",
    area: "Randburg"
  },
  {
    quote: "Our borehole pump failed during a heatwave. The team sourced the part the same morning and had the water back on before lunch.",
    name: "Anele D.",
    area: "Fourways"
  },
  {
    quote: "The annual maintenance plan caught a faulty earth leakage before it became a fire risk. Worth every cent.",
    name: "Fatima S.",
    area: "Sandton"
  }
];

// Longer bios for the team modals on the about page. The short versions
// stay in the HTML; these are revealed when a card is clicked.
const teamBios = {
  "zanele": {
    name: "Zanele Mthembu",
    role: "Founder & Master Plumber",
    bio: "Zanele started VoltStream in 2011 with one bakkie and a toolbox. Before that she spent nine years with a big contracting firm, where she ran the geyser and borehole divisions. She is registered with the Plumbing Industry Registration Board and has personally trained most of the plumbing team. When she is not on site she handles the big renovation quotes.",
    detail: "21 years of experience. Specialties: geysers, boreholes and old-home renovations."
  },
  "ruan": {
    name: "Ruan Botha",
    role: "Master Electrician",
    bio: "Ruan joined in 2016 to build the electrical division from scratch. He is a registered installation electrician with the Department of Labour and spent a decade doing industrial control panels before moving to residential work. He signs off every Certificate of Compliance VoltStream issues.",
    detail: "14 years of experience. Specialties: solar and battery backup, DB boards and CoCs."
  },
  "ayanda": {
    name: "Ayanda Cele",
    role: "Operations Manager",
    bio: "Ayanda runs the control room: the job schedule, the parts store and the 24/7 emergency rota. He started as an electrical technician, so he can talk a panicking customer through switching off a DB board while a team is on the way.",
    detail: "Ex-technician, now in charge of scheduling, stock and the emergency line."
  }
};

// Frequently asked questions for the services page accordion.
const faqs = [
  {
    question: "Are you really available 24 hours a day?",
    answer: "Yes. The emergency line is answered by a person, not a machine, every day of the year. Call-outs outside office hours carry a flat R950 call-out fee plus parts, and we confirm the fee on the phone before the van leaves."
  },
  {
    question: "Do you charge for quotes?",
    answer: "No. Standard quotes are free and fixed - the price we quote is the price you pay. Complex investigations like electronic leak detection are quoted separately before any work starts."
  },
  {
    question: "How fast can you get to my property?",
    answer: "In Sandton, Randburg, Fourways and Bryanston we usually arrive within 60 minutes. For Midrand and Rosebank allow up to 90 minutes. The control room gives you an ETA when you call."
  },
  {
    question: "Who issues the Certificate of Compliance?",
    answer: "Our master electrician Ruan Botha is a registered installation electrician, so VoltStream issues CoCs for its own work and for property sales inspections. The certificate is valid for two years from the date of issue."
  },
  {
    question: "Is your work guaranteed?",
    answer: "Every job carries a 12-month workmanship guarantee. If something we fixed fails in that time, we come back and put it right at no charge."
  }
];
