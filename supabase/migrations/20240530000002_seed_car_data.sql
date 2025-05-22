-- Seed car brands and models

-- Seat
INSERT INTO car_brands (name) VALUES ('Seat') ON CONFLICT (name) DO NOTHING;
WITH brand AS (SELECT id FROM car_brands WHERE name = 'Seat')
INSERT INTO car_models (brand_id, name)
SELECT brand.id, model FROM brand, unnest(ARRAY[
  'Alhambra', 'Altea', 'Altea XL', 'Arosa', 'Cordoba', 'Cordoba Vario', 
  'Exeo', 'Ibiza', 'Ibiza ST', 'Exeo ST', 'Leon', 'Leon ST', 'Inca', 
  'Mii', 'Toledo'
]) AS model ON CONFLICT DO NOTHING;

-- Renault
INSERT INTO car_brands (name) VALUES ('Renault') ON CONFLICT (name) DO NOTHING;
WITH brand AS (SELECT id FROM car_brands WHERE name = 'Renault')
INSERT INTO car_models (brand_id, name)
SELECT brand.id, model FROM brand, unnest(ARRAY[
  'Captur', 'Clio', 'Clio Grandtour', 'Espace', 'Express', 'Fluence', 
  'Grand Espace', 'Grand Modus', 'Grand Scenic', 'Kadjar', 'Kangoo', 
  'Kangoo Express', 'Koleos', 'Laguna', 'Laguna Grandtour', 'Latitude', 
  'Mascott', 'Mégane', 'Mégane CC', 'Mégane Combi', 'Mégane Grandtour', 
  'Mégane Coupé', 'Mégane Scénic', 'Scénic', 'Talisman', 'Talisman Grandtour', 
  'Thalia', 'Twingo', 'Wind', 'Zoé'
]) AS model ON CONFLICT DO NOTHING;

-- Peugeot
INSERT INTO car_brands (name) VALUES ('Peugeot') ON CONFLICT (name) DO NOTHING;
WITH brand AS (SELECT id FROM car_brands WHERE name = 'Peugeot')
INSERT INTO car_models (brand_id, name)
SELECT brand.id, model FROM brand, unnest(ARRAY[
  '1007', '107', '106', '108', '2008', '205', '205 Cabrio', '206', '206 CC', 
  '206 SW', '207', '207 CC', '207 SW', '306', '307', '307 CC', '307 SW', 
  '308', '308 CC', '308 SW', '309', '4007', '4008', '405', '406', '407', 
  '407 SW', '5008', '508', '508 SW', '605', '806', '607', '807', 'Bipper', 'RCZ'
]) AS model ON CONFLICT DO NOTHING;

-- Dacia
INSERT INTO car_brands (name) VALUES ('Dacia') ON CONFLICT (name) DO NOTHING;
WITH brand AS (SELECT id FROM car_brands WHERE name = 'Dacia')
INSERT INTO car_models (brand_id, name)
SELECT brand.id, model FROM brand, unnest(ARRAY[
  'Dokker', 'Duster', 'Lodgy', 'Logan', 'Logan MCV', 'Logan Van', 'Sandero', 'Solenza'
]) AS model ON CONFLICT DO NOTHING;

-- Citroën
INSERT INTO car_brands (name) VALUES ('Citroën') ON CONFLICT (name) DO NOTHING;
WITH brand AS (SELECT id FROM car_brands WHERE name = 'Citroën')
INSERT INTO car_models (brand_id, name)
SELECT brand.id, model FROM brand, unnest(ARRAY[
  'Berlingo', 'C-Crosser', 'C-Elissée', 'C-Zero', 'C1', 'C2', 'C3', 'C3 Picasso', 
  'C4', 'C4 Aircross', 'C4 Cactus', 'C4 Coupé', 'C4 Grand Picasso', 'C4 Sedan', 
  'C5', 'C5 Break', 'C5 Tourer', 'C6', 'C8', 'DS3', 'DS4', 'DS5', 'Evasion', 
  'Jumper', 'Jumpy', 'Saxo', 'Nemo', 'Xantia', 'Xsara'
]) AS model ON CONFLICT DO NOTHING;

