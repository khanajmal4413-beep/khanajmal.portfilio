/* =====================================================================
   PORTFOLIO CONFIG — edit this one file to update the whole website.
   ---------------------------------------------------------------------
   • Every section of the site is built from the data below.
   • Leave a list empty ([]) to hide that section (e.g. certifications).
   • Leave a link empty ("") to hide its button.
   • Lines marked  TODO  are things only you can fill in.
   ===================================================================== */

window.PORTFOLIO = {

  /* ---------- Website ---------- */
  site: {
    url: "https://khanajmal4413-beep.github.io/khanajmal.portfilio/",
    defaultTheme: "light"            // "light" or "dark" (visitor's choice is remembered)
  },

  /* ---------- About you ---------- */
  person: {
    name: "Muhammad Ajmal",
    initials: "MA",
    title: "Full-Stack Software Developer",
    tagline: ".NET & JavaScript",
    roles: [                          // rotating titles in the hero
      "Full-Stack Software Developer",
      ".NET Core & ASP.NET Developer",
      "React & Angular Developer",
      "ERP Systems Developer"
    ],
    location: "Islamabad, Pakistan",
    hometown: "Matta, Swat",
    photo: "profile-gray.webp",
    photoFallback: "profile-gray.jpg",
    // To use the navy-suit photo instead: "profile-navy.webp" and "profile-navy.jpg"
    photoAlt: "Professional portrait of Muhammad Ajmal in a suit and tie",
    email: "khanajmal4413@gmail.com",
    phone: "+92 348 2481071",
    whatsapp: "923482481071",         // digits only, with country code
    resume: "Muhammad_Ajmal_CV.pdf",
    careerStart: "2023-06",           // used to calculate "years of experience"

    summary:
      "I build and maintain ERP and web-based business systems with C#, ASP.NET, .NET Core, React, Angular and Node.js — from database design to responsive front-ends and cloud deployment on Azure and IIS.",

    about: [
      "I'm a full-stack software developer from Swat, Pakistan, now based in Islamabad. Since June 2023 I've been a Software Developer at Infigo Solutions, where I design, build and deploy web applications used in real business operations.",
      "I'm comfortable across the full development lifecycle — designing databases, building REST and Web APIs, and delivering responsive front-ends. I've contributed core modules to BHA ERP, a large enterprise resource planning system, and built and supported IRM OSCAR, a restaurant management system."
    ],
    objective:
      "To bring proven full-stack expertise to a forward-thinking software team — locally, remotely or internationally — and keep growing as an engineer on systems that matter to the business.",
    interests: ["Enterprise & ERP systems", "Web APIs & integrations", "Modern front-end frameworks", "Cloud deployment"],
    strengths: [
      "Full development lifecycle: database → API → UI → deployment",
      "Debugging complex issues in large codebases",
      "Requirement gathering with cross-functional teams",
      "Delivering features on schedule in agile teams"
    ],
    availability: {
      open: true,                     // shows the green "Available" badge
      label: "Available for new opportunities",
      modes: ["Full-time roles", "Remote work", "Freelance projects"],
      // TODO: confirm this line is true for you, or set it to "" to hide it
      relocation: "Open to relocation — UAE, Saudi Arabia, Qatar, Kuwait"
    },
    languages: [
      { name: "Pashto", level: "Native" },
      { name: "Urdu", level: "Proficient (C1)" },
      { name: "English", level: "Professional working (B1/B2)" }
    ],
    hobbies: ["Football", "Cricket", "Travelling", "Coding"]
  },

  /* ---------- Social links (empty url = hidden) ---------- */
  social: [
    { label: "LinkedIn", icon: "linkedin", url: "https://www.linkedin.com/in/khan-ajmal-86a833271" },
    { label: "GitHub", icon: "github", url: "https://github.com/khanajmal4413-beep" }
  ],

  /* ---------- Skills (countable:false = not counted in the "technical skills" number) ---------- */
  skills: [
    { group: "Languages", icon: "code", items: ["C#", "JavaScript", "PHP", "SQL", "HTML5", "CSS3"] },
    { group: "Frontend", icon: "layout", items: ["React.js", "Angular", "jQuery", "Bootstrap", "Responsive design"] },
    { group: "Backend", icon: "server", items: ["ASP.NET", ".NET Core", "ASP.NET Web Forms", "ASP.NET Web API", "Node.js", "REST APIs"] },
    { group: "Databases", icon: "database", items: ["SQL", "MySQL", "Database design"] },
    { group: "Cloud & Deployment", icon: "cloud", items: ["Microsoft Azure", "IIS"] },
    { group: "IT Support", icon: "wrench", countable: false, items: ["Application troubleshooting", "Computer & systems management", "Office IT support", "Microsoft Office Suite"] },
    { group: "Professional", icon: "users", countable: false, items: ["Agile teamwork", "Requirement gathering", "Debugging & problem solving", "On-time delivery"] }
  ],

  /* ---------- Work experience (newest first; end: null = Present) ---------- */
  experience: [
    {
      role: "Software Developer",
      company: "Infigo Solutions",
      location: "Islamabad, Pakistan",
      start: "2023-06",
      end: null,
      summary: "Full-stack development of enterprise ERP and web systems.",
      highlights: [
        "Contributed core modules to BHA ERP, a large-scale enterprise resource planning system used in day-to-day business operations.",
        "Built and supported IRM OSCAR, a restaurant management system covering order management, billing and reporting."
      ],
      responsibilities: [
        "Design and develop scalable web applications using C#, ASP.NET, .NET Core and Web Forms, alongside React and Angular.",
        "Build and integrate REST and Web APIs; manage application deployments on Microsoft Azure and IIS.",
        "Design responsive, customer-facing websites using HTML, CSS, Bootstrap and React.",
        "Work with cross-functional teams in an agile environment to gather requirements, debug complex issues and ship on schedule."
      ],
      tech: ["C#", "ASP.NET", ".NET Core", "Web Forms", "Web API", "React", "Angular", "Bootstrap", "Azure", "IIS"]
    },
    {
      role: "Computer Operator",
      company: "Tehsil Municipal Administration (TMA), Matta",
      location: "Swat, Pakistan",
      start: "2022-02",
      end: "2023-01",
      summary: "IT operations and support for a municipal administration office.",
      highlights: [],
      responsibilities: [
        "Managed day-to-day computer operations, data entry and record-keeping for the administration.",
        "Provided application troubleshooting and basic IT support for office systems."
      ],
      tech: ["Microsoft Office", "Data management", "IT support"]
    }
  ],

  /* ---------- Education (newest first) ---------- */
  education: [
    { degree: "BS Computer Science", school: "University of Swat", location: "Swat, Pakistan", start: "2018", end: "2022", result: "71.87%", note: "Graduated December 2022" },
    { degree: "Intermediate (Pre-Engineering)", school: "Govt. Post Graduate Jahanzeb College", location: "Mingora, Swat", start: "2015", end: "2017", result: "61.63%", note: "" },
    { degree: "Matriculation (SSC)", school: "Abdali Public School and College", location: "Matta, Swat", start: "2013", end: "2015", result: "81.90%", note: "" }
  ],

  /* ---------- Projects ----------
     category: used by the filter buttons.
     image: path to a real screenshot (e.g. "shots/erp.webp"). Empty = illustrated preview.
     liveUrl / repoUrl: empty = button hidden. confidential: true shows "Private client project".
     challenge / solution / outcome: TODO — fill these in to show them in the project details. */
  projects: [
    {
      id: "bha-erp",
      title: "BHA ERP System",
      category: "Enterprise ERP",
      featured: true,
      summary: "Core modules for a large enterprise resource planning platform used to run day-to-day business operations.",
      role: "Software Developer — core module development",
      company: "Infigo Solutions",
      features: ["Core ERP modules", "Business operations management", "Enterprise-scale system"],
      tech: [],          // TODO: add the exact technologies used on this project
      image: "", art: "erp",
      liveUrl: "", repoUrl: "", confidential: true,
      challenge: "", solution: "", outcome: ""
    },
    {
      id: "irm-oscar",
      title: "IRM OSCAR — Restaurant Management",
      category: "Enterprise ERP",
      featured: true,
      summary: "End-to-end ERP module handling restaurant order processing, billing and reporting.",
      role: "Software Developer — built and supported",
      company: "Infigo Solutions",
      features: ["Order management", "Billing", "Reporting"],
      tech: [],          // TODO
      image: "", art: "pos",
      liveUrl: "", repoUrl: "", confidential: true,
      challenge: "", solution: "", outcome: ""
    },
    {
      id: "property-portal",
      title: "House Rental & Property Portal",
      category: "Web Platform",
      featured: false,
      summary: "Web platform for listing, renting and selling properties, with listings management and search filters.",
      role: "Developer",
      company: "",
      features: ["Property listings management", "Search filters", "Rent & sell flows"],
      tech: [],          // TODO
      image: "", art: "home",
      liveUrl: "", repoUrl: "", confidential: false,
      challenge: "", solution: "", outcome: ""
    }
  ],

  /* ---------- Services ---------- */
  services: [
    { icon: "layout", title: "Web Application Development", text: "Full-stack web apps with ASP.NET / .NET Core on the back end and React or Angular on the front end." },
    { icon: "boxes", title: "ERP & Business Systems", text: "Building and extending modules for ERP, billing, ordering and reporting systems that run daily operations." },
    { icon: "plug", title: "API Development & Integration", text: "Designing REST and Web APIs and connecting applications, services and front-ends together." },
    { icon: "monitor", title: "Responsive Websites", text: "Customer-facing websites with HTML, CSS, Bootstrap and React that work on every screen size." },
    { icon: "database", title: "Database Design", text: "Structuring SQL and MySQL databases for reliable, maintainable business data." },
    { icon: "cloud", title: "Deployment on Azure & IIS", text: "Publishing and maintaining applications on Microsoft Azure and IIS servers." },
    { icon: "wrench", title: "IT Support & Troubleshooting", text: "Diagnosing application issues and supporting office computer systems." }
  ],

  /* ---------- Certifications (empty = section hidden) ----------
     Example:
     { name: "Azure Fundamentals (AZ-900)", issuer: "Microsoft", date: "2025-03",
       image: "certs/az900.webp", file: "certs/az900.pdf", verifyUrl: "https://..." } */
  certifications: [],

  /* ---------- Testimonials (empty = section hidden). Only add genuine ones. ----------
     Example: { quote: "...", name: "Full Name", role: "Team Lead, Company" } */
  testimonials: [],

  /* ---------- Contact form ----------
     To receive messages in your inbox, create a FREE access key at https://web3forms.com
     (enter khanajmal4413@gmail.com), then paste it below.
     Until a key is added, the form opens the visitor's email app instead. */
  contact: {
    web3formsKey: "",                 // TODO: paste your Web3Forms access key here
    subjectPrefix: "Portfolio enquiry"
  }
};
