<div align="center">

# 🐾 PetAdopt Platform

> *Connecting hearts. Saving lives. Finding forever homes.*

[![.NET](https://img.shields.io/badge/.NET-8.0-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)](https://dotnet.microsoft.com/)
[![EF Core](https://img.shields.io/badge/EF_Core-Latest-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)](https://docs.microsoft.com/ef/)
[![SQL Server](https://img.shields.io/badge/SQL_Server-CC2927?style=for-the-badge&logo=microsoftsqlserver&logoColor=white)](https://www.microsoft.com/sql-server)
[![ASP.NET Core](https://img.shields.io/badge/ASP.NET_Core-REST_API-0078D4?style=for-the-badge&logo=dotnet&logoColor=white)](https://dotnet.microsoft.com/apps/aspnet)
[![SignalR](https://img.shields.io/badge/SignalR-Real--Time-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)](https://dotnet.microsoft.com/apps/aspnet/signalr)
[![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)

<br/>

![Platform Banner](https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12&height=180&section=header&text=PetAdopt%20Platform&fontSize=42&fontAlignY=35&desc=Built%20with%20ASP.NET%20Core%20%7C%20Clean%20Architecture&descAlignY=55&descAlign=50)

</div>

---

## 📖 Table of Contents

- [✨ About The Project](#-about-the-project)
- [⚡ Features](#-features)
- [🏗️ Architecture](#️-architecture)
- [📂 Project Structure](#-project-structure)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Getting Started](#-getting-started)
- [📡 API Endpoints](#-api-endpoints)
- [🔔 Real-Time Notifications](#-real-time-notifications)
- [🤝 Contributing](#-contributing)

---

## ✨ About The Project

A full-featured, production-ready **Pet Adoption Management System**
built on top of **ASP.NET Core** using a clean **3-Tier N-Layer Architecture**.

Whether you are an adopter looking for your next furry friend, a shelter managing
pet listings, or an admin overseeing the entire platform — PetAdopt has you covered
with a secure, scalable, and maintainable backend API powered by **real-time
notifications** via SignalR.

> 💡 *This project was built with real-world design patterns, clean code principles,
> and industry-standard practices in mind.*

---

## ⚡ Features

<table>
  <tr>
    <td>

### 👥 User Management
- ✅ Multi-role system (Admin / Shelter / PetOwner / Adopter)
- ✅ JWT-based Authentication & Authorization
- ✅ Admin approval for Shelter & PetOwner accounts
- ✅ Profile management & password change

### 🐶 Pet Management
- ✅ Full CRUD for pet listings
- ✅ Admin approval before going public
- ✅ Multiple images per pet with primary image
- ✅ Advanced search (type, breed, age, location)
- ✅ Soft Delete for pet posts

### 📋 Adoption System
- ✅ Adopters can submit adoption requests
- ✅ Adopter history & veterinary references
- ✅ Owner can accept or reject requests
- ✅ Auto-reject other requests on acceptance
- ✅ Pet status lifecycle (Available → Pending → Adopted)

  </td>
    <td>

### 🔔 Real-Time Notifications
- ✅ SignalR-powered live notifications
- ✅ Notify owner on new adoption request
- ✅ Notify adopter on request accepted/rejected
- ✅ Notify owner on pet post approval/rejection
- ✅ Notify user on account approval/rejection

### ❤️ Favorites & Reviews
- ✅ Adopters can save pets to favorites
- ✅ Verified reviews (only after successful adoption)
- ✅ Star ratings with averages & distribution
- ✅ Public owner profile with reviews

### 🛡️ Data Integrity
- ✅ Soft Delete across core entities
- ✅ Unique constraints on critical operations
- ✅ Role-based access control per endpoint

  </td>
  </tr>
</table>

---

## 🏗️ Architecture

This project follows a clean **3-Tier N-Layer Architecture** ensuring a strict separation of concerns:
```
┌─────────────────────────────────────────────────────────┐
│ CLIENT / FRONTEND (React)                               │
└───────────────────────────┬─────────────────────────────┘
                 HTTP Requests + SignalR
┌───────────────────────────▼─────────────────────────────┐
│ 1- API LAYER (Presentation)                             │
│ Controllers • Hubs • Auth • NotificationService         │
└───────────────────────────┬─────────────────────────────┘
                          Calls
┌───────────────────────────▼─────────────────────────────┐
│ 2- BUSINESS LOGIC LAYER (BLL)                           │
│ Services • DTOs • Interfaces                            │
└───────────────────────────┬─────────────────────────────┘
                      Reads / Writes
┌───────────────────────────▼─────────────────────────────┐
│ 3- DATA ACCESS LAYER (DAL)                              │
│ Repositories • EF Core • Configurations • Models        │
└───────────────────────────┬─────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│ SQL SERVER DB                                          │
└────────────────────────────────────────────────────────┘
```
## 🔑 Design Patterns Used

| Pattern | Where Used |
|---|---|
| 🏛️ **Repository Pattern** | DAL Layer — abstracts database queries |
| 📦 **DTO Pattern** | BLL Layer — decouples API from domain models |
| 🏭 **Service Pattern** | BLL Layer — encapsulates business logic |
| 🔧 **Fluent API Configuration** | DAL Layer — entity relationship mapping |
| 🗑️ **Soft Delete Pattern** | DAL Layer — logical deletion |
| 🔔 **Observer Pattern** | SignalR — real-time event notifications |

---

## 📂 Project Structure
```
Pet-Adopt/
├── 📁 BackEnd/
│   ├── 📄 PetAdopt.slnx
│   │
│   ├── 📁 PetAdopt.API/
│   │   ├── 📄 Program.cs
│   │   ├── 📄 appsettings.json
│   │   ├── 📄 appsettings.Development.json
│   │   ├── 📄 PetAdopt.API.csproj
│   │   ├── 📄 PetAdopt.API.http
│   │   ├── 🔧 dotnet-tools.json
│   │   │
│   │   ├── 📁 Controllers/
│   │   │   ├── 🎮 BaseController.cs
│   │   │   ├── 🎮 AdminController.cs
│   │   │   ├── 🎮 AuthController.cs
│   │   │   ├── 🎮 PetsController.cs
│   │   │   ├── 🎮 UserController.cs
│   │   │   ├── 🎮 AdoptionController.cs
│   │   │   ├── 🎮 FavoritesController.cs
│   │   │   ├── 🎮 ReviewsController.cs
│   │   │   ├── 🎮 NotificationsController.cs
│   │   │   └── 🎮 AdopterHistoryController.cs
│   │   │
│   │   ├── 📁 Hubs/
│   │   │   ├── 📡 NotificationHub.cs
│   │   │   └── 📡 NotificationService.cs
│   │   │
│   │   ├── 📁 Exceptions/
│   │   │   └── ⚠️ GlobalExceptionHandler.cs
│   │   │
│   │   ├── 📁 Extensions/
│   │   │   ├── ⚙️ ApplicationBuilder.cs
│   │   │   └── ⚙️ AppServicesBuilder.cs
│   │   │
│   │   └── 📁 Properties/
│   │       ├── 📄 launchSettings.json
│   │       └── 📁 PublishProfiles/
│   │
│   │
│   ├── 📁 PetAdopt.BLL/
│   │   ├── 📄 PetAdopt.BLL.csproj
│   │   │
│   │   ├── 📁 DTOs/
│   │   │   ├── 📁 Auth/
│   │   │   ├── 📁 User/
│   │   │   ├── 📁 Pet/
│   │   │   ├── 📁 PetImage/
│   │   │   ├── 📁 Favorite/
│   │   │   ├── 📁 Review/
│   │   │   ├── 📁 AdoptionRequest/
│   │   │   ├── 📁 AdopterHistory/
│   │   │   └── 📁 Notification/
│   │   │
│   │   └── 📁 Services/
│   │       ├── 📁 Interfaces/
│   │       │   ├── 🔌 IAuthService.cs
│   │       │   ├── 🔌 IUserService.cs
│   │       │   ├── 🔌 IPetService.cs
│   │       │   ├── 🔌 IFavoriteService.cs
│   │       │   ├── 🔌 IReviewService.cs
│   │       │   ├── 🔌 IAdoptionRequestService.cs
│   │       │   ├── 🔌 IAdopterHistoryService.cs
│   │       │   └── 🔌 INotificationService.cs
│   │       │
│   │       └── 📁 Implementations/
│   │           ├── 🔧 AuthService.cs
│   │           ├── 🔧 UserService.cs
│   │           ├── 🔧 PetService.cs
│   │           ├── 🔧 FavoriteService.cs
│   │           ├── 🔧 ReviewService.cs
│   │           ├── 🔧 AdoptionRequestService.cs
│   │           └── 🔧 AdopterHistoryService.cs
│   │
│   │
│   └── 📁 PetAdopt.DAL/
│       ├── 📄 PetAdopt.DAL.csproj
│       │
│       ├── 📁 Data/
│       │   ├── 🗄️ AppDbContext.cs
│       │   ├── 🗄️ DbInitializer.cs
│       │   └── 📁 Configurations/
│       │       ├── ⚙️ ApplicationUserConfiguration.cs
│       │       ├── ⚙️ PetConfiguration.cs
│       │       ├── ⚙️ PetImageConfiguration.cs
│       │       ├── ⚙️ FavoriteConfiguration.cs
│       │       ├── ⚙️ ReviewConfiguration.cs
│       │       ├── ⚙️ AdoptionRequestConfiguration.cs
│       │       ├── ⚙️ AdopterHistoryConfiguration.cs
│       │       └── ⚙️ NotificationConfiguration.cs
│       │
│       ├── 📁 Models/
│       │   ├── 📦 ApplicationUser.cs
│       │   ├── 📦 Pet.cs
│       │   ├── 📦 PetImage.cs
│       │   ├── 📦 Favorite.cs
│       │   ├── 📦 Review.cs
│       │   ├── 📦 AdoptionRequest.cs
│       │   ├── 📦 AdopterHistory.cs
│       │   └── 📦 Notification.cs
│       │
│       ├── 📁 Repositories/
│       │   ├── 📁 Interfaces/
│       │   │   ├── 🔌 IGenericRepository.cs
│       │   │   ├── 🔌 IPetRepository.cs
│       │   │   ├── 🔌 IFavoriteRepository.cs
│       │   │   ├── 🔌 IReviewRepository.cs
│       │   │   ├── 🔌 IAdoptionRequestRepository.cs
│       │   │   ├── 🔌 IAdopterHistoryRepository.cs
│       │   │   └── 🔌 INotificationRepository.cs
│       │   │
│       │   └── 📁 Implementations/
│       │       ├── 🔧 GenericRepository.cs
│       │       ├── 🔧 PetRepository.cs
│       │       ├── 🔧 FavoriteRepository.cs
│       │       ├── 🔧 ReviewRepository.cs
│       │       ├── 🔧 AdoptionRequestRepository.cs
│       │       ├── 🔧 AdopterHistoryRepository.cs
│       │       └── 🔧 NotificationRepository.cs
│       │
│       ├── 📁 Migrations/
│       │   ├── 📜 20260407105658_InitialCreate.cs
│       │   ├── 📜 20260407105658_InitialCreate.Designer.cs
│       │   ├── 📜 20260410113002_LightPetBinding.cs
│       │   ├── 📜 20260410113002_LightPetBinding.Designer.cs
│       │   ├── 📜 20260416073522_AddNotificationFeature.cs
│       │   ├── 📜 20260416073522_AddNotificationFeature.Designer.cs
│       │   └── 📜 AppDbContextModelSnapshot.cs
│       │
│       └── 📁 Pagination/
```
---

## 🛠️ Tech Stack

<div align="center">

| Category | Technology |
|---|---|
| **Framework** | ASP.NET Core 8 |
| **ORM** | Entity Framework Core |
| **Database** | Microsoft SQL Server |
| **Authentication** | ASP.NET Core Identity + JWT Bearer |
| **Real-Time** | SignalR |
| **API Style** | RESTful API |
| **Architecture** | 3-Tier N-Layer |
| **Patterns** | Repository, DTO, Service, Soft Delete |
| **Migration Tool** | EF Core Migrations |

</div>

---

## 🚀 Getting Started

### ✅ Prerequisites

- .NET 8.0 SDK
- SQL Server (or Express)
- Visual Studio 2022 / VS Code
- Git

---

### 📥 Installation

**1. Clone the repository**

```bash
git clone https://github.com/yourusername/PetAdopt.git
cd PetAdopt
```

**2. Configure the database connection**
```json 
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=.;Database=PetAdoptDB;Trusted_Connection=True;TrustServerCertificate=True"
  },
  "JWT": {
    "Key": "YOUR_SUPER_SECRET_KEY_HERE_MIN_32_CHARS",
    "Issuer": "PetAdoptAPI",
    "Audience": "PetAdoptClient"
  }
}
```
**3. Apply migrations**
```bash
dotnet ef database update --project PetAdopt.DAL --startup-project PetAdopt.API
```
**4. Run the app**
```bash
dotnet run --project PetAdopt.API
```
**5. Open Swagger**
```bash
(http://localhost:5052/swagger)
```

## 📡 API Endpoints

### 🔐 Auth
| Module | Method | Endpoint | Auth | Description |
|--------|--------|----------|------|-------------|
| 🔐 Auth | POST | /api/auth/register | ❌ | Register new user |
| 🔐 Auth | POST | /api/auth/login | ❌ | Login |

### 👤 User
| Module | Method | Endpoint | Auth | Description |
|--------|--------|----------|------|-------------|
| 👤 User | GET | /api/user/profile | ✅ All | Get my profile |
| 👤 User | PUT | /api/user/profile | ✅ All | Update profile |
| 👤 User | PUT | /api/user/change-password | ✅ All | Change password |

### 🐶 Pets
| Module | Method | Endpoint | Auth | Description |
|--------|--------|----------|------|-------------|
| 🐶 Pets | GET | /api/pets | ❌ | Browse all pets |
| 🐶 Pets | GET | /api/pets/{id} | ❌ | Get pet details |
| 🐶 Pets | GET | /api/pets/search | ❌ | Search pets |
| 🐶 Pets | GET | /api/pets/my-pets | ✅ Owner | Get my pets |
| 🐶 Pets | POST | /api/pets | ✅ Owner | Create pet post |
| 🐶 Pets | PUT | /api/pets/{id} | ✅ Owner | Update pet post |
| 🐶 Pets | DELETE | /api/pets/{id} | ✅ Owner | Delete pet post |

### 📋 Adoption
| Module | Method | Endpoint | Auth | Description |
|--------|--------|----------|------|-------------|
| 📋 Adoption | POST | /api/adoption/request | ✅ Adopter | Submit request |
| 📋 Adoption | GET | /api/adoption/my-requests | ✅ Adopter | My requests |
| 📋 Adoption | GET | /api/adoption/pet/{id}/requests | ✅ Owner | View requests |
| 📋 Adoption | PUT | /api/adoption/request/{id}/accept | ✅ Owner | Accept request |
| 📋 Adoption | PUT | /api/adoption/request/{id}/reject | ✅ Owner | Reject request |

### ❤️ Favorites
| Module | Method | Endpoint | Auth | Description |
|--------|--------|----------|------|-------------|
| ❤️ Favorites | GET | /api/favorites | ✅ Adopter | My favorites |
| ❤️ Favorites | POST | /api/favorites/{petId} | ✅ Adopter | Add to favorites |
| ❤️ Favorites | DELETE | /api/favorites/{petId} | ✅ Adopter | Remove favorite |

### ⭐ Reviews
| Module | Method | Endpoint | Auth | Description |
|--------|--------|----------|------|-------------|
| ⭐ Reviews | POST | /api/reviews | ✅ Adopter | Submit review |
| ⭐ Reviews | GET | /api/reviews/owner/{ownerId} | ❌ | Owner reviews |

### 📜 History
| Module | Method | Endpoint | Auth | Description |
|--------|--------|----------|------|-------------|
| 📜 History | GET | /api/adopterhistory | ✅ Adopter | My history |
| 📜 History | POST | /api/adopterhistory | ✅ Adopter | Add history |
| 📜 History | DELETE | /api/adopterhistory/{id} | ✅ Adopter | Delete history |

### 🛡️ Admin
| Module | Method | Endpoint | Auth | Description |
|--------|--------|----------|------|-------------|
| 🛡️ Admin | GET | /api/admin/pending-users | ✅ Admin | Pending accounts |
| 🛡️ Admin | PUT | /api/admin/approve-user/{id} | ✅ Admin | Approve account |
| 🛡️ Admin | PUT | /api/admin/reject-user/{id} | ✅ Admin | Reject account |
| 🛡️ Admin | GET | /api/admin/pending-pets | ✅ Admin | Pending pet posts |
| 🛡️ Admin | PUT | /api/admin/approve-pet/{id} | ✅ Admin | Approve pet post |
| 🛡️ Admin | PUT | /api/admin/reject-pet/{id} | ✅ Admin | Reject pet post |

---
## 🔔 Real-Time Notifications

Powered by **ASP.NET Core SignalR**, the platform delivers instant notifications.

### 📡 Notification Events

| Event | Trigger | Receiver |
|------|--------|----------|
| 🐾 NewAdoptionRequest | Adopter submits request | 🏠 Owner |
| ✅ RequestAccepted | Owner accepts request | 🙋 Adopter |
| ❌ RequestRejected | Owner rejects request | 🙋 Adopter |
| ✅ PetApproved | Admin approves pet post | 🏠 Owner |
| ❌ PetRejected | Admin rejects pet post | 🏠 Owner |
| ✅ AccountApproved | Admin approves account | 👤 User |
| ❌ AccountRejected | Admin rejects account | 👤 User |

---
### 🐾 Pet Status Lifecycle
```
Owner Creates Post
       │
       ▼
  IsApproved = false
  (Hidden from public)
       │
       ▼
  Admin Reviews
       │
  ┌────┴────┐
  ✅         ❌
  │           │
  ▼           ▼
Public     Deleted
Available
  │
  ▼
Adopter Applies
  │
  ▼
Status = Pending
  │
  ├── Owner Accepts ──► Status = Adopted
  │                     Other Requests → Rejected
  │
  └── Owner Rejects ──► Status = Available (if no more requests)
```
## 🤝 Contributing

```
1. Fork
2. Create branch (feature/AmazingFeature)
3. Commit
4. Push
5. Open PR
```
<div align="center">
<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=100&section=footer" width="100%"/>
⭐ If you like this project, give it a star!

</div>
