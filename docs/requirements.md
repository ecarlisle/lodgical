# Requirements

This exercise is designed to give you an opportunity to demonstrate:

1. How you think about building products
2. Not just writing code

We're interested in seeing:

1. Your engineering decisions at work
2. The tradeoffs you made
3. Your product-forward thinking

We recommend spending 4–6 hours on the assessment. Please treat this as a firm timebox. When you reach it, stop where you are. We're not expecting a finished product. However, within this time frame we want to see your best work:

1. Thoughtful architecture
2. Clean code
3. Reasoning we can follow

If there are features you didn't get to or decisions you would revisit, document them in your [README](../readme.MD); a clear, well-reasoned account of what's left is a meaningful part of your submission.

## The Assessment

You'll build a small travel booking application inspired by products like Booking.com using React (TypeScript recommended).

Your application should allow users to:

1. Search or browse available stays
2. View stay details
3. View and add reviews/comments
4. Display pricing and availability

Complete a checkout flow that results in a confirmed booking (payment can be mocked). Your frontend should communicate with a small backend API that you provide. The backend can be minimal and use mocked data if you'd like.

## What we're looking for

We're evaluating areas such as:

1. Product thinking and scope management
2. Frontend architecture and code quality
3. API design and integration
4. User experience
5. Testing and maintainability
6. Communication around tradeoffs and decisions

We're not looking for pixel-perfect UI. **Thoughtful decisions**, **clear code**, and **smart prioritization** matter far more.

### Technical Expectations

Please include:

1. Responsive design
2. Loading, empty, and error states
3. Basic accessibility considerations
4. A few meaningful tests
5. A simple CI pipeline (for example GitHub Actions running linting and tests)
6. A production build process

Optional, but always appreciated:

1. Deployment to Vercel, Netlify, Render, etc.
2. Basic observability or logging

## What to Submit

Please send us:

1. A Git repository containing both the frontend and backend
1. A README covering:
   a. Setup instructions
   b. Available scripts
   c. Architecture decisions
   d. Tradeoffs
   e. What you'd build next with additional time
   f. A short note describing how you used AI/LLMs during the project, including your general approach and any guardrails you used
   g. A short screen recording (5–10 minutes is plenty) walking us through your solution, key decisions, and anything you'd like us to know while reviewing

## Assessment Brief

### Frontend Technical Assessment – Travel Booking (React)

### Quick Facts

1. Domain: Travel (hotels or similar stay products)
2. Stack: React (TypeScript recommended)
3. Includes a small backend API
4. LLM usage is encouraged
5. Suggested timebox: 4–6 hours

### Minimum API Examples

1. `GET /stays`
1. `GET /stays/`
1. `GET /stays/reviews`
1. `POST /stays/reviews`
1. `POST /bookings`

Feel free to adjust the API design if you think another approach makes more sense.

One final note: creativity is encouraged. Feel free to make the product your own—whether that's through the user experience, feature choices, or how you model the booking flow. If you make assumptions or intentionally simplify parts of the problem, just tell us why.
