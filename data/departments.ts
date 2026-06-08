// data/departments.ts

export interface Department {
  id: string;
  name: string;
  category: string;
}

export const departments: Department[] = [
  // Engineering & Technology
  { id: "civil-engineering", name: "Civil Engineering", category: "Engineering" },
  { id: "mechanical-engineering", name: "Mechanical Engineering", category: "Engineering" },
  { id: "electrical-engineering", name: "Electrical Engineering", category: "Engineering" },
  { id: "software-engineering", name: "Software Engineering", category: "Engineering" },
  { id: "computer-science", name: "Computer Science", category: "Engineering" },
  { id: "chemical-engineering", name: "Chemical Engineering", category: "Engineering" },
  { id: "industrial-engineering", name: "Industrial Engineering", category: "Engineering" },
  
  // Health Sciences
  { id: "medicine", name: "Medicine", category: "Health Sciences" },
  { id: "pharmacy", name: "Pharmacy", category: "Health Sciences" },
  { id: "nursing", name: "Nursing", category: "Health Sciences" },
  { id: "public-health", name: "Public Health", category: "Health Sciences" },
  { id: "dentistry", name: "Dentistry", category: "Health Sciences" },
  { id: "veterinary-medicine", name: "Veterinary Medicine", category: "Health Sciences" },
  { id: "medical-laboratory", name: "Medical Laboratory Science", category: "Health Sciences" },
  
  // Business & Economics
  { id: "business-administration", name: "Business Administration", category: "Business" },
  { id: "accounting", name: "Accounting", category: "Business" },
  { id: "economics", name: "Economics", category: "Business" },
  { id: "marketing", name: "Marketing", category: "Business" },
  { id: "finance", name: "Finance", category: "Business" },
  { id: "management", name: "Management", category: "Business" },
  
  // Natural Sciences
  { id: "biology", name: "Biology", category: "Natural Sciences" },
  { id: "chemistry", name: "Chemistry", category: "Natural Sciences" },
  { id: "physics", name: "Physics", category: "Natural Sciences" },
  { id: "mathematics", name: "Mathematics", category: "Natural Sciences" },
  { id: "statistics", name: "Statistics", category: "Natural Sciences" },
  
  // Social Sciences & Humanities
  { id: "law", name: "Law", category: "Social Sciences" },
  { id: "political-science", name: "Political Science", category: "Social Sciences" },
  { id: "psychology", name: "Psychology", category: "Social Sciences" },
  { id: "sociology", name: "Sociology", category: "Social Sciences" },
  { id: "history", name: "History", category: "Social Sciences" },
  { id: "geography", name: "Geography", category: "Social Sciences" },
  { id: "english", name: "English", category: "Humanities" },
  { id: "journalism", name: "Journalism & Communication", category: "Humanities" },
  
  // Agriculture
  { id: "agriculture", name: "Agriculture", category: "Agriculture" },
  { id: "horticulture", name: "Horticulture", category: "Agriculture" },
  { id: "animal-science", name: "Animal Science", category: "Agriculture" },
  { id: "agribusiness", name: "Agribusiness", category: "Agriculture" },
  
  // Education
  { id: "education", name: "Education", category: "Education" },
  { id: "teaching-english", name: "Teaching English as a Foreign Language", category: "Education" },
  { id: "educational-leadership", name: "Educational Leadership", category: "Education" },
  
  // Information Technology
  { id: "information-technology", name: "Information Technology", category: "IT" },
  { id: "information-systems", name: "Information Systems", category: "IT" },
  { id: "data-science", name: "Data Science", category: "IT" },
  { id: "cybersecurity", name: "Cybersecurity", category: "IT" },
  
  // Other
  { id: "architecture", name: "Architecture", category: "Other" },
  { id: "urban-planning", name: "Urban Planning", category: "Other" },
  { id: "social-work", name: "Social Work", category: "Other" },
  { id: "theology", name: "Theology", category: "Other" },
];

// Get all departments
export const getAllDepartments = () => departments;

// Get departments by category
export const getDepartmentsByCategory = (category: string) => {
  return departments.filter(dept => dept.category === category);
};

// Get unique categories
export const getDepartmentCategories = () => {
  const categories = [...new Set(departments.map(dept => dept.category))];
  return categories.sort();
};