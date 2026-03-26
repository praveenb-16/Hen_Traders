# Hen Trading - Product Requirements Document (PRD)

## 1. Project Overview

### Project Name
**Hen Trading** (கோழி வர்த்தகம்)

### Project Type
Full-stack web application for poultry (hen) trading business

### Core Functionality
A daily ledger application for recording hen (chicken) trading transactions with support for:
- Katti Koli (live weight hens)
- Nalla Koli (net weight hens)
- Both types in a single transaction
- Running balance tracking with previous balance carry-forward

### Target Users
- Single admin user managing a hen trading business
- Tamil + English bilingual interface

---

## 2. Tech Stack

| Component | Technology |
|-----------|------------|
| Framework | Next.js 14 (App Router) with TypeScript |
| Styling | Tailwind CSS + shadcn/ui components |
| Authentication | NextAuth.js v5 (credentials provider) |
| ORM | Prisma |
| Database | PostgreSQL |
| Password Hashing | bcryptjs |
| Date Handling | date-fns |

---

## 3. User Interface

### 3.1 Authentication
- **Login Page** (`/login`)
  - Username and password fields
  - Single admin user credentials
  - Redirect to home on successful login

### 3.2 Home Page (`/`)
- **Header**: App title with logout button
- **History Section** (Separate, Blue Color)
  - Shows previous balance/extra with color coding
  - Green for Balance, Red for Extra
  - Clickable to view transaction history
  - Shows "No Previous Records" if first transaction

- **Type Selection**
  - Option 1: Single Type (Katti Koli or Nalla Koli)
  - Option 2: Both Types (Katti Koli + Nalla Koli)

### 3.3 Transaction Forms (`/new?type=`)
All forms include:
- Auto-filled date (read-only)
- Hen type label (Tamil + English)
- Real-time calculations as user types
- Bilingual labels (English / Tamil)

#### Katti Koli Form
- Row 1: Box × Hen input
- Row 2: Box × Hen input
- Total Hens (auto-calculated)
- Rate per hen (default from last transaction)
- Amount = Total Hens × Rate
- Labour charges (default: ₹1600)
- Total = Amount + Labour

#### Nalla Koli Form
- Row 1: Box × Hen input
- Row 2: Box × Hen input
- Total Hens (auto-calculated)
- Net Weight input (Kg)
- Water Weight input (Kg)
- Weight = Net Weight - Water Weight
- Rate per Kg
- Amount = Weight × Rate
- Labour charges (default: ₹1600)
- Total = Amount + Labour

#### Both Form
- Combines Katti Koli and Nalla Koli sections
- Combined total calculation
- Single balance section for both

#### Balance Section (All Forms)
- **Previous Balance Card** (Blue/Red color)
  - Shows previous balance/extra prominently
  - Green for Balance, Red for Extra
  - Edit button to modify previous values
  
- Paid Amount input
- Auto-calculated Today Balance/Extra
- Old Balance (auto-fetched from last transaction)
- **Final Balance Calculation Logic**

### 3.4 History Page (`/history`)
- List of all past transactions (newest first)
- Each card shows:
  - Date
  - Hen Type badge
  - Total Amount, Paid Amount
  - Final Balance/Extra (color coded)
- Click to expand and see details
- Generate Bill button
- Bill Dialog with Print & Share functionality

### 3.5 Bill Generation
- Professional bill format
- Print functionality
- Share via clipboard (for WhatsApp)
- All details included:
  - Header with date and type
  - Itemized breakdown
  - Final balance/extra

---

## 4. Database Schema

### User Model
```
User {
  id: String (cuid)
  username: String (unique)
  password: String (hashed)
  createdAt: DateTime
}
```

### Transaction Model
```
Transaction {
  id: String (cuid)
  date: DateTime
  henType: HenType (KATTI_KOLI | NALLA_KOLI | BOTH)
  
  // Katti Koli fields
  kBox1, kHen1, kBox2, kHen2: Int?
  kTotalHens: Int?
  kRate, kAmount, kLabour, kTotal: Float?
  
  // Nalla Koli fields
  nBox1, nHen1, nBox2, nHen2: Int?
  nTotalHens: Int?
  nNetWeight, nWaterWeight, nWeight: Float?
  nRate, nAmount, nLabour: Float?
  
  // Totals
  totalAmount: Float
  paidAmount: Float
  todayAmount: Float
  todayType: DiffType
  oldAmount: Float
  oldType: DiffType
  finalAmount: Float
  finalType: DiffType
  
  createdAt: DateTime
}
```

