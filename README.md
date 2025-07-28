# 📚 BookShelf - Personal Book Tracker

A modern, full-stack web application for tracking your personal reading journey. Built with Next.js 14, Supabase, and TailwindCSS.

![BookShelf App](https://via.placeholder.com/800x400/3B82F6/FFFFFF?text=BookShelf+App)

## ✨ Features

### 🔍 Book Discovery
- **Google Books API Integration**: Search through millions of books
- **Rich Book Information**: Get detailed information including covers, descriptions, authors, and publication dates
- **Smart Search**: Find books by title, author, or ISBN

### 📖 Personal Library Management
- **Digital Bookshelf**: Organize your personal book collection
- **Reading Status Tracking**: Mark books as "Want to Read", "Currently Reading", or "Read"
- **Status Management**: Easily update reading progress with dropdown menus
- **Book Removal**: Remove books from your shelf when needed

### 📊 Reading Analytics
- **Statistics Dashboard**: View your reading progress at a glance
- **Status Filtering**: Filter your library by reading status
- **Reading Counts**: Track total books, books read, currently reading, and want to read

### 🎨 Modern UI/UX
- **Beautiful Blue Theme**: Professionally designed with a calming blue color scheme
- **Montserrat Typography**: Clean, modern font throughout the application
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Intuitive Icons**: Lucide React icons for better user experience
- **Loading States**: Smooth loading animations and feedback
- **Toast Notifications**: Real-time feedback for user actions

## 🛠 Tech Stack

### Frontend
- **Next.js 14** with App Router - React framework for production
- **TypeScript** - Type-safe JavaScript
- **TailwindCSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality UI components
- **Lucide React** - Beautiful icon library

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Supabase** - PostgreSQL database with real-time capabilities
- **Google Books API** - Book search and information

### Database Schema
\`\`\`sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Books table
CREATE TABLE books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  google_id VARCHAR(255) NOT NULL,
  title VARCHAR(500) NOT NULL,
  author VARCHAR(500),
  image_url TEXT,
  description TEXT,
  published_date VARCHAR(50),
  page_count INTEGER,
  status VARCHAR(50) DEFAULT 'want_to_read',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, google_id)
);
\`\`\`

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/yourusername/bookshelf-app.git
   cd bookshelf-app
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   \`\`\`env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   \`\`\`

4. **Set up the database**
   
   Run the SQL script in your Supabase SQL editor:
   \`\`\`bash
   # Execute the contents of scripts/004-create-tables-simple.sql
   # in your Supabase dashboard SQL editor
   \`\`\`

5. **Start the development server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

### Database Setup

If you encounter database errors, the app includes an automatic setup feature:

1. Navigate to `/shelf`
2. If tables don't exist, you'll see a "Database Setup Required" message
3. Click "Set Up Database" to automatically create all necessary tables
4. The demo user will be created automatically

## 📱 Pages & Features

### 🏠 Home Page (`/`)
- Welcome screen with feature overview
- Quick navigation to search and shelf
- Feature highlights with beautiful cards

### 🔍 Search Page (`/search`)
- Google Books API integration
- Real-time search results
- Add books to shelf with status selection
- Book covers and detailed information
- Duplicate prevention

### 📚 Shelf Page (`/shelf`)
- Personal book collection management
- Reading statistics dashboard
- Filter books by status
- Update reading status
- Remove books from shelf
- Empty state handling

## 🔧 API Endpoints

### Books API
- `GET /api/books` - Fetch user's book collection
- `POST /api/books` - Add a new book to shelf
- `PATCH /api/books/[id]` - Update book status
- `DELETE /api/books/[id]` - Remove book from shelf

### Search API
- `GET /api/search?q={query}` - Search books via Google Books API

### Setup API
- `POST /api/setup` - Initialize database tables

## 🎨 Design System

### Color Palette
- **Primary Blue**: `#3B82F6` - Main brand color
- **Blue Variants**: `#1E40AF`, `#60A5FA`, `#DBEAFE`
- **Success Green**: `#10B981`
- **Warning Yellow**: `#F59E0B`
- **Error Red**: `#EF4444`

### Typography
- **Font Family**: Montserrat
- **Weights**: 300, 400, 500, 600, 700

### Components
- **Cards**: Rounded corners with subtle shadows
- **Buttons**: Blue primary with hover states
- **Status Badges**: Color-coded reading status indicators
- **Icons**: Lucide React icons throughout

## 🔒 Security Features

- **Environment Variables**: Sensitive keys stored securely
- **API Validation**: Input validation on all endpoints
- **Error Handling**: Graceful error handling with user feedback
- **SQL Injection Prevention**: Parameterized queries via Supabase

## 📊 Performance Optimizations

- **Next.js App Router**: Optimized routing and rendering
- **Font Optimization**: Next.js font optimization for Montserrat
- **Image Optimization**: Next.js Image component for book covers
- **Database Indexing**: Optimized database queries with indexes
- **Caching**: Efficient API response caching

## 🧪 Testing

The application includes comprehensive error handling and user feedback:

- **Loading States**: Visual feedback during API calls
- **Error Boundaries**: Graceful error handling
- **Toast Notifications**: Real-time user feedback
- **Form Validation**: Client and server-side validation

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Books API** - For providing access to millions of books
- **Supabase** - For the excellent database and authentication platform
- **shadcn/ui** - For the beautiful UI components
- **Lucide** - For the amazing icon library
- **Vercel** - For the seamless deployment platform

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/bookshelf-app/issues) page
2. Create a new issue with detailed information
3. Contact support at support@bookshelf.com

## 🔮 Future Enhancements

- **User Authentication**: Multi-user support with NextAuth
- **Book Reviews**: Personal book reviews and ratings
- **Reading Goals**: Annual reading goal tracking
- **Book Recommendations**: AI-powered book suggestions
- **Social Features**: Share reading lists with friends
- **Export/Import**: Backup and restore book collections
- **Dark Mode**: Theme switching capability
- **Mobile App**: React Native companion app

---

**Happy Reading! 📚✨**

Built with ❤️ using Next.js, Supabase, and TailwindCSS
