-- Insert demo user for testing
INSERT INTO users (id, email, name) 
VALUES ('00000000-0000-0000-0000-000000000001', 'demo@bookshelf.com', 'Demo User')
ON CONFLICT (id) DO NOTHING;