-- Toyota
INSERT INTO car_brands (name) VALUES ('Toyota') ON CONFLICT (name) DO NOTHING;
WITH brand AS (SELECT id FROM car_brands WHERE name = 'Toyota')
INSERT INTO car_models (brand_id, name)
SELECT brand.id, model FROM brand, unnest(ARRAY[
  '4-Runner', 'Auris', 'Avensis', 'Avensis Combi', 'Avensis Van Verso', 'Aygo', 
  'Camry', 'Carina', 'Celica', 'Corolla', 'Corolla Combi', 'Corolla sedan', 
  'Corolla Verso', 'FJ Cruiser', 'GT86', 'Hiace', 'Hiace Van', 'Highlander', 
  'Hilux', 'Land Cruiser', 'MR2', 'Paseo', 'Picnic', 'Prius', 'RAV4', 'Sequoia', 
  'Starlet', 'Supra', 'Tundra', 'Urban Cruiser', 'Verso', 'Yaris', 'Yaris Verso'
]) AS model ON CONFLICT DO NOTHING;

-- BMW
INSERT INTO car_brands (name) VALUES ('BMW') ON CONFLICT (name) DO NOTHING;
WITH brand AS (SELECT id FROM car_brands WHERE name = 'BMW')
INSERT INTO car_models (brand_id, name)
SELECT brand.id, model FROM brand, unnest(ARRAY[
  'i3', 'i8', 'M3', 'M4', 'M5', 'M6', 'Rad 1', 'Rad 1 Cabrio', 'Rad 1 Coupé', 
  'Rad 2', 'Rad 2 Active Tourer', 'Rad 2 Coupé', 'Rad 2 Gran Tourer', 'Rad 3', 
  'Rad 3 Cabrio', 'Rad 3 Compact', 'Rad 3 Coupé', 'Rad 3 GT', 'Rad 3 Touring', 
  'Rad 4', 'Rad 4 Cabrio', 'Rad 4 Gran Coupé', 'Rad 5', 'Rad 5 GT', 'Rad 5 Touring', 
  'Rad 6', 'Rad 6 Cabrio', 'Rad 6 Coupé', 'Rad 6 Gran Coupé', 'Rad 7', 'Rad 8 Coupé', 
  'X1', 'X3', 'X4', 'X5', 'X6', 'Z3', 'Z3 Coupé', 'Z3 Roadster', 'Z4', 'Z4 Roadster'
]) AS model ON CONFLICT DO NOTHING;

-- Volkswagen
INSERT INTO car_brands (name) VALUES ('Volkswagen') ON CONFLICT (name) DO NOTHING;
WITH brand AS (SELECT id FROM car_brands WHERE name = 'Volkswagen')
INSERT INTO car_models (brand_id, name)
SELECT brand.id, model FROM brand, unnest(ARRAY[
  'Amarok', 'Beetle', 'Bora', 'Bora Variant', 'Caddy', 'Caddy Van', 'Life', 
  'California', 'Caravelle', 'CC', 'Crafter', 'Crafter Van', 'Crafter Kombi', 
  'CrossTouran', 'Eos', 'Fox', 'Golf', 'Golf Cabrio', 'Golf Plus', 'Golf Sportvan', 
  'Golf Variant', 'Jetta', 'LT', 'Lupo', 'Multivan', 'New Beetle', 'New Beetle Cabrio', 
  'Passat', 'Passat Alltrack', 'Passat CC', 'Passat Variant', 'Passat Variant Van', 
  'Phaeton', 'Polo', 'Polo Van', 'Polo Variant', 'Scirocco', 'Sharan', 'T4', 
  'T4 Caravelle', 'T4 Multivan', 'T5', 'T5 Caravelle', 'T5 Multivan', 
  'T5 Transporter Shuttle', 'Tiguan', 'Touareg', 'Touran'
]) AS model ON CONFLICT DO NOTHING;

