export const resumeData = {
  personal: {
    name: "David Dew Mallick",
    role: "Software Engineer",
    company: "JB Connect Ltd.",
    email: "david.dew.mallick@g.bracu.ac.bd",
    phone: "+880-1836475822",
    github: "https://github.com/dew97-tech",
    linkedin: "https://www.linkedin.com/in/david-dew-mallick-618a6223b/",
    location: "Dhaka, Bangladesh",
    tagline:
      "Software engineer building AI-driven SaaS infrastructure, cloud pipelines, and data-heavy features with Laravel and AWS.",
  },
  education: [
    {
      institution: "BRAC University",
      location: "Dhaka, Bangladesh",
      degree: "Bachelor of Science in Computer Science and Engineering",
      date: "Aug 2018 - Dec 2022",
      gpa: "3.55/4.00",
    },
    {
      institution: "St. Gregory's High School and College",
      location: "Dhaka, Bangladesh",
      degree: "Higher Secondary Certificate",
      date: "2016 - 2018",
      gpa: "4.00",
    },
    {
      institution: "St. Gregory's High School and College",
      location: "Dhaka, Bangladesh",
      degree: "Secondary School Certificate",
      date: "2006 - 2016",
      gpa: "5.00",
    },
  ],
  experience: [
    {
      company: "JB Connect Ltd.",
      location: "Banani, Dhaka, Bangladesh",
      role: "Software Engineer",
      date: "Oct 2024 - Present",
      promotions: [],
      projects: [
        {
          name: "BridgeBooks System",
          description:
            "AI-driven SEO platform for article generation, backlinks, and contact automation.",
          highlight: "cut generation costs by 95%",
          achievements: [
            "Built the AI article generation module from scratch with two teammates over eight weeks.",
            "Moved generation from AWS Lambda to containers, cutting failure rates to 5% in three weeks.",
            "Reworked model API usage to cut generation costs by 95%.",
            "Tuned SQL queries to reduce page load times by 70%.",
            "Built a keyword system that supplies real-time SEO keywords through layered filtering.",
            "Implemented credit-based billing with usage tracking across platform services.",
            "Rebuilt CSV import and export queue jobs on file storage with automatic cleanup to reduce server memory use.",
            "Built a backlink system that gathers links from third-party services, monitors email replies, and handles inbound responses with AWS Route 53.",
          ],
        },
      ],
    },
    {
      company: "technoPLUS IT",
      location: "Adelaide, South Australia (Remote)",
      role: "Full Stack Web Developer",
      date: "Sep 2024 - Mar 2025",
      promotions: [],
      projects: [
        {
          name: "eduKET LMS",
          description:
            "Platform for course administration and learning material management.",
          highlight: "without breaking either",
          achievements: [
            "Built course and class assignment modules with instructor availability validation.",
            "Added instructor material upload with student-facing access.",
            "Changed database tables to support legacy and new features without breaking either.",
          ],
        },
      ],
    },
    {
      company: "Kandari Technologies",
      location: "Mirpur, Dhaka, Bangladesh",
      role: "Software Engineer",
      date: "Mar 2023 - Sep 2024",
      promotions: [
        {
          role: "Trainee Web Developer",
          date: "Apr 2022 - Mar 2023",
        },
      ],
      projects: [
        {
          name: "Maison Ensemble",
          description:
            "French language learning platform with interactive study tools.",
          highlight: "12 interactive exercises",
          achievements: [
            "Built 12 interactive exercises and games for Dutch to French vocabulary and memory practice.",
            "Integrated video lessons with embedded quizzes.",
            "Built a progress and achievement system for exercises.",
          ],
        },
        {
          name: "Augmenta Education",
          description:
            "School management platform for student records, scheduling, and payments.",
          highlight: "automatic credit deduction",
          achievements: [
            "Designed student ID cards with generated barcodes for identification.",
            "Built schedule-based class assignment aligned with instructor availability.",
            "Added payment slip issuance tied to student IDs with automatic credit deduction.",
            "Extended the class routine module with PDF generation and download.",
          ],
        },
        {
          name: "KIMS",
          description: "Inventory management system for retail operations.",
          highlight: "core inventory flows",
          achievements: [
            "Built core inventory flows for products, categories, brands, units, suppliers, purchases, orders, customers, and sales.",
          ],
        },
      ],
    },
  ],
  publications: [
    {
      title:
        "SweetCoat-2D: Two-Dimensional Bangla Spelling Correction and Suggestion Using Levenshtein Edit Distance and String Matching Algorithm",
      publisher: "IEEE",
      date: "Aug 2023",
      link: "https://ieeexplore.ieee.org/abstract/document/10191392",
    },
    {
      title:
        "An Efficient Text Preprocessing and Classification Technique for Multilingual and Transliterated Data",
      publisher: "IEEE",
      date: "Mar 2023",
      link: "https://ieeexplore.ieee.org/abstract/document/10054834",
    },
  ],
  awards: [
    {
      title: "Dean's List",
      description: "Named to the Dean's List in multiple semesters at BRAC University.",
    },
    {
      title: "Presentation Award",
      description:
        "Completed the English Presentation Skills course and received the certificate.",
    },
    {
      title: "Runner Up Trophy",
      description: "Runner up at the Inter School Science Fair and Cultural Festival.",
    },
    {
      title: "Attendance Record",
      description: "Perfect attendance through high school.",
    },
  ],
  skills: {
    languagesAndFrameworks: [
      "JavaScript",
      "React",
      "Next.js",
      "PHP",
      "Laravel",
      "Node.js",
      "Python",
    ],
    databasesAndStorage: ["SQL", "Redis"],
    cloudAndPlatforms: [
      "AWS Lambda",
      "Route 53",
      "S3",
      "ECS / Fargate",
      "EC2",
      "CloudFront",
      "SES",
      "SQS",
      "Vercel",
      "Docker",
    ],
    methodologies: ["Agile", "Scrum"],
  },
};
