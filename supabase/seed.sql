-- ============================================================
-- seed.sql — Seed Data for Anuj Yadav Portfolio
-- Run after schema.sql and policies.sql
-- ============================================================

-- 1. Initial Settings
INSERT INTO settings (
  id,
  name,
  roles,
  pitch,
  about_md,
  currently_learning,
  interests,
  availability_text,
  location,
  contact_email,
  accent_color,
  social_links,
  seo,
  sections_visibility
) VALUES (
  1,
  'Anuj Yadav',
  ARRAY['Full-Stack Developer', 'ML Enthusiast', 'UI/UX Designer'],
  'Building fast, clean, and intelligent web experiences. Student at MITS Gwalior with a passion for software craftsmanship.',
  '## Hello! I am Anuj Yadav 👋\n\nI am a Computer Science & Design student at **Madhav Institute of Technology & Science (MITS), Gwalior** (2024–present).\n\n### 🛠 What I Do\nI specialize in full-stack web engineering, building responsive, accessible interfaces with modern frameworks, robust APIs, and scalable databases. I also conduct research in machine learning and deep learning, serving as **Technical Lead** at the **ML Research Club, MITS**.\n\n### 💡 Beyond the Code\nWhen I am not writing code or training neural nets, I design digital assets and visual media with the **Graphics Team at MUN Club**, participate in hackathons, and contribute to open-source software.',
  ARRAY['System Design', 'LLM Fine-tuning', 'Distributed Systems'],
  ARRAY['Artificial Intelligence', 'Open Source', 'System Design', 'UI/UX Design', 'Competitive Programming'],
  'Open to internships',
  'Gwalior, India',
  'anujyad810@gmail.com',
  '#58a6ff',
  '{"github":"https://github.com/anujyad810-dot","linkedin":"https://linkedin.com/in/anuj-yadav-01748538a","twitter":"https://x.com/anujyad810","instagram":"https://instagram.com/anujyad810","email":"anujyad810@gmail.com"}'::jsonb,
  '{"title":"Anuj Yadav | Portfolio","description":"Full-Stack Developer & ML Enthusiast"}'::jsonb,
  '{"projects":true,"skills":true,"experience":true,"education":true,"certificates":true}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  roles = EXCLUDED.roles,
  pitch = EXCLUDED.pitch,
  about_md = EXCLUDED.about_md,
  currently_learning = EXCLUDED.currently_learning,
  interests = EXCLUDED.interests,
  availability_text = EXCLUDED.availability_text,
  location = EXCLUDED.location,
  contact_email = EXCLUDED.contact_email,
  social_links = EXCLUDED.social_links;

-- 2. Skill Groups
INSERT INTO skill_groups (id, name, sort_order) VALUES
  ('00000000-0000-0000-0000-000000000001', 'frontend', 1),
  ('00000000-0000-0000-0000-000000000002', 'backend', 2),
  ('00000000-0000-0000-0000-000000000003', 'database', 3),
  ('00000000-0000-0000-0000-000000000004', 'ai_ml', 4),
  ('00000000-0000-0000-0000-000000000005', 'languages', 5),
  ('00000000-0000-0000-0000-000000000006', 'tools', 6)
ON CONFLICT (id) DO NOTHING;

-- 3. Skills
INSERT INTO skills (id, group_id, name, level, sort_order) VALUES
  -- Frontend
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'React', 'Strong', 1),
  ('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'TypeScript', 'Comfortable', 2),
  ('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'Tailwind CSS', 'Strong', 3),
  ('10000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 'Vite', 'Comfortable', 4),

  -- Backend
  ('10000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000002', 'Node.js', 'Strong', 1),
  ('10000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000002', 'Express', 'Strong', 2),
  ('10000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000002', 'Django', 'Comfortable', 3),

  -- Database
  ('10000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000003', 'MongoDB', 'Strong', 1),
  ('10000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000003', 'MySQL', 'Comfortable', 2),
  ('10000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000003', 'PostgreSQL', 'Comfortable', 3),

  -- AI / ML
  ('10000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000004', 'Scikit-Learn', 'Comfortable', 1),
  ('10000000-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000004', 'TensorFlow', 'Learning', 2),
  ('10000000-0000-0000-0000-000000000013', '00000000-0000-0000-0000-000000000004', 'Pandas', 'Strong', 3),

  -- Languages
  ('10000000-0000-0000-0000-000000000014', '00000000-0000-0000-0000-000000000005', 'Python', 'Strong', 1),
  ('10000000-0000-0000-0000-000000000015', '00000000-0000-0000-0000-000000000005', 'C++ (DSA)', 'Comfortable', 2),
  ('10000000-0000-0000-0000-000000000016', '00000000-0000-0000-0000-000000000005', 'JavaScript', 'Strong', 3),

  -- Tools
  ('10000000-0000-0000-0000-000000000017', '00000000-0000-0000-0000-000000000006', 'Git & GitHub', 'Strong', 1),
  ('10000000-0000-0000-0000-000000000018', '00000000-0000-0000-0000-000000000006', 'Docker', 'Learning', 2),
  ('10000000-0000-0000-0000-000000000019', '00000000-0000-0000-0000-000000000006', 'Figma', 'Comfortable', 3)
ON CONFLICT (id) DO NOTHING;

-- 4. Experience (Leadership / Clubs)
INSERT INTO experience (id, title, organisation, start_date, end_date, description_md, sort_order) VALUES
  (
    '20000000-0000-0000-0000-000000000001',
    'Technical Lead',
    'ML Research Club, MITS',
    '2024-08',
    'present',
    'Leading hands-on research and technical projects across machine learning and neural architectures.\n- Organizing interactive workshops on computer vision and predictive modeling for 100+ university students.\n- Mentoring junior peers in data science libraries, model evaluation, and competitive Kaggle challenges.',
    1
  ),
  (
    '20000000-0000-0000-0000-000000000002',
    'Graphics Team Lead',
    'MUN Club, MITS',
    '2024-08',
    'present',
    'Directing visual identity and branding for flagship Model United Nations delegations.\n- Designed branding kits, promotional posters, stage banners, and digital collateral viewed by over 500 delegates.\n- Coordinated with public relations to maintain consistent typography and visual appeal across social channels.',
    2
  )
ON CONFLICT (id) DO NOTHING;

-- 5. Education
INSERT INTO education (id, degree, institute, start_year, end_year, description, sort_order) VALUES
  (
    '30000000-0000-0000-0000-000000000001',
    'B.Tech in Computer Science & Design',
    'Madhav Institute of Technology & Science (MITS), Gwalior',
    2024,
    2028,
    'Focusing on foundational software engineering, algorithms & data structures in C++, full-stack web systems, neural networks, and modern UI/UX design heuristics.',
    1
  )
ON CONFLICT (id) DO NOTHING;

-- 6. Sample Projects
INSERT INTO projects (
  id,
  slug,
  title,
  category,
  language,
  short_description,
  outcome,
  problem_md,
  role_md,
  features,
  learned_md,
  tech,
  demo_url,
  github_url,
  featured,
  published,
  sort_order
) VALUES
  (
    '40000000-0000-0000-0000-000000000001',
    'devconnect',
    'DevConnect — Developer Collaboration Platform',
    'web',
    'tsx',
    'A full-stack collaborative social network where developers showcase open-source projects, discover peer code, and collaborate in real-time.',
    '60% increase in weekly peer discussions during university beta trial',
    'Developers often struggle to find technical peers with complementary skill sets for hackathons and open-source contributions.',
    'Architected the end-to-end full stack application using React, Node.js, Express, and MongoDB. Implemented secure JWT authentication and real-time activity streams.',
    ARRAY['Live code snippet syntax highlighting', 'Real-time peer messaging', 'Project showcases with tech tagging', 'Dark/light UI with instant search'],
    'Mastered relational-like document modeling in MongoDB, WebSockets state management, and optimized client bundle sizes.',
    ARRAY['React', 'TypeScript', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS'],
    'https://devconnect-preview.example.com',
    'https://github.com/anujyad810-dot/devconnect',
    true,
    true,
    1
  ),
  (
    '40000000-0000-0000-0000-000000000002',
    'ml-classifier',
    'Neural Image Classifier & Vision Pipeline',
    'ml',
    'py',
    'A deep convolutional neural network for multi-class image classification with data augmentation, transfer learning, and FastAPI inference.',
    'Achieved 95.4% test accuracy with low latency CPU/GPU inferencing',
    'Real-time image classification pipelines often suffer from high inferencing latencies and poor generalization on unbalanced datasets.',
    'Engineered the data augmentation pipeline in Python with Pandas and OpenCV. Trained and fine-tuned a CNN model using transfer learning, containerized with Docker.',
    ARRAY['Custom CNN layer architecture', 'Data augmentation pipeline', 'FastAPI REST inferencing endpoint', 'Docker containerized deployment'],
    'Gained deep understanding of convolutional filters, regularization methods to prevent overfitting, and production API serving.',
    ARRAY['Python', 'TensorFlow', 'FastAPI', 'Pandas', 'Docker', 'OpenCV'],
    'https://ml-vision-demo.example.com',
    'https://github.com/anujyad810-dot/ml-image-classifier',
    true,
    true,
    2
  ),
  (
    '40000000-0000-0000-0000-000000000003',
    'portfolio-v1',
    'Developer Portfolio v1',
    'web',
    'tsx',
    'My original developer portfolio showcasing projects, interactive animations, and responsive layouts.',
    'Hosted live at anuj-yad.netlify.app',
    'Needed a clean online presence to display academic achievements and software projects.',
    'Designed and implemented frontend components with React, Tailwind CSS, and Netlify continuous deployment.',
    ARRAY['Responsive mobile-first layout', 'Dark theme support', 'Interactive project cards', 'Direct contact integration'],
    'Solidified foundations in modern CSS layout algorithms, React component lifecycles, and Netlify CI/CD.',
    ARRAY['React', 'Tailwind CSS', 'JavaScript', 'Netlify'],
    'https://anuj-yad.netlify.app',
    'https://github.com/anujyad810-dot/portfolio-v1',
    false,
    true,
    3
  )
ON CONFLICT (id) DO NOTHING;

-- 7. Project <-> Skills associations
INSERT INTO project_skills (project_id, skill_id) VALUES
  ('40000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001'),
  ('40000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002'),
  ('40000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000005'),
  ('40000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000008'),
  ('40000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000011'),
  ('40000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000012'),
  ('40000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000014'),
  ('40000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001'),
  ('40000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000003')
ON CONFLICT (project_id, skill_id) DO NOTHING;

-- 8. Sample Certificates
INSERT INTO certificates (id, title, issuer, issued_on, visible, sort_order) VALUES
  (
    '50000000-0000-0000-0000-000000000001',
    'Machine Learning Specialization',
    'DeepLearning.AI / Coursera',
    '2024-09',
    true,
    1
  ),
  (
    '50000000-0000-0000-0000-000000000002',
    'Data Structures & Algorithms in C++',
    'Coding Ninjas',
    '2024-07',
    true,
    2
  )
ON CONFLICT (id) DO NOTHING;
