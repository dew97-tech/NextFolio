import type { CaseStudy } from "@/data/case-study";

export const augmentaCaseStudy = {
  href: "/work/augmenta",
  title: "Augmenta Education",
  summary: "Classroom management system for student records, scheduling, and payments.",
  company: "Kandari Technologies",
  role: "Software Engineer",
  date: "Mar 2023 - Sep 2024",
  collaboration:
    "Built the identification, scheduling, and payment modules for a classroom management system.",
  description:
    "How I built identification, scheduling, and payment modules for a classroom management system.",
  ogDescription:
    "Identification, scheduling, and payment modules for a classroom management system.",
  results: [
    {
      value: "4",
      label: "modules delivered",
      detail:
        "Barcode ID cards, schedule-based class assignment, fee slips with credit deduction, and PDF class routines.",
    },
  ],
  sections: [
    {
      title: "What shipped",
    },
    {
      title: "Identification and scheduling",
      workstreams: [
        {
          title: "Identification",
          items: [
            "Designed the student ID card UI and generated cards from live platform data, printing barcodes for identification.",
          ],
        },
        {
          title: "Scheduling",
          items: [
            "Built schedule-based class assignment with dynamic conflict checks, so overlapping classes are caught when students enroll from a routine.",
          ],
        },
      ],
    },
    {
      title: "Payments and records",
      workstreams: [
        {
          title: "Fee collection",
          items: [
            "Added payment slip issuance tied to student IDs with automatic credit deduction.",
          ],
        },
        {
          title: "Class routine",
          items: [
            "Extended the class routine module with PDF generation and download.",
          ],
        },
      ],
    },
  ],
} satisfies CaseStudy;
