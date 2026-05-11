/*
  MOCK PET DATA
  --------------
  This is temporary data we use while the backend is not connected.
  
  In Phase 3, we replace getAllPets() with a real API call:
    GET http://localhost:5052/api/pets
  
  The shape of this data matches what the real backend returns
  so switching over will be seamless.

  Using real image URLs so the cards look beautiful.
*/

export const pets = [
  {
    id: 1,
    ownerId: 101,
    ownerName: "Cairo Animal Shelter",
    name: "Max",
    type: "dog",
    breed: "Golden Retriever",
    age: 2,
    gender: "Male",
    healthStatus: "Vaccinated, Neutered",
    description: "Max is a friendly, energetic boy who loves kids and other dogs. He's house-trained and knows basic commands.",
    location: "Cairo, Egypt",
    imageUrl: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop",
    status: "Available",
  },
  {
    id: 2,
    ownerId: 102,
    ownerName: "Giza Pet Rescue",
    name: "Luna",
    type: "cat",
    breed: "Persian",
    age: 1,
    gender: "Female",
    healthStatus: "Healthy, Vaccinated",
    description: "Luna is a calm and affectionate Persian who loves cuddles and nap time. Perfect for a quiet home.",
    location: "Giza, Egypt",
    imageUrl: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=300&fit=crop",
    status: "Available",
  },
  {
    id: 3,
    ownerId: 101,
    ownerName: "Cairo Animal Shelter",
    name: "Rocky",
    type: "dog",
    breed: "German Shepherd",
    age: 3,
    gender: "Male",
    healthStatus: "Needs vaccination",
    description: "Rocky is loyal, protective, and very intelligent. He needs an experienced dog owner.",
    location: "Alexandria, Egypt",
    imageUrl: "https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=400&h=300&fit=crop",
    status: "Adopted",
  },
  {
    id: 4,
    ownerId: 103,
    ownerName: "Happy Paws",
    name: "Bella",
    type: "rabbit",
    breed: "Holland Lop",
    age: 1,
    gender: "Female",
    healthStatus: "Healthy",
    description: "Bella is a sweet, lop-eared rabbit who loves fresh veggies and gentle petting.",
    location: "Cairo, Egypt",
    imageUrl: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=400&h=300&fit=crop",
    status: "Available",
  },
  {
    id: 5,
    ownerId: 104,
    ownerName: "Wings & Things",
    name: "Kiwi",
    type: "bird",
    breed: "African Grey Parrot",
    age: 2,
    gender: "Male",
    healthStatus: "Healthy",
    description: "Kiwi is a talkative and smart parrot who can mimic words and loves interaction.",
    location: "Giza, Egypt",
    imageUrl: "https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=400&h=300&fit=crop",
    status: "Available",
  },
  {
    id: 6,
    ownerId: 105,
    ownerName: "Purrfect Home",
    name: "Milo",
    type: "cat",
    breed: "British Shorthair",
    age: 4,
    gender: "Male",
    healthStatus: "Vaccinated, Neutered",
    description: "Milo is a laid-back and gentle cat who gets along well with children and other cats.",
    location: "Cairo, Egypt",
    imageUrl: "https://images.unsplash.com/photo-1555685812-4b943f1cb0eb?w=400&h=300&fit=crop",
    status: "Pending",
  },
];