### Enums
```
HenType: KATTI_KOLI, NALLA_KOLI, BOTH
DiffType: BALANCE, EXTRA
```

---

## 5. API Endpoints

### Authentication
- `POST /api/auth/[...nextauth]` - NextAuth.js handlers

### Transactions
- `GET /api/transactions` - List all transactions (newest first)
- `POST /api/transactions` - Create new transaction
- `GET /api/transactions/latest` - Get latest transaction (for old balance)
- `GET /api/transactions/[id]` - Get single transaction

---

## 6. Key Business Logic

### Final Balance Calculation

| Today | Old | Result |
|-------|-----|--------|
| BALANCE + BALANCE | → | BALANCE (add both) |
| BALANCE + EXTRA | → | BALANCE if Today ≥ Old, else EXTRA |
| EXTRA + EXTRA | → | EXTRA (add both) |
| EXTRA + BALANCE | → | BALANCE if Old ≥ Today, else EXTRA |

### Rate Memory
- Rate fields auto-fill from last transaction
- User can modify as needed

### Labour Default
- Default value: ₹1600
- User can edit

### Old Balance Auto-fill
- Auto-fetched from previous transaction's final amount
- Editable if user needs to override

---

## 7. UI/UX Guidelines

### Color Scheme
- **Balance**: Green (text-green-600, bg-green-50)
- **Extra**: Red (text-red-600, bg-red-50)
- **Primary**: Slate (slate-900 for headers)
- **History Card**: Blue (blue-500 border, blue-50 background)
- **Buttons**: Black/White with hover states

### Typography
- Tamil + English bilingual labels
- Format: "English / Tamil"
- Clear hierarchy with bold headings

### Responsiveness
- Mobile-friendly design
- Grid layouts adapt to screen size

---

## 8. Environment Variables

```
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD_HASH="bcrypt-hash"
```

---

## 9. Features Checklist

### Authentication
- [x] Single admin user login
- [x] Protected dashboard routes
- [x] Logout functionality

### Transaction Management
- [x] Katti Koli form with real-time calc
- [x] Nalla Koli form with real-time calc
- [x] Both Types combined form
- [x] Balance section with final calculation
- [x] Rate memory from last transaction
- [x] Labour default value (₹1600)

### History & Bills
- [x] Transaction history list
- [x] Expandable transaction cards
- [x] Generate Bill dialog
- [x] Print functionality
- [x] Share via clipboard

### UI/UX
- [x] Tamil + English labels
- [x] Color-coded Balance (green) / Extra (red)
- [x] Previous balance card (blue color)
- [x] History section on home page
- [x] Real-time calculations

---

## 10. Project Structure

```
/app
  /api
    /auth/[...nextauth]/route.ts
    /transactions/route.ts
    /transactions/[id]/route.ts
    /transactions/latest/route.ts
  /(auth)
    /login/page.tsx
  /(dashboard)
    /layout.tsx
    /page.tsx
    /new/page.tsx
    /history/page.tsx
/components
  /forms
    KattiKoliForm.tsx
    NallaKoliForm.tsx
    BothForm.tsx
    BalanceSection.tsx
    BillDialog.tsx
  /ui (shadcn components)
/lib
  /auth.ts
  /prisma.ts
  /calculations.ts
/prisma
  schema.prisma
  seed.ts
.env
```

---

## 11. Future Enhancements (Optional)

- Multi-user support
- Export to PDF
- Email/SMS notifications
- Data analytics dashboard
- Backup/restore functionality
- Customer management (multiple customers)

---

## 12. Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure `.env` file with PostgreSQL URL

3. Run Prisma migrations:
   ```bash
   npx prisma migrate dev --name init
   ```

4. Seed admin user:
   ```bash
   npx prisma db seed
   ```

5. Start development server:
   ```bash
   npm run dev
   ```

6. Login credentials:
   - Username: admin
   - Password: admin123

---

*Document Version: 1.0*
*Last Updated: March 2026*
