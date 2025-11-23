import prisma from "@/app/lib/prisma";
import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { authConfig } from "./auth.config";



async function getUser(email: string) {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    return user;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}

export const { auth, signIn, signOut, handlers: { GET, POST } } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          
          // Check if any user exists
          const userCount = await prisma.user.count();
          
          if (userCount === 0) {
            // Setup Mode: Create the first user as Admin
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await prisma.user.create({
              data: {
                email,
                password: hashedPassword,
                name: "Admin",
              },
            });

            // Seed initial post if not exists
            const postCount = await prisma.post.count();
            if (postCount === 0) {
              await prisma.post.create({
                data: {
                  title: "Complete Guide to DIY MEO (Map Engine Optimization)",
                  slug: "diy-meo-guide",
                  description: "Learn how to rank your local business on Google Maps without spending a fortune. A comprehensive guide to Google Business Profile optimization.",
                  content: `
# Complete Guide to DIY MEO: How to Achieve Top Rankings and Specific Steps

"I want to start MEO (Map Engine Optimization) myself, but I don't know where to start" or "Is it really cost-effective?" If you are worried about this, you are not alone. In fact, by following the correct procedures such as registering for a Google Business Profile, managing reviews, and setting region-specific keywords, it is possible to significantly increase store traffic without relying on specialized agencies.

> According to a 2023 survey, the visit rate via Google Maps reached about 52% of the total, and the click-through rate of stores displayed in the top 3 accounts for about 70% of the total.

This figure tells how valuable it is to practice MEO measures yourself. Moreover, the biggest attraction is that registration and operation itself can be started for free, and if you thoroughly disseminate continuous information and respond to reviews, you can aim to increase customer attraction without spending advertising costs.

If you feel that "if you leave it alone, customers may be taken away by neighboring competitors...", now is the time to take a step forward. In this article, we will thoroughly explain specific procedures that even beginners will not fail, examples of actual results, and the reality of costs. Learn how your store can become the chosen one on Google Maps.

## Basic Knowledge and Importance Before Starting MEO Yourself

### What is MEO? Google Business Profile and Local Search Mechanism
MEO (Map Engine Optimization) is a customer attraction measure that displays stores and business offices at the top of map searches such as Google Maps to lead to visits and inquiries. By registering accurate information in your Google Business Profile, your company will stand out on the map when searching by region name or industry name. The display order of map search is determined by multiple factors such as store relevance, distance, evaluation, and fullness of the latest information. Profile settings, review responses, photo posting, keyword optimization, etc. are important. Let's keep the following terms and mechanisms in mind.

| Term | Description |
| :--- | :--- |
| **Google Business Profile** | Free store/office information management tool provided by Google |
| **MEO** | Map Engine Optimization. Measures aiming for top display on Google Maps etc. |
| **Reviews** | Reviews from users. Ratings and replies affect search rankings and reliability |
| **Keywords** | Setting words that are easy to search, such as region names and service/industry names, is the key to top display |

### Why Should You Do MEO Yourself? Merits and Market Trends
The biggest advantage of doing MEO measures yourself is that you can **obtain customer attraction effects efficiently while keeping costs down**. Google Business Profile can be used for free, and since you can operate it yourself without outsourcing costs, it is also ideal for small businesses and individual stores. In recent years, "near me" searches from smartphones have increased rapidly, and the importance of MEO measures is increasing. There are merits such as:

*   **Improvement of customer attraction power:** It becomes easier to catch the eye of users searching in the area, leading to an increase in visits and inquiries.
*   **Reliability UP:** You can appeal the charm and sense of security of the actual store through reviews and photo posts.
*   **Continuous operation is possible:** You can update information and manage reviews yourself, aiming for long-term effects.
*   **Advertising cost reduction:** Cost-effectiveness is high because you can start for free without using paid advertisements.

#### Difference from Other Measures (SEO, SNS) and Role of MEO
There are SEO, SNS, MEO, etc. in customer attraction measures, but each has different roles and strengths.

| Measure | Main Features | Strength | Cooperation Point |
| :--- | :--- | :--- | :--- |
| **MEO** | Top display in region/map search | Strong for local customers and nearby users | Keywords, review management |
| **SEO** | Top display of Web site search results | Strong for wide area/specialized information search | Information matching between site and profile |
| **SNS** | Information diffusion, fan creation, branding | Relationship building with young people/existing customers | Link post contents |

MEO specializes in community-based customer attraction, and by operating in combination with SEO and SNS, you can maximize the awareness and visit rate of stores and services. Understand the characteristics of each measure and use them properly according to the purpose.

## Specific Procedures and Practice Points for DIY MEO

### Google Business Profile Registration and Owner Verification
Registering a Google Business Profile is the first step in MEO. Enter business information from the official website and set accurate store name, address, phone number, and business hours. After registration, owner verification is required. In many cases, a verification code by postcard is mailed, so be careful not to mistake the mailing address information. In the verification procedure, registration is completed by entering the received code on the screen. Registration contents can be modified later, but keeping accurate information is the point of top display.

> **Registration Procedure Points:**
> *   Enter business information from the official website
> *   Check mailing address in case of postcard verification
> *   Enrich profile immediately after entering verification code

### Basics of Keyword Setting and Tips for Regional Specialization
Effective keyword setting is directly linked to search ranking improvement. Keywords combining the store's industry and region name (e.g., "Shibuya Hair Salon") are basic. Utilize free tools such as Google Keyword Planner and Rakko Keywords to investigate search volume and related words. By including the set keywords in the business profile description, posts, and photo descriptions, relevance is strengthened.

### How to Get Reviews and Reply Manners
Reviews are the core of MEO measures. You can increase natural reviews by politely asking visiting customers. Let's devise ways such as handing out review request cards at the store or via email. Be sure to reply to reviews with gratitude, and keep calm and fact-based responses to malicious content. Content that violates operation guidelines can be reported to Google.

### Effective Use of Photos and Videos
Using photos and videos that convey the atmosphere of the store or service greatly increases the user's desire to visit. Shoot inside and outside the store during bright hours and post images that convey cleanliness and liveliness. By regularly adding new photos and videos, you can also appeal the freshness of information. Video posting is effective if it has movement and story nature such as service introduction and staff introduction.

## Secrets of Content and Post Utilization in MEO

### Types of Regular Posts and How to Choose Content
By utilizing the post function in the store's Google Business Profile, you can effectively disseminate the charm of services and events. Daily information dissemination leads to search ranking improvement and customer attraction. Examples of posts include:

| Post Type | Specific Content Example | Merit for User |
| :--- | :--- | :--- |
| **Campaign** | Limited time discount, new opening privilege | Get great deals quickly |
| **Event** | Announcement of experience session, seasonal event | Guide participation opportunities and special experiences |
| **Product Introduction** | New product arrival, features and usage of popular products | Convey product charm and how to choose |
| **Notice** | Business hours change, temporary closure, hygiene measures, etc. | Information that enhances reliability and peace of mind |

### Points to Improve Content Quality
Content quality is directly linked to Google evaluation and user satisfaction. **It is most important to convey the information users want to know clearly and concretely.**

*   Clearly introduce **store's unique strengths** and expertise
*   Appeal practicality by mixing **usage scenes and examples**
*   Answer frequently asked questions politely in **FAQ format**
*   Actively perform **acquisition and reply of reviews** to improve reliability
*   Choose high-quality and bright composition for **photos and videos**

## Measurement of Effect and Practice of Improvement Cycle

To maximize the effect of MEO measures, clear goal setting and practice of the PDCA cycle are indispensable. By setting specific KPIs (Key Performance Indicators), you can objectively evaluate the progress and results of measures.

> **Representative KPIs in MEO:**
> *   **Impressions:** Number of displays in search results and on maps
> *   **Clicks:** Website visits, phone calls, route searches
> *   **Reviews:** Number of posts and average rating
> *   **Photo/Post Views:** Changes with each new addition

## FAQ

#### How much does it cost and how much effort does it take to do MEO yourself?
If you do MEO yourself, you can basically start for free. Registration to Google Business Profile, information update, review management, etc. can be carried out without spending money. However, continuous operation requires a certain amount of time and effort. The key to efficiency is to make it a habit to check and respond regularly once or twice a week.

#### What is the difference between SEO and MEO?
SEO is a measure to display a website at the top of search engines, targeting search result pages and owned media. On the other hand, MEO is a measure to raise the display order of stores and services on Google Maps and local search.

#### How to effectively increase reviews when there are few?
To increase reviews, it is effective to ask existing customers directly first. We recommend methods such as guiding at the store, handing out message cards or QR codes after service, and encouraging review posts on regular SNS and blogs.

## Reason to Start Now and Specific Action Plan
In order to increase the customer attraction power of local businesses, it is important to do MEO measures yourself. Top display on Google Maps leads to improvement of reliability and increase in visits and inquiries to stores. Even without specialized knowledge, you can obtain steady effects by holding down some basic work.

Success points are optimization of Google Business Profile, keyword strategy, and continuous implementation of review management. Let's aim for efficient MEO operation by holding down the checklist and improvement points.
                  `,
                  readTime: "10 min read",
                  tags: ["SEO", "MEO", "Google Maps", "Marketing"],
                  published: true,
                  date: new Date("2025-11-23"),
                },
              });
            }

            return newUser;
          }

          const user = await getUser(email);
          if (!user) return null;
          
          if (!user.password) return null;

          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (passwordsMatch) return user;
        }

        console.log("Invalid credentials");
        return null;
      },
    }),
  ],
});
