# Implementation Plan - Professional Reviews & Admin Replies

This plan details the design and implementation of a professional "Student & Parent Reviews" system for the Adamjee Coaching Maymar website. The feature will allow visitors to submit reviews with star ratings, enable the admin to moderate (approve/reject/delete) reviews, and allow the admin to post replies.

---

## User Review Required

> [!NOTE]
> * Reviews will be stored in a new Firestore collection called `reviews`.
> * By default, newly submitted reviews will have a status of `'Pending'` to ensure moderation and prevent spam. Only `'Approved'` reviews will be displayed on the public home page.
> * Admin replies will be displayed inline underneath the respective review on the public home page.

---

## Proposed Changes

### 1. Database & Security Rules

#### [MODIFY] [firestore.rules](file:///d:/Adamjeeproject/AdamjeeWebsite/firestore.rules)
* Add a match rule for `/reviews/{reviewId}` that allows anyone to `read` and `create` reviews.
* Allow `update` and `delete` access (which the admin panel uses for replies and moderation).

### 2. Public API Client

#### [MODIFY] [cms-client.js](file:///d:/Adamjeeproject/AdamjeeWebsite/cms-client.js)
* Implement `window.fetchApprovedReviews()` to retrieve all reviews with `status == 'Approved'` sorted by date.
* Implement `window.submitReview(formData)` to write a new review document into Firestore with fields:
  * `id`: `Rev-${Date.now()}`
  * `reviewerName`: string
  * `rating`: number (1-5)
  * `comment`: string
  * `status`: `'Pending'`
  * `createdAt`: ISO Date String

### 3. Homepage UI

#### [MODIFY] [index.html](file:///d:/Adamjeeproject/AdamjeeWebsite/index.html)
* Add a professional **"Reviews & Testimonials"** section right above the location map section.
* Inside this section, render:
  * A list of approved reviews with name, date, rating (represented as active gold stars), review comment, and an admin reply sub-card if a reply exists.
  * A "Write a Review" button that triggers a dialog modal.
* Implement the "Write a Review" modal:
  * Text inputs for reviewer's name.
  * An interactive star-rating selector (clicking on stars sets the rating value).
  * Textarea for the comment.
  * Submit button with loading state.

### 4. Admin API Client

#### [MODIFY] [admin/js/api.js](file:///d:/Adamjeeproject/AdamjeeWebsite/admin/js/api.js)
* Implement `window.fetchAdminReviews()` to retrieve all reviews.
* Implement `window.approveReview(id)` to update the status of a review to `'Approved'`.
* Implement `window.replyToReview(id, replyText)` to add `reply` and `repliedAt` fields and automatically set status to `'Approved'`.
* Implement `window.deleteReview(id)` to remove a review.

### 5. Admin Dashboard Sidebar & Mobile Menu

#### [MODIFY] [admin/mobile-menu.js](file:///d:/Adamjeeproject/AdamjeeWebsite/admin/mobile-menu.js)
* Add `['Reviews', 'reviews.html']` to the mobile menu navigation array.

#### [MODIFY] [admin/index.html](file:///d:/Adamjeeproject/AdamjeeWebsite/admin/index.html)
#### [MODIFY] [admin/admissions.html](file:///d:/Adamjeeproject/AdamjeeWebsite/admin/admissions.html)
#### [MODIFY] [admin/faculty.html](file:///d:/Adamjeeproject/AdamjeeWebsite/admin/faculty.html)
#### [MODIFY] [admin/timetable.html](file:///d:/Adamjeeproject/AdamjeeWebsite/admin/timetable.html)
#### [MODIFY] [admin/student-applications.html](file:///d:/Adamjeeproject/AdamjeeWebsite/admin/student-applications.html)
#### [MODIFY] [admin/settings.html](file:///d:/Adamjeeproject/AdamjeeWebsite/admin/settings.html)
* Insert the "Reviews" tab link inside the static sidebar `<nav>` list:
  ```html
  <a href="reviews.html" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/70 hover:bg-white/5 hover:text-white font-medium transition-colors">
      <i class="ri-star-line text-lg"></i> Reviews
  </a>
  ```

### 6. Admin Reviews Page

#### [NEW] [reviews.html](file:///d:/Adamjeeproject/AdamjeeWebsite/admin/reviews.html)
* Create a dedicated reviews moderation dashboard.
* It will render:
  * Statistics: Total Reviews, Pending Review, Approved Reviews, Average Rating.
  * A table or list of reviews showing: Reviewer name, star rating, comment, submitted date, status badge.
  * Actions for each review:
    * **Approve**: Only shown if status is pending.
    * **Reply / Edit Reply**: Opens an inline or modal input field.
    * **Delete**: Removes the review immediately.

### 7. Backend Server Offline Support (Express & JSON)

#### [MODIFY] [backend/server.js](file:///d:/Adamjeeproject/AdamjeeWebsite/backend/server.js)
* Implement `/api/reviews` endpoints:
  * `GET /api/reviews` (returns approved reviews)
  * `GET /api/reviews/admin` (returns all reviews)
  * `POST /api/reviews` (adds pending review)
  * `POST /api/reviews/:id/approve` (approves review)
  * `POST /api/reviews/:id/reply` (adds reply)
  * `DELETE /api/reviews/:id` (deletes review)

#### [MODIFY] [backend/data.json](file:///d:/Adamjeeproject/AdamjeeWebsite/backend/data.json)
* Add a `"reviews": []` array to initialize local storage.

---

## Verification Plan

### Automated / Integration Checks
* Start the local server (`npm start`) and submit a review from the homepage.
* Verify the review appears in Firestore (or `data.json` offline) with `Pending` status.
* Check the Admin Panel to approve and reply to the review.
* Confirm that the review and reply are displayed publicly on the home page.

### Manual Verification
* Inspect styling, alignment, and interactive star behaviors on desktop and mobile sizes.
