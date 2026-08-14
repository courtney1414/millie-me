-- Seed data pulled from the current Shopify catalog (millie & me - a family collective).
-- Prices below match the existing 1 Day / 3 Days / 1 Week tiers from Shopify.
-- NOTE: only 10 of your Shopify products were pulled for this seed (there are more in your
-- store) -- run the export again / extend this file to bring the rest in before going live.

insert into items (id, name, description, image_url, quantity, pricing_tiers) values
('nanit-pro-smart-baby-monitor-rental', 'Nanit Pro Smart Baby Monitor', 'Rent the Nanit Pro Smart Baby Monitor. Choose your rental length at checkout.',
  'https://cdn.shopify.com/s/files/1/0732/0987/2523/files/pdp_system_floor_stand.png?v=1783785840', 1,
  '[{"label":"1 Day","days":1,"price_cents":800},{"label":"3 Days","days":3,"price_cents":2000},{"label":"1 Week","days":7,"price_cents":3600}]'),

('stokke-sleepi-bed-natural-rental', 'Stokke Sleepi Bed, Natural', 'Rent the Stokke Sleepi Bed in Natural finish. Choose your rental length at checkout.',
  'https://cdn.shopify.com/s/files/1/0732/0987/2523/files/Sleepi-Bed_Natural_Closed_5046_eCom.jpg?v=1783785853', 1,
  '[{"label":"1 Day","days":1,"price_cents":1600},{"label":"3 Days","days":3,"price_cents":4000},{"label":"1 Week","days":7,"price_cents":7200}]'),

('the-tushbaby-hip-carrier-rental', 'The Tushbaby Hip Carrier', 'Rent The Tushbaby Hip Carrier. Choose your rental length at checkout.',
  'https://cdn.shopify.com/s/files/1/0732/0987/2523/files/rKeAfN6W_grande_c411bacc-7b68-4f5b-8889-12238e1f7c1b.jpg?v=1783785867', 1,
  '[{"label":"1 Day","days":1,"price_cents":400},{"label":"3 Days","days":3,"price_cents":1000},{"label":"1 Week","days":7,"price_cents":1800}]'),

('ubbi-steel-odor-locking-diaper-pail-rental', 'Ubbi Steel Odor Locking Diaper Pail', 'Rent the Ubbi Steel Odor Locking Diaper Pail. Choose your rental length at checkout.',
  'https://cdn.shopify.com/s/files/1/0732/0987/2523/files/10000_White.jpg?v=1783785881', 1,
  '[{"label":"1 Day","days":1,"price_cents":600},{"label":"3 Days","days":3,"price_cents":1500},{"label":"1 Week","days":7,"price_cents":2700}]'),

('doona-infant-car-seat-latch-base-rental', 'Doona Infant Car Seat & Latch Base', 'Rent the Doona Infant Car Seat & Latch Base. Choose your rental length at checkout.',
  'https://cdn.shopify.com/s/files/1/0732/0987/2523/files/discover-doona.jpg?v=1783785906', 1,
  '[{"label":"1 Day","days":1,"price_cents":2700},{"label":"3 Days","days":3,"price_cents":6800},{"label":"1 Week","days":7,"price_cents":12200}]'),

('hatch-rest-2nd-gen-dream-machine-rental', 'Hatch Rest 2nd Gen Dream Machine', 'Rent the Hatch Rest 2nd Gen Dream Machine. Choose your rental length at checkout.',
  'https://cdn.shopify.com/s/files/1/0732/0987/2523/files/1769809446-baby-carousel-putty-1-v2.webp?v=1783785930', 1,
  '[{"label":"1 Day","days":1,"price_cents":500},{"label":"3 Days","days":3,"price_cents":1300},{"label":"1 Week","days":7,"price_cents":2300}]'),

('keekaroo-peanut-changer-rental', 'Keekaroo Peanut Changer', 'Rent the Keekaroo Peanut Changer. Choose your rental length at checkout.',
  'https://cdn.shopify.com/s/files/1/0732/0987/2523/files/Keekaroo-Peanut-Changer-Vanilla_4c7943f5-e848-4aa8-94fe-80b08a5d416e.4d283a1d4c90f1a3d6fe7b12b0ad39c6.jpg?v=1783785952', 1,
  '[{"label":"1 Day","days":1,"price_cents":500},{"label":"3 Days","days":3,"price_cents":1300},{"label":"1 Week","days":7,"price_cents":2300}]'),

('maxi-cosi-kori-2-in-1-rocker-rental', 'Maxi-Cosi Kori 2-in-1 Rocker', 'Rent the Maxi-Cosi Kori 2-in-1 Rocker. Choose your rental length at checkout.',
  'https://cdn.shopify.com/s/files/1/0732/0987/2523/files/BN108HNY_01.jpg?v=1783785963', 1,
  '[{"label":"1 Day","days":1,"price_cents":600},{"label":"3 Days","days":3,"price_cents":1500},{"label":"1 Week","days":7,"price_cents":2700}]'),

('angelcare-baby-bath-support-rental', 'Angelcare Baby Bath Support', 'Rent the Angelcare Baby Bath Support. Choose your rental length at checkout.',
  'https://cdn.shopify.com/s/files/1/0732/0987/2523/files/I000548_EN_01_2000x2000_8b2c4cc5-c615-4be4-9c12-c015796388a3.jpg?v=1783785976', 1,
  '[{"label":"1 Day","days":1,"price_cents":400},{"label":"3 Days","days":3,"price_cents":1000},{"label":"1 Week","days":7,"price_cents":1800}]'),

('asweets-wonder-wise-activity-board-rental', 'Wonder & Wise Awesome Activity Walker', 'A wooden push walker with shape sorter, mirror, bead maze, abacus, and counting blocks.',
  'https://cdn.shopify.com/s/files/1/0732/0987/2523/files/baby-walker_b96b4e0a-0eb7-41c4-846a-cf3a82a7511d.jpg?v=1783787160', 1,
  '[{"label":"1 Day","days":1,"price_cents":400},{"label":"3 Days","days":3,"price_cents":1000},{"label":"1 Week","days":7,"price_cents":1800}]')

on conflict (id) do nothing;
