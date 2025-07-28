-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create books table if it doesn't exist
CREATE TABLE IF NOT EXISTS books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  google_id VARCHAR(255) NOT NULL,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  image_url TEXT,
  description TEXT,
  published_date VARCHAR(50),
  page_count INTEGER,
  status VARCHAR(50) DEFAULT 'want_to_read' CHECK (status IN ('read', 'currently_reading', 'want_to_read')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, google_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_books_user_id ON books(user_id);
CREATE INDEX IF NOT EXISTS idx_books_status ON books(status);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Insert a demo user for testing (optional)
INSERT INTO users (id, email, name, created_at) 
VALUES ('00000000-0000-0000-0000-000000000001', 'demo@bookshelf.com', 'Demo User', NOW())
ON CONFLICT (email) DO NOTHING;
