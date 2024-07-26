```SQL
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR,
  description VARCHAR,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON categories
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();
```