-- Mercedes-Benz
INSERT INTO car_brands (name) VALUES ('Mercedes-Benz') ON CONFLICT (name) DO NOTHING;
WITH brand AS (SELECT id FROM car_brands WHERE name = 'Mercedes-Benz')
INSERT INTO car_models (brand_id, name)
SELECT brand.id, model FROM brand, unnest(ARRAY[
  '100 D', '115', '124', '126', '190', '190 D', '190 E', '200 - 300', '200 D', 
  '200 E', '210 Van', '210 kombi', '310 Van', '310 kombi', '230 - 300 CE Coupé', 
  '260 - 560 SE', '260 - 560 SEL', '500 - 600 SEC Coupé', 'Trieda A', 'A', 'A L', 
  'AMG GT', 'Trieda B', 'Trieda C', 'C', 'C Sportcoupé', 'C T', 'Citan', 'CL', 
  'CLA', 'CLC', 'CLK Cabrio', 'CLK Coupé', 'CLS', 'Trieda E', 'E', 'E Cabrio', 
  'E Coupé', 'E T', 'Trieda G', 'G Cabrio', 'GL', 'GLA', 'GLC', 'GLE', 'GLK', 
  'Trieda M', 'MB 100', 'Trieda R', 'Trieda S', 'S', 'S Coupé', 'SL', 'SLC', 
  'SLK', 'SLR', 'Sprinter'
]) AS model ON CONFLICT DO NOTHING;

-- Audi
INSERT INTO car_brands (name) VALUES ('Audi') ON CONFLICT (name) DO NOTHING;
WITH brand AS (SELECT id FROM car_brands WHERE name = 'Audi')
INSERT INTO car_models (brand_id, name)
SELECT brand.id, model FROM brand, unnest(ARRAY[
  '100', '100 Avant', '80', '80 Avant', '80 Cabrio', '90', 'A1', 'A2', 'A3', 
  'A3 Cabriolet', 'A3 Limuzina', 'A3 Sportback', 'A4', 'A4 Allroad', 'A4 Avant', 
  'A4 Cabriolet', 'A5', 'A5 Cabriolet', 'A5 Sportback', 'A6', 'A6 Allroad', 
  'A6 Avant', 'A7', 'A8', 'A8 Long', 'Q3', 'Q5', 'Q7', 'R8', 'RS4 Cabriolet', 
  'RS4/RS4 Avant', 'RS5', 'RS6 Avant', 'RS7', 'S3/S3 Sportback', 'S4 Cabriolet', 
  'S4/S4 Avant', 'S5/S5 Cabriolet', 'S6/RS6', 'S7', 'S8', 'SQ5', 'TT Coupé', 
  'TT Roadster', 'TTS'
]) AS model ON CONFLICT DO NOTHING;

-- Ford
INSERT INTO car_brands (name) VALUES ('Ford') ON CONFLICT (name) DO NOTHING;
WITH brand AS (SELECT id FROM car_brands WHERE name = 'Ford')
INSERT INTO car_models (brand_id, name)
SELECT brand.id, model FROM brand, unnest(ARRAY[
  'Aerostar', 'B-Max', 'C-Max', 'Cortina', 'Cougar', 'Edge', 'Escort', 
  'Escort Cabrio', 'Escort kombi', 'Explorer', 'F-150', 'F-250', 'Fiesta', 
  'Focus', 'Focus C-Max', 'Focus CC', 'Focus kombi', 'Fusion', 'Galaxy', 
  'Grand C-Max', 'Ka', 'Kuga', 'Maverick', 'Mondeo', 'Mondeo Combi', 'Mustang', 
  'Orion', 'Puma', 'Ranger', 'S-Max', 'Sierra', 'Street Ka', 'Tourneo Connect', 
  'Tourneo Custom', 'Transit', 'Transit Bus', 'Transit Connect LWB', 
  'Transit Courier', 'Transit Custom', 'Transit kombi', 'Transit Tourneo', 
  'Transit Valnik', 'Transit Van', 'Transit Van 350', 'Windstar'
]) AS model ON CONFLICT DO NOTHING;

-- Honda
INSERT INTO car_brands (name) VALUES ('Honda') ON CONFLICT (name) DO NOTHING;
WITH brand AS (SELECT id FROM car_brands WHERE name = 'Honda')
INSERT INTO car_models (brand_id, name)
SELECT brand.id, model FROM brand, unnest(ARRAY[
  'Accord', 'Accord Coupé', 'Accord Tourer', 'City', 'Civic', 'Civic Aerodeck', 
  'Civic Coupé', 'Civic Tourer', 'Civic Type R', 'CR-V', 'CR-X', 'CR-Z', 'FR-V', 
  'HR-V', 'Insight', 'Integra', 'Jazz', 'Legend', 'Prelude'
]) AS model ON CONFLICT DO NOTHING; 