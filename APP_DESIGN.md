# UI Design Prompts - Tailoring Management Platform

## 🎨 Universal Design System & Principles

**Brand Identity:**
- Platform Name: StyleHub (or your preferred name)
- Industry: Fashion/Tailoring Management
- Target Audience: African market (Nigeria, Ghana, Kenya, etc.)
- Tone: Professional yet approachable, modern yet respectful of traditional craftsmanship

**Color Palette:**
- Primary: Deep charcoal black (#1a1a1a) - Authority, craftsmanship
- Secondary: Rich gold/amber (#D4A574) - Premium, African heritage
- Accent 1: Vibrant coral (#FF6B6B) - Energy, creativity
- Accent 2: Deep teal (#2C7A7B) - Trust, reliability
- Neutrals: Warm grays (#F7F7F5, #E5E5E0, #8B8B88)
- Success: Emerald green (#10B981)
- Warning: Golden yellow (#F59E0B)
- Error: Warm red (#EF4444)
- Info: Ocean blue (#3B82F6)

**Typography:**
- Headings: Inter Bold/Semibold (modern, clean)
- Body: Inter Regular (readable, professional)
- Accent/Display: Playfair Display (elegance, craftsmanship)
- Code/Numbers: JetBrains Mono (technical elements)

**Design Principles:**
- **Craftsmanship First**: Celebrate the artistry of tailoring through high-quality imagery
- **Clear Hierarchy**: Users should instantly know what's important
- **Trust & Transparency**: Progress tracking and communication are prominent
- **Mobile-First**: African users primarily access via mobile
- **Fast & Lightweight**: Optimize for varying internet speeds
- **Cultural Relevance**: Use imagery and patterns that resonate with African fashion
- **Accessibility**: WCAG 2.1 AA compliance minimum

**UI Patterns:**
- 8px grid system for consistent spacing
- Rounded corners: 8px (buttons, cards), 12px (larger containers)
- Shadows: Subtle, warm shadows (not harsh black shadows)
- Animations: Smooth, purposeful (300ms standard transitions)
- Cards: Elevated with subtle borders and shadows
- Buttons: Clear primary vs secondary hierarchy
- Icons: Lucide icon set for consistency
- Images: High-quality, cropped consistently, with lazy loading

**Responsive Breakpoints:**
- Mobile: 375px - 767px
- Tablet: 768px - 1023px
- Desktop: 1024px+
- Large Desktop: 1440px+

---

## 1. Global Showcase (Home Page)

**Page Purpose:** Discovery platform where customers browse styles from all organizations - the Pinterest of African fashion.

**Layout Structure:**
- Sticky top navigation bar (60px height)
- Hero search bar with filters (prominent, centered)
- Filter chips row (horizontally scrollable on mobile)
- Masonry grid layout (3 columns desktop, 2 tablet, 1 mobile)
- Infinite scroll with skeleton loaders

**Key Elements:**

*Navigation Bar:*
- Left: Logo + "StyleHub" wordmark
- Center: Condensed search bar (expands on focus)
- Right: Notifications bell (badge for unread), Profile avatar dropdown
- Background: Semi-transparent white with backdrop blur
- Shadow on scroll for depth

*Hero Section:*
- Large search input with icon (placeholder: "Search styles, organizations, designers...")
- Filter button with count badge when active
- Trending searches below (chips with search icon)
- Subtle gradient background (cream to white)

*Style Cards:*
- Image: High-quality, natural aspect ratio (no cropping faces/designs)
- Hover effect: Subtle scale (1.02x) + shadow increase
- Quick actions overlay (on hover): Heart (save), Share, Quick view
- Organization logo badge (bottom-left corner, circular, 40px)
- Title: Bold, 16px, 2 lines max with ellipsis
- Organization name: 14px, gray, with verified badge if applicable
- Price: Bold, prominent, with currency symbol
- Tags: Up to 3 chips below (category, style type)
- Engagement metrics: Small icons for views, likes (subtle, not distracting)

*Filter Panel (Slide-out):*
- Smooth slide from right (mobile) or left (desktop)
- Sections: Category, Price Range, Organization, Location, Style Type
- Each section collapsible with chevron
- Multi-select checkboxes with counts
- Price range: Dual-handle slider with input fields
- Apply button (sticky bottom): Primary color, full width
- Clear filters link (top-right)

**Interactions:**
- Smooth scroll with momentum
- Skeleton cards while loading (pulse animation)
- "Load more" triggered 2 screens before end
- Click card → Navigate to style detail
- Click org badge → Navigate to org showcase
- Heart icon → Save (with micro-animation)
- Share → Native share sheet (mobile) or copy link (desktop)

**Empty States:**
- No results: Friendly illustration + suggestions
- No saved items: Illustration encouraging exploration

**Design Notes:**
- Warm, inviting color scheme with cream backgrounds
- High-quality fashion photography is hero
- Subtle African-inspired patterns in backgrounds (very subtle, not overwhelming)
- Fast image loading with blur-up technique

---

## 2. Organization Showcase Page

**Page Purpose:** Individual tailor's digital storefront - their brand identity and portfolio.

**Layout Structure:**
- Full-width hero banner (200px height, parallax scroll effect)
- Organization header card (overlaps banner by 60px)
- Horizontal tab navigation (sticky below header)
- Grid layout for designs (4 columns desktop, 3 tablet, 2 mobile)

**Key Elements:**

*Hero Banner:*
- Cover image: Organization's signature work or brand aesthetic
- Subtle dark overlay for text readability
- Parallax scroll effect (subtle)

*Organization Header Card:*
- Elevated white card with shadow
- Left: Logo (120px circular, with border)
- Center: Organization info
  - Name: Large, bold (28px)
  - Tagline/Bio: 2-3 lines, 16px
  - Metadata row: Location icon + address, Phone icon + number, Star rating + review count
  - Badges: Verified, Premium member, Years in business
- Right: Primary CTA button ("Contact Us") + Secondary ("Follow")
- Stats row below: Total Designs, Completed Orders, Average Rating, Response Time

*Navigation Tabs:*
- Horizontal scroll on mobile
- Options: All Designs, Men's Wear, Women's Wear, Kids, Accessories, Reviews, About
- Active tab: Underline with primary color, bold text
- Smooth scroll to top when switching tabs

*Design Grid:*
- Similar to global showcase but focused on this organization
- Hover shows "Quick Order" button overlay
- No organization badge (redundant on org page)
- Sorting options: Newest, Popular, Price: Low to High, Price: High to Low

*About Section:*
- Two-column layout (desktop)
- Left: Story, specializations, certifications
- Right: Team photos, awards, featured in media
- Timeline of achievements
- Workshop/studio photos gallery

*Reviews Section:*
- Star rating distribution chart
- Individual review cards with:
  - Customer avatar (or initial)
  - Rating stars
  - Review text (expandable if long)
  - Order images (if customer uploaded)
  - Date and verified purchase badge
  - Helpful votes

*Floating Action:*
- Sticky bottom bar (mobile) or floating button (desktop)
- Quick actions: Message, Call, WhatsApp
- Always accessible while browsing

**Interactions:**
- Follow button: Toggles with heart animation
- Contact: Opens chat interface or contact modal
- Share organization: Social share options
- Image galleries: Lightbox view with swipe

**Design Notes:**
- Organization's brand colors can subtly influence accent colors
- Professional but warm aesthetic
- Trust indicators prominent (reviews, badges, response time)
- Clear path to action (contact, order)

---

## 3. Style Detail Page

**Page Purpose:** Product page where customers view full details and place orders.

**Layout Structure:**
- Two-column layout (desktop: 50/50 split, mobile: stacked)
- Left: Image gallery
- Right: Details, measurements form, pricing, CTA
- Below: Similar styles, reviews, organization info

**Key Elements:**

*Image Gallery (Left Column):*
- Main image: Large (600px+ height), zoomable on click
- Thumbnail strip below: Horizontal scroll, 5-6 visible
- Lightbox view: Full-screen gallery with swipe navigation
- Video support: Play icon overlay if video available
- 360° view badge if available
- Zoom: Click or hover (desktop) shows detailed view

*Details Section (Right Column):*
- Style name: Large heading (32px), bold
- Organization: Logo + name (clickable to org page)
- Price section:
  - Base price: Large, bold (28px)
  - "Starting from" label if customizable
  - Strike-through original price if on sale
  - Price breakdown: Expandable accordion (Base + Customization + Delivery)
- Rating: Stars + review count (linked to reviews section)
- Short description: 2-3 sentences, key features
- Category tags: Clickable chips
- Save/Share: Icon buttons (top-right)

*Measurements Form:*
- Card with subtle background
- Heading: "Enter Your Measurements"
- Unit toggle: CM / Inches (radio buttons)
- Input fields:
  - Common measurements with tooltips (info icon)
  - Each field: Label, input, unit display
  - Validation: Real-time (green checkmark when valid)
- "Measurement Guide" link: Opens modal with visual guide
- "Save Profile" checkbox (for returning customers)

*Customization Options:*
- Fabric selector: Visual swatches with names
- Color selector: Color circles (indicate available colors)
- Style variations: Collar type, sleeve length, etc.
- Each selection updates price in real-time

*Additional Notes:*
- Textarea: "Special requests or modifications"
- Character count (500 char max)
- Placeholder with helpful examples

*Pricing Summary Card:*
- Sticky on scroll (desktop right column)
- Line items:
  - Base Price
  - Customization Fee (if any)
  - Delivery Fee
  - Total (large, bold)
- Delivery estimate: Calendar icon + date range
- Primary CTA: "Place Order" (full width, primary color)
- Secondary: "Chat with Manager" (outlined)

*Below Fold Sections:*
- Description & Details: Full rich text, collapsible sections
- Size Guide: Visual chart with measurements
- Reviews: Top 3-5 with "View All" link
- Similar Styles: Horizontal scrolling carousel
- Organization Info: Mini version with "Visit Store" CTA

**Interactions:**
- Measurement inputs: Auto-format, show tooltips on focus
- Customization: Visual feedback on selections
- Price updates: Smooth number animation
- Add to cart: Success animation with checkmark
- Chat button: Opens chat drawer from right
- Image zoom: Smooth zoom animation

**Mobile Specific:**
- Sticky bottom bar with price and CTA
- Measurements: One field per row for easy input
- Image gallery: Full-screen swipe from first view

**Design Notes:**
- Trust signals prominent: Secure payment badges, return policy, delivery guarantee
- Clear visual hierarchy guides to CTA
- High-quality images sell the craftsmanship
- Form should feel easy, not overwhelming

---

## 4. Customer Dashboard

**Page Purpose:** Customer's command center for orders, tracking, and account management.

**Layout Structure:**
- Sidebar navigation (left, collapsible on mobile)
- Main content area (3-column grid for stats, full-width for lists)
- Top header with greeting and notifications

**Key Elements:**

*Sidebar:*
- User profile section:
  - Avatar (editable on click)
  - Name and role badge
  - "Edit Profile" link
- Navigation menu:
  - Dashboard (home icon)
  - My Orders (package icon) + count badge
  - Saved Styles (heart icon) + count
  - Messages (chat icon) + unread badge
  - Settings (gear icon)
- Logout button (bottom)
- Organization: Clean, icons with labels, active state highlighted

*Header:*
- Greeting: "Welcome back, [Name]" (personalized)
- Date: Current date with icon
- Notification bell: Badge for unread
- Quick actions: New order, Contact support

*Stats Cards (4 across):*
- Card design:
  - Icon (large, colored background circle)
  - Value (large number, bold)
  - Label (descriptive)
  - Trend indicator (if applicable): Small percentage with up/down arrow
- Metrics:
  - Active Orders
  - Completed Orders
  - Total Spent (formatted currency)
  - Saved Styles
- Color-coded icons match status (blue for active, green for completed, etc.)

*Orders List:*
- Section header: "Recent Orders" + "View All" link
- Order cards (full-width):
  - Horizontal layout:
    - Left: Thumbnail (100px square)
    - Center: Order details
      - Order number (monospace font, clickable)
      - Organization name (with logo icon)
      - Date placed
      - Current status badge (color-coded)
      - Progress bar (if in progress)
      - ETA date
    - Right: Actions
      - Price (bold)
      - "Track Order" button (primary)
      - "Message" button (secondary)
      - "..." menu (Reorder, Cancel, etc.)
- Empty state: Friendly illustration + "Start Shopping" CTA

*Saved Styles Section:*
- Grid of style cards (similar to showcase)
- Hover: "Order Now" overlay
- Remove heart icon (to unsave)

*Quick Actions Panel:*
- Floating suggestions based on activity:
  - "Complete your profile for better recommendations"
  - "Rate your recent order"
  - "Refer a friend, get ₦5,000 credit"

**Interactions:**
- Click order card: Navigate to detailed tracking page
- Status badge: Tooltip explaining current stage
- Message button: Opens chat drawer
- Track button: Smooth transition to tracking view

**Mobile Specific:**
- Bottom navigation bar replaces sidebar
- Stats: 2x2 grid instead of 4 across
- Order cards: Vertical layout, thumbnail on top

**Design Notes:**
- Personalized, welcoming feel
- Quick access to most common actions
- Visual status indicators reduce cognitive load
- Celebratory micro-animations for completed orders

---

## 5. Manager Dashboard

**Page Purpose:** Operations control center for order management and team coordination.

**Layout Structure:**
- Dense information layout optimized for efficiency
- Top: KPI metrics (5 across)
- Main: Orders table (filterable, sortable)
- Right sidebar: Quick actions and recent activity

**Key Elements:**

*KPI Cards (5 across):*
- Compact, data-focused design
- Large number (primary metric)
- Label below
- Small trend indicator
- Color-coded based on urgency:
  - New Orders: Yellow background
  - In Progress: Blue background
  - Completed: Green background
  - Pending Payment: Red background
  - Revenue: Purple gradient background
- Click to filter main view

*Filters & Actions Bar:*
- Left: View toggles (All, Pending, Assigned, Completed)
- Center: Search orders (by ID, customer name)
- Right: Filter dropdown, Sort dropdown, Date range picker
- "New Order" button (if manual entry allowed)

*Orders Table:*
- Responsive table with horizontal scroll on mobile
- Columns:
  - Checkbox (bulk selection)
  - Order ID (monospace, copyable on click)
  - Customer (name + avatar)
  - Style (thumbnail + name)
  - Status (badge)
  - Worker (avatar or "Unassigned")
  - Amount (bold)
  - Actions (icon buttons)
- Row interactions:
  - Click row: Expand inline details
  - Hover: Highlight row
  - Status badge: Click to update
  - Worker column: Click to reassign
- Bulk actions bar (appears on selection):
  - Assign worker
  - Update status
  - Export selected
  - Send message

*Order Quick View (Inline Expansion):*
- Measurements summary
- Customer notes
- Progress timeline (horizontal)
- Quick assign worker dropdown
- Update status buttons
- Chat with customer button

*Right Sidebar:*
- Quick Assign section:
  - Unassigned orders count
  - List of available workers with workload
  - Drag-drop to assign
- Recent Activity Feed:
  - Timeline of events
  - Icons for different event types
  - Real-time updates

*Worker Management Panel (Separate View):*
- Grid of worker cards
- Each card:
  - Avatar and name
  - Current workload (pie chart)
  - Active tasks count
  - Efficiency rating
  - "View Tasks" and "Message" buttons

**Interactions:**
- Real-time updates: New orders pulse animation
- Assign worker: Dropdown or drag-drop
- Status update: Click badge, select new status, confirm
- Bulk actions: Multi-select with shift-click
- Search: Instant results, highlight matches
- Export: CSV/Excel download

**Mobile Specific:**
- Cards replace table on mobile
- Swipe actions on order cards (assign, message, view)
- Bottom sheet for quick actions

**Design Notes:**
- Efficiency over aesthetics - dense but organized
- Color coding for quick status recognition
- Keyboard shortcuts for power users (indicated on hover)
- Real-time updates without page refresh
- Clear hierarchy: urgent items stand out

---

## 6. Worker Dashboard

**Page Purpose:** Task management and portfolio showcase for production workers.

**Layout Structure:**
- Top: Performance metrics (4 cards)
- Main: Task list (kanban or list view toggle)
- Bottom: Portfolio gallery

**Key Elements:**

*Performance Cards:*
- Visual, encouraging design
- Icons representing achievement
- Metrics:
  - Assigned Tasks (clock icon)
  - In Progress (scissors/needle icon)
  - Completed This Month (checkmark icon)
  - Efficiency Score (chart icon, with percentage)
- Subtle animations on load (count-up effect)

*View Toggle:*
- Switch between List and Kanban views
- Icons for each view type
- Smooth transition animation

*Task List View:*
- Card-based layout
- Each task card:
  - Priority indicator (colored left border)
  - Thumbnail of style
  - Order ID (clickable)
  - Task type badge (Cutting, Sewing, Finishing)
  - Customer name
  - Assigned by (manager name)
  - Due date (with urgency color)
  - Progress indicator (Not Started, In Progress, Ready for Review)
  - Action buttons: "Start Task", "Update Progress", "Mark Complete"
  - Notes section (expandable)

*Kanban View:*
- Three columns: To Do, In Progress, Completed
- Drag and drop between columns
- Task cards (compact version)
- Column headers with counts

*Task Detail Modal:*
- Opens when clicking task
- Full order details
- Measurements
- Reference images
- Customer notes
- Progress update form:
  - Status dropdown
  - Photo upload (work in progress)
  - Notes textarea
  - Time tracking (hours spent)
- Chat with manager button

*Portfolio Section:*
- Heading: "My Portfolio" + "Add Work" button
- Masonry grid of completed works
- Each portfolio item:
  - High-quality image
  - Order reference
  - Completion date
  - Hover: "Edit" and "Delete" options
- Filter by: Date, Style Type, Task Type

*Add Portfolio Item Modal:*
- Upload images (multiple)
- Select related order (if applicable)
- Description textarea
- Tags for searchability
- Visibility toggle (public/private)

**Interactions:**
- Start task: Changes status, starts timer
- Update progress: Opens form, uploads photos
- Complete task: Confirmation, adds to portfolio automatically
- Drag-drop (kanban): Smooth animation, updates status
- Photo upload: Compress and preview before upload

**Mobile Specific:**
- Swipe between task statuses (kanban alternative)
- Quick action buttons (FAB for "Start Task")
- Camera integration for progress photos

**Design Notes:**
- Motivating, achievement-focused design
- Visual feedback for completed tasks (confetti animation)
- Easy progress updates (workers often have fabric-dusty hands)
- Portfolio showcases craftsmanship and builds pride
- Large touch targets for mobile use in workshop

---

## 7. Admin Dashboard

**Page Purpose:** Comprehensive control panel for organization management and analytics.

**Layout Structure:**
- Top: Key business metrics (5-6 cards)
- Main area: Grid layout with multiple panels
- Analytics charts
- Quick action widgets
- Recent activity feed

**Key Elements:**

*Metrics Overview (Top):*
- Premium card design with gradients
- Key metrics:
  - Total Revenue (current month) - Gradient background
  - Order Volume - Growth indicator
  - Active Workers - With capacity percentage
  - Customer Base - New vs returning
  - Average Order Value - Trend line
  - Customer Satisfaction - Star rating
- Click to drill down into detailed analytics

*Analytics Section:*
- Two-column layout
- Left: Revenue chart
  - Line chart with smooth curves
  - Toggle: Week, Month, Quarter, Year
  - Export button
- Right: Order distribution
  - Donut chart (status breakdown)
  - Legend with percentages
  - Animated on load

*Bottom Charts:*
- Worker performance chart (bar chart)
- Popular styles (horizontal bar chart)
- Revenue by category (pie chart)
- Traffic sources (if applicable)

*Quick Action Cards:*
- Grid of actionable widgets
- Each card:
  - Icon (large, colored)
  - Title
  - Brief description
  - Primary CTA button
- Actions:
  - Invite User (email invitation form)
  - Add New Style (upload form)
  - Manage Workers (navigate to team page)
  - Organization Settings (configure)
  - Export Reports (date range selector)
  - View Analytics (full screen)

*Recent Activity Feed:*
- Real-time updates
- Timeline design with icons
- Event types:
  - New orders
  - Completed orders
  - Payments received
  - New customers
  - Worker updates
- Timestamp for each event
- Click to view details

*Organization Settings Panel:*
- Tabbed interface:
  - General (name, logo, description)
  - Pricing (base prices, fees)
  - Team (invite, roles, permissions)
  - Notifications (configure alerts)
  - Integrations (Flutterwave, etc.)
- Form design:
  - Clear labels
  - Helper text
  - Validation feedback
  - Save button (sticky footer)

*Team Management View:*
- Table of all team members
- Columns: Avatar, Name, Role, Status, Orders, Join Date, Actions
- Role badges with color coding
- Invite button (prominent)
- Bulk actions (send announcement, etc.)

*Invitation Flow:*
- Modal with form:
  - Email input (with validation)
  - Role selector (dropdown with descriptions)
  - Personal message (optional)
  - Send button
- Success: Confirmation with copy link option

**Interactions:**
- Charts: Hover tooltips with exact values
- Metrics: Click to expand detailed view
- Export: Download CSV/PDF with date range
- Real-time: Activity feed updates without refresh
- Settings: Autosave with confirmation toast

**Mobile Specific:**
- Metrics: 2x3 grid
- Charts: Full-width, vertical scroll
- Simplified table views
- Bottom nav for primary sections

**Design Notes:**
- Executive dashboard aesthetic - clean, professional
- Data visualization is clear and actionable
- Quick access to most important functions
- Real-time updates create sense of control
- Color coding aids quick scanning
- Celebratory animations for positive events (new customer, revenue milestone)

---

## 8. Chat/Huddle Interface

**Page Purpose:** Real-time communication hub for customer-manager-worker collaboration.

**Layout Structure:**
- Three-column layout (desktop): Conversations list (25%), Active chat (50%), Info panel (25%)
- Mobile: Full-screen chat with swipe to conversation list
- Sticky header and input area

**Key Elements:**

*Conversations List (Left Column):*
- Search bar at top (filter conversations)
- Filter tabs: All, Unread, Orders, Direct
- Conversation cards:
  - Avatar (or group icon for order chats)
  - Name/Order ID
  - Last message preview (truncated)
  - Timestamp
  - Unread badge (number)
  - Typing indicator (if active)
  - Order status badge (if order-related)
- Sort: Recent, Unread first
- Load more (infinite scroll)

*Active Chat (Center Column):*
- Header:
  - Left: Back button (mobile), Avatar, Name/Order
  - Center: Status indicator (online/offline/typing)
  - Right: Voice call, Video call (huddle), Info panel toggle, Menu
- Message area:
  - Reverse chronological scroll
  - Date dividers
  - Message bubbles:
    - Sent: Right-aligned, primary color background
    - Received: Left-aligned, neutral background
    - Avatar (received messages)
    - Text content
    - Timestamp (subtle, 11px)
    - Read receipts (double checkmark)
  - System messages: Centered, different style (order updates, etc.)
  - Media messages: Image/video with lightbox
  - File attachments: Card with icon and download
- Typing indicator: "User is typing..." with animated dots
- Scroll to bottom button (appears when scrolled up)
- Message input area:
  - Textarea (auto-expanding, max 4 lines)
  - Emoji picker button
  - Attachment button (image, file)
  - Voice note button (press and hold)
  - Send button (icon, disabled when empty)
- Upload progress: Inline with cancel option

*Info Panel (Right Column):*
- Collapsible sections:
  - Order Details (if order-related):
    - Style thumbnail
    - Order ID
    - Status
    - "View Full Order" link
  - Participants:
    - Avatar list
    - Role badges
    - Online status
  - Shared Media:
    - Grid of images/files
    - "View All" link
  - Actions:
    - Mute notifications
    - Archive conversation
    - Report issue
- Compact, scrollable

*Huddle (Video/Audio Call):*
- Overlay or full-screen mode
- Participant tiles:
  - Video feeds (if video)
  - Avatar with audio indicator (if audio only)
  - Name labels
  - Mute indicators
- Controls (bottom):
  - Mute/unmute mic
  - Camera on/off
  - Screen share
  - End call
  - More options (settings)
- Minimizable to corner while browsing
- Picture-in-picture support

*Call Notification:*
- Modal overlay
  - Caller info
  - Order context (if applicable)
  - Audio visual (ringing animation)
  - Accept (green), Decline (red)

**Interactions:**
- Send message: Enter key or click send
- Voice note: Press and hold, swipe to cancel
- Reply to message: Swipe right (mobile) or hover menu (desktop)
- React to message: Quick emoji reactions (tap/click)
- Search in chat: Highlight matches, navigate results
- Scroll to unread: Badge indicator
- Media upload: Compress large images, show preview

**Mobile Specific:**
- Swipe right: Back to conversations
- Swipe left on message: Reply
- Long press: Message actions menu
- Keyboard avoidance: Adjust view when keyboard appears

**Design Notes:**
- Clean, uncluttered conversation view
- Order context always visible (if applicable)
- Quick access to voice/video
- Professional but friendly tone
- Real-time sync across devices
- Delivery and read status clear
- File previews save time
- Smooth animations for message sending

---

## 9. Order Tracking Page

**Page Purpose:** Comprehensive order status view with production progress and delivery tracking.

**Layout Structure:**
- Full-width header with order summary
- Main: Vertical timeline (production progress)
- Secondary: Delivery information card
- Bottom: Contact actions

**Key Elements:**

*Order Header:*
- Card with subtle gradient background
- Left side:
  - Order number (large, bold, monospace)
  - Date placed (with calendar icon)
  - Order type badge (e.g., "Custom Design")
- Right side:
  - Estimated delivery date (prominent)
  - Countdown (e.g., "5 days remaining")
  - Status pill (color-coded)
- Below: Mini stats
  - Total amount
  - Payment status (badge)
  - Organization name (linked)
- Style thumbnail strip (if multiple items)

*Production Timeline (Vertical):*
- Heading: "Production Progress"
- Timeline design:
  - Vertical line connecting stages
  - Circle nodes (icons inside)
  - Status-based coloring:
    - Completed: Green, filled circle, checkmark
    - In Progress: Blue, pulsing circle, animated
    - Pending: Gray, outline circle, empty
- Each stage card:
  - Stage name (bold, 18px)
  - Status badge
  - Date/time (completed or started)
  - Worker info (if assigned):
    - Avatar
    - Name
    - "Message Worker" link
  - Progress bar (if in progress):
    - Percentage
    - Visual bar with animation
  - Substeps (if applicable):
    - Checkboxes for micro-tasks
    - e.g., Cutting: "Fabric selected ✓", "Pattern cut ✓"
  - Photos (if worker uploaded):
    - Thumbnail gallery
    - Click for lightbox
  - Notes from worker (if any)
- Stages:
  - Order Confirmed
  - Cutting
  - Sewing
  - Finishing
  - Quality Check
  - Ready for Delivery
  - Delivered

*Delivery Information Card:*
- Bordered card with icon header
- Information rows:
  - Delivery address (map pin icon)
  - Contact phone (phone icon)
  - Tracking number (package icon) - Copyable
  - Courier (if external)
  - Delivery status badge
- Embedded mini map (if address available)
- "Update Address" link (if before dispatch)

*Delivery Tracking (if dispatched):*
- Mini timeline (horizontal or vertical)
- Stages:
  - Packed
  - In Transit
  - Out for Delivery
  - Delivered
- Current location (if available)
- Delivery person info:
  - Name
  - Phone (call button)

*Actions Section:*
- Button group:
  - Message Manager (speech bubble icon)
  - Start Huddle (video icon)
  - Call (phone icon)
  - Share Order (share icon)
- Mobile: Sticky bottom bar
- Desktop: Floating or bottom of page

*Order Details Accordion:*
- Collapsible sections:
  - Style Details:
    - Images
    - Description
    - Customizations
  - Measurements:
    - Table of measurements
    - "View Size Guide" link
  - Pricing Breakdown:
    - Itemized list
    - Taxes/fees
    - Total
  - Payment History:
    - Timeline of payments
    - Receipts (download links)
  - Order Timeline:
    - Full activity log
    - All events chronologically

*Rating & Review Prompt (after delivery):*
- Card with call-to-action
- Star rating selector
- "Write a Review" button
- Upload photos option
- Shows after delivery confirmed

**Interactions:**
- Timeline: Auto-scroll to current stage on load
- Progress bars: Animated fill on first view
- Photos: Lightbox with zoom
- Copy tracking number: Click to copy, show tooltip
- Real-time updates: Progress changes without refresh
- Call buttons: Native phone integration
- Message buttons: Open chat drawer

**Mobile Specific:**
- Timeline: Full-width cards with progress
- Sticky header with order number
- Quick actions: Floating action button (FAB)
- Swipe photos in timeline

**Design Notes:**
- Progress visibility builds trust
- Clear next steps (what's happening now)
- Easy communication access
- Celebratory when delivered (confetti, thank you message)
- Photos show real progress (transparency)
- Professional yet personal tone
- Anxiety-reducing (clear timelines, accessible support)

---

## 🎨 Design System Components

**Reusable across all pages:**

### Buttons
- **Primary**: Black background, white text, 8px radius, 12px vertical padding
- **Secondary**: White background, black border, black text
- **Tertiary**: No background, underline on hover
- **Destructive**: Red background, white text
- **Icon Button**: Circle (40px), icon centered, subtle hover effect

### Cards
- Background: White
- Border: 1px solid #E5E5E0
- Radius: 12px
- Shadow: 0 2px 8px rgba(0, 0, 0, 0.06)
- Hover: Shadow increases to 0 4px 12px rgba(0, 0, 0, 0.1)
- Padding: 16px (small), 24px (medium), 32px (large)

### Form Inputs
- Height: 44px (mobile-friendly)
- Border: 2px solid #E5E5E0
- Focus: Border color changes to primary, subtle glow
- Radius: 8px
- Padding: 12px 16px
- Label: 14px, semibold, 8px margin-bottom
- Error state: Red border, error message below (12px, red)
- Success state: Green border, checkmark icon
- Disabled: Gray background, cursor not-allowed

### Badges/Pills
- Small: 20px height, 8px horizontal padding, 11px font
- Medium: 24px height, 12px horizontal padding, 12px font
- Large: 28px height, 16px horizontal padding, 14px font
- Radius: Full (9999px)
- Status colors:
  - Success: Green background (#D1FAE5), green text (#065F46)
  - Warning: Yellow background (#FEF3C7), yellow-dark text (#92400E)
  - Error: Red background (#FEE2E2), red text (#991B1B)
  - Info: Blue background (#DBEAFE), blue text (#1E40AF)
  - Neutral: Gray background (#F3F4F6), gray text (#374151)

### Icons
- Size: 16px (small), 20px (medium), 24px (large), 32px (extra-large)
- Stroke width: 2px
- Color: Inherit from parent or specific (gray-600 default)
- Interactive icons: Hover scales to 1.1x, cursor pointer

### Tooltips
- Background: Black with 90% opacity
- Text: White, 12px
- Padding: 8px 12px
- Radius: 6px
- Arrow: 6px triangle
- Max-width: 200px
- Animation: Fade in 200ms

### Modals/Dialogs
- Backdrop: Black with 40% opacity, blur effect
- Container: White, centered, max-width 600px
- Radius: 16px
- Padding: 32px
- Header: Bold title, close button (top-right)
- Footer: Action buttons, right-aligned
- Animation: Scale from 0.95 to 1, fade in 300ms

### Dropdowns/Menus
- Container: White, shadow like cards
- Border: 1px solid #E5E5E0
- Radius: 8px
- Max-height: 300px (scroll if needed)
- Item: 40px height, 12px horizontal padding
- Hover: Light gray background
- Selected: Primary color background, white text
- Divider: 1px solid #E5E5E0

### Loading States
- Skeleton: Animated gradient (gray-200 to gray-300)
- Spinner: Circular, primary color, 3 sizes
- Progress bar: Height 4px, rounded ends, animated fill
- Shimmer effect: Left to right sweep

### Empty States
- Illustration: Centered, max 300px width
- Heading: 20px, semibold
- Description: 16px, gray-600, max 400px width
- CTA: Primary button below
- Spacing: Generous vertical spacing

### Notifications/Toasts
- Position: Top-right (desktop), top-center (mobile)
- Width: 360px max
- Background: White
- Border-left: 4px solid status color
- Shadow: Elevated
- Icon: Status icon (left)
- Close button: X icon (right)
- Duration: 4 seconds (auto-dismiss)
- Animation: Slide in from right, slide out

### Tables
- Header: Gray background, bold text, 14px
- Row: 48px height minimum
- Border: Bottom border only (gray-200)
- Hover: Light gray background
- Zebra striping: Optional, subtle alternating rows
- Mobile: Transform to cards on mobile

### Avatars
- Sizes: 24px, 32px, 40px, 48px, 64px, 96px
- Shape: Circle (default) or rounded square (8px radius)
- Fallback: Initials on colored background (hash name for color)
- Border: Optional white border (2px) for overlap situations
- Status indicator: Small dot (bottom-right) for online/offline

### Tabs
- Underline style (default): Bottom border on active
- Pill style (alternative): Full background on active
- Height: 44px
- Font: 14px, semibold when active
- Spacing: 24px between tabs
- Active color: Primary color
- Inactive: Gray-600, hover gray-900

---

## 📱 Mobile-Specific Patterns

### Bottom Navigation (Mobile Main Nav)
- Fixed bottom bar
- 5 items maximum
- Icons (24px) with labels (10px)
- Active item: Primary color + slightly larger icon
- Height: 64px
- Background: White with top shadow
- Safe area aware (iOS notch)

### Pull to Refresh
- Spinner appears on pull down
- Haptic feedback on trigger
- Smooth animation
- "Release to refresh" text

### Swipe Gestures
- Swipe right: Back/Previous
- Swipe left: Forward/Next (where applicable)
- Swipe to delete: Red background revealed
- Swipe to action: Multiple actions revealed

### Bottom Sheets
- Slides up from bottom
- Backdrop with blur
- Drag handle at top (pill shape)
- Snap points: 50%, 90%, dismissed
- Swipe down to dismiss

### Floating Action Button (FAB)
- Fixed bottom-right (16px margins)
- Circle, 56px diameter
- Primary color background
- Icon centered (white)
- Shadow: Elevated
- Press: Scale down slightly
- Multiple actions: Expands upward

---

## 🎭 Micro-interactions & Animations

### Page Transitions
- Duration: 300ms
- Easing: ease-in-out
- Fade + slight scale (0.98 to 1)
- Respect prefers-reduced-motion

### Button States
- Hover: Slight scale (1.02x), shadow increase
- Active: Scale down (0.98x)
- Loading: Spinner replaces text, disabled state
- Success: Checkmark animation, green pulse

### Form Validation
- Real-time: Validate on blur, not on every keystroke
- Success: Green border, slide-in checkmark (200ms)
- Error: Red border, shake animation (300ms), slide-in error text

### Card Interactions
- Hover: Elevate (shadow increase, 200ms)
- Click: Subtle scale down, then navigate
- Loading: Pulse skeleton

### Image Loading
- Blur-up technique: Blur placeholder → sharp image
- Fade in: 300ms
- Lazy load: Load when in viewport

### Notifications
- Slide in: From right (desktop) or top (mobile)
- Duration on screen: 4 seconds
- Progress bar: Depletes over duration
- Slide out: Smooth exit
- Stack: Multiple notifications stack vertically

### Status Changes
- Badge color change: Smooth color transition (400ms)
- Icon change: Cross-fade between icons (300ms)
- Count updates: Number morph animation

### Navigation
- Active item: Slide-in underline or background (200ms)
- Menu open: Scale and fade (300ms)
- Sidebar: Slide in from left (300ms)

### Data Updates
- New item: Fade in + slide down (400ms)
- Removed item: Fade out + collapse (300ms)
- Updated item: Brief highlight (yellow), then fade (1000ms)

### Success Celebrations
- Order placed: Confetti animation (2 seconds)
- Task completed: Checkmark with expanding circle (600ms)
- Achievement: Badge bounce and shine effect

---

## ♿ Accessibility Requirements

### Color Contrast
- Text on background: Minimum 4.5:1 (WCAG AA)
- Large text (18px+): Minimum 3:1
- Icons and UI components: Minimum 3:1
- Test with color blindness simulators

### Keyboard Navigation
- All interactive elements: Focusable
- Focus indicator: Visible outline (primary color, 2px)
- Tab order: Logical flow
- Skip links: "Skip to main content"
- Keyboard shortcuts: Documented, toggleable

### Screen Reader Support
- Semantic HTML: Proper heading hierarchy
- ARIA labels: For icon buttons and complex widgets
- ARIA live regions: For dynamic content updates
- Alt text: Descriptive for all images
- Form labels: Explicitly associated with inputs

### Motion & Animation
- Respect prefers-reduced-motion
- Provide toggle in settings
- Essential animations only for reduced motion

### Touch Targets
- Minimum: 44x44px (iOS), 48x48px (Android)
- Spacing: 8px minimum between targets
- Visual feedback: Immediate on touch

### Text & Readability
- Font size: Minimum 16px for body text
- Line height: 1.5 for body text
- Line length: Maximum 75 characters
- Resizable: Text can scale to 200% without breaking layout
- Language: Proper lang attributes

---

## 🌍 Internationalization (i18n)

### Text Handling
- All text: Externalized in translation files
- RTL support: For Arabic, Hebrew, etc.
- Number formatting: Locale-aware (currency, dates)
- Pluralization: Handle singular/plural correctly

### Currency Display
- Symbol: ₦ (Naira), GH₵ (Cedi), KSh (Shilling), etc.
- Format: ₦25,000.00 (Nigerian format)
- Decimal separators: Locale-appropriate

### Date & Time
- Format: Locale-aware (DD/MM/YYYY for most African countries)
- Relative dates: "2 hours ago", "Yesterday"
- Time zones: Handle correctly, show user's local time

### Images & Media
- Avoid text in images
- Use culturally appropriate imagery
- Support for different reading directions

---

## 🎨 Dark Mode (Future Enhancement)

### Color Adaptations
- Background: #1a1a1a → #0a0a0a
- Cards: White → #1f1f1f
- Text: Black → #f5f5f5
- Borders: #E5E5E0 → #333333
- Shadows: Lighter, more subtle
- Primary color: Slightly lighter shade for contrast

### Implementation
- CSS custom properties for easy switching
- Toggle in settings
- Respect system preference
- Persist user choice

---

## 📊 Performance Guidelines

### Images
- Format: WebP with JPEG fallback
- Responsive: Multiple sizes, srcset
- Compression: 80% quality for photos
- Lazy loading: Below fold images
- Thumbnails: Generate multiple sizes
- CDN: Serve from Cloudinary

### Code Splitting
- Route-based: Load page code on demand
- Component-based: Lazy load heavy components
- Critical CSS: Inline for first paint

### Loading Strategy
- Skeleton screens: For initial load
- Progressive enhancement: Core content first
- Optimistic UI: Show success before server confirms
- Caching: Aggressive caching with service workers

### Metrics Targets
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Time to Interactive: < 3.5s
- Cumulative Layout Shift: < 0.1

---

## 🔐 Security UI Patterns

### Payment Information
- SSL indicator: Lock icon visible
- Payment provider logos: Trust badges
- Never show full card numbers
- Security badges: "Secure Payment" messaging

### Sensitive Data
- Password fields: Toggle visibility icon
- Masked by default
- Copy-paste disabled for passwords
- OTP inputs: Auto-focus next field

### Permissions
- Clear explanations: Before requesting permissions
- Contextual prompts: When feature is used, not on load
- Easy to revoke: In settings

---

## 📝 Content Guidelines

### Tone of Voice
- Professional but warm
- Encouraging, never condescending
- Clear and concise
- Action-oriented

### Microcopy
- Button text: Action verbs ("Place Order", not "Submit")
- Error messages: Helpful, explain how to fix
- Empty states: Encouraging, suggest next action
- Success messages: Celebrate, affirm action

### Labels
- Form fields: Question format ("What's your chest size?")
- Tooltips: Brief, under 15 words
- Helper text: When to use the field, format examples

---

## 🎯 Platform-Specific Considerations

### iOS Design Patterns
- Bottom tab bar for main navigation
- Large titles on list screens
- Swipe gestures (back, actions)
- Native pickers for selection
- Pull to refresh
- Haptic feedback
- Safe area awareness (notch, home indicator)

### Android Design Patterns
- Bottom navigation or top tabs
- Floating action button for primary action
- Material ripple effects
- System back button support
- Snackbars for notifications
- Edge-to-edge layouts

### Web-Specific
- Hover states (not on mobile)
- Cursor changes (pointer, text, etc.)
- Keyboard shortcuts
- Browser back button support
- URL structure (bookmarkable)
- SEO optimization

---

## 🚀 Onboarding & First-Time Experience

### Welcome Flow (New Users)
- Splash screen: Brand identity (1-2 seconds)
- Welcome carousel: 3-4 slides showing key features
- Each slide:
  - Illustration (400px)
  - Heading (bold, 24px)
  - Description (16px, 2 lines)
  - Progress dots at bottom
- Skip option: "Skip" link top-right
- Final slide: "Get Started" CTA

### Account Setup
- Step indicator: Progress bar with steps
- Minimal fields: Only essentials
- Optional steps: Clearly marked
- Social sign-up: Google, Facebook options
- Profile photo: Optional, use initials as fallback

### Feature Discovery
- Tooltips: On first use of features
- Progressive disclosure: Show advanced features later
- "New" badges: For recently added features
- Tutorial mode: Optional walkthrough

### Empty States (First Use)
- Welcoming illustration
- "Get started by..." with first action
- Examples or suggestions
- Import options if applicable

---

## 🎨 Visual Assets Needed

### Illustrations
- Empty states (8-10 unique)
- Onboarding slides (3-4)
- Error states (404, 500, no connection)
- Success celebrations (order placed, completed)
- Feature highlights
- Style: Flat design with African-inspired colors and patterns

### Icons
- Custom icons for:
  - Measurement types (chest, waist, etc.)
  - Fabric types
  - Production stages
  - Delivery statuses
- Consistent style: Line icons, 2px stroke

### Photos
- Sample fashion/styles (high-quality)
- Worker portraits (diverse, professional)
- Workshop/studio environments
- Before/after customer photos
- Team photos for organization pages

### Patterns & Textures
- Subtle African patterns for backgrounds
- Fabric textures for material representation
- Gradient overlays for hero sections

---

## 📐 Grid & Spacing System

### 8px Grid
- All spacing: Multiples of 8px
- Micro: 4px (tight)
- Small: 8px
- Medium: 16px
- Large: 24px
- XL: 32px
- XXL: 48px
- XXXL: 64px

### Page Margins
- Mobile: 16px
- Tablet: 24px
- Desktop: 32px
- Max-width: 1440px (center-aligned)

### Component Spacing
- Between cards: 16px (mobile), 24px (desktop)
- Section spacing: 48px (mobile), 64px (desktop)
- Form field spacing: 16px vertical

---

## 🎨 Final Design Checklist

Before considering any page complete, verify:

- [ ] Follows established color palette
- [ ] Uses consistent typography scale
- [ ] All interactive elements have hover/focus states
- [ ] Touch targets meet minimum size (44x44px)
- [ ] Color contrast meets WCAG AA standards
- [ ] Loading states defined for all async actions
- [ ] Error states handled gracefully
- [ ] Empty states are helpful and encouraging
- [ ] Responsive behavior defined for all breakpoints
- [ ] Icons are consistent style and size
- [ ] Spacing follows 8px grid
- [ ] All copy is clear, concise, and actionable
- [ ] Form validation provides helpful feedback
- [ ] Success states include celebration/confirmation
- [ ] Navigation is intuitive and consistent
- [ ] Performance considerations addressed (lazy loading, etc.)
- [ ] Accessibility requirements met (keyboard nav, screen readers)
- [ ] Micro-interactions enhance experience
- [ ] Maintains brand personality throughout

---

## 🎨 Design Deliverables

For each page design:

1. **Desktop Version** (1440px width)
   - Full page layout
   - All states (empty, loading, success, error)
   - Hover states for interactive elements
   - Modals and overlays

2. **Tablet Version** (768px width)
   - Adapted layout
   - Navigation adjustments
   - Touch-optimized

3. **Mobile Version** (375px width)
   - Mobile-specific patterns
   - Bottom navigation
   - Simplified layouts
   - Gesture indicators

4. **Component Library**
   - All reusable components
   - Multiple states
   - Usage guidelines

5. **Style Guide**
   - Color palette with usage
   - Typography scale
   - Spacing system
   - Icon set
   - Animation guidelines

6. **Prototype**
   - Interactive flows
   - Key user journeys
   - Micro-interactions

---

## 💬 Design Handoff Notes

When handing off to development:

1. **Spacing**: All measurements in pixels, convertible to rem
2. **Colors**: Hex codes + opacity where applicable
3. **Typography**: Font weights, sizes, line heights
4. **Shadows**: X, Y, blur, spread, color with opacity
5. **Animations**: Duration, easing, trigger conditions
6. **States**: All button/input states documented
7. **Breakpoints**: Exact pixel values for responsive design
8. **Assets**: All images exported in multiple resolutions (1x, 2x, 3x)
9. **Icons**: SVG format, properly optimized
10. **Interactions**: Written descriptions or video demos

---

These design prompts ensure consistency across all pages while allowing each page to serve its unique purpose. The shared design system creates a cohesive, professional platform that builds trust and makes the complex workflow of tailoring management feel intuitive and manageable.