-- Create users table with simple structure
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create books table with simple structure (no enum for compatibility)
CREATE TABLE IF NOT EXISTS books (
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_books_user_id ON books(user_id);
CREATE INDEX IF NOT EXISTS idx_books_status ON books(status);
CREATE INDEX IF NOT EXISTS idx_books_google_id ON books(google_id);

-- Insert demo user
INSERT INTO users (id, email, name) 
VALUES ('00000000-0000-0000-0000-000000000001', 'demo@bookshelf.com', 'Demo User')
ON CONFLICT (id) DO NOTHING;
