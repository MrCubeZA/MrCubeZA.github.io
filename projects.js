/**
 * Data-driven project list for Timothy Miller's portfolio.
 *
 * To add a project, append one object to PROJECTS (or TEAM_PROJECTS).
 * The Projects window, Visual Studio solution explorer, Profile.cs view
 * and the mobile layout all read from this file — no HTML edits needed.
 *
 * Required fields: id, name, short, description, tech, featured, icon, iconClass
 * Optional: repo (public URL only), image, imageCaption, highlights, planned,
 *           status, note, flagship, cardImage, iconImage
 *
 * Never add a repo URL for a private repository.
 */
window.PROJECTS = [
  {
    id: "tomus",
    name: "Tomus",
    featured: true,
    flagship: true,
    short: "Free, ad-free Android reader for PDFs already on your phone. In development.",
    description:
      "Tomus: Reader App is a free, ad-free Android reading app, built in C# with .NET MAUI. The name comes from the Latin tomus, meaning “a volume.” The aim is one app for legal manga, web novels, comics, books, and files you already have on your phone — designed with modest devices in mind (a 2 GB Android phone is the stated target). Today it is a private prototype in active development, and it has not been published yet. You can open PDFs already on the phone, keep them in a local library, resume where you left off, and use Read Aloud. Files stay on the device and are never uploaded. The in-app catalogue is still empty.",
    highlights: [
      "Open your own PDFs through the system file picker; nothing is uploaded",
      "Local library shelf with square tiles",
      "Continue Reading resumes on the last page you were on",
      "Remove a title from the library without deleting the original file on the phone",
      "Rename the display name in the library (the file itself is unchanged)",
      "Read Aloud with Android’s built-in text-to-speech, including play, pause and stop from the notification shade and lock screen",
      "Dark or light app chrome; PDF pages stay as they appear in the file and are never tinted",
      "A shelf menu for All, Books, Comics, Manga, Web novels, Webtoons and My files — only All and My files list opened PDFs today; the other shelves are empty placeholders"
    ],
    planned: [
      "More local formats: CBZ, image folders, EPUB and plain TXT (CBR and MOBI later)",
      "A legal, credited catalogue of manga, web novels, comics and books (the catalogue is empty today)",
      "A Reading Stats screen",
      "A full text-reading mode for text PDFs",
      "Optional Reader Plus later, limited to saving catalogue works for offline use — not planned as a paywall for content"
    ],
    tech: ["C#", ".NET MAUI", "Android", "SQLite", "PdfPig"],
    status: "In development — private prototype, not published yet",
    note: "Source code is private. This page is a showcase only — there is no public repository link.",
    image: "assets/images/tomus-art.jpg",
    imageCaption: "Stylized brand art in Tomus’s documented nebula-purple and gold palette. No device screenshots were available to include.",
    cardImage: "assets/images/tomus-art.jpg",
    iconImage: "assets/images/tomus-icon.png",
    icon: "T",
    iconClass: "i-tomus"
  },
  {
    id: "offline-shopping",
    name: "Offline Shopping App",
    featured: true,
    short: "Offline store with catalogue, cart and checkout on a local SQLite database.",
    description:
      "Offline store app: pick a customer, browse a product catalogue, add to cart with stock validation, and check out into orders that lower stock. Built on an ERD-designed SQLite database, MVVM ViewModels with async commands, Shell navigation with parameters and dependency injection; targets .NET 10 (Android).",
    highlights: [
      "Select a customer (no login) and browse products by category, price and stock",
      "Add a validated quantity to the cart; you cannot add more than the stock available",
      "Checkout creates an order, copies line prices, lowers stock and clears the cart",
      "Works fully offline with SQLite (sqlite-net-pcl)"
    ],
    tech: [".NET MAUI", "MVVM", "SQLite", "XAML", "C#"],
    repo: "https://github.com/MrCubeZA/OfflineShoppingApp",
    image: "assets/images/shopping-erd.png",
    imageCaption: "Entity-relationship diagram from the public project repository.",
    icon: "OS",
    iconClass: "i-shop"
  },
  {
    id: "netflix-clone",
    name: "Netflix Clone",
    featured: true,
    short: "A Netflix-style UI recreation built with .NET MAUI and XAML.",
    description:
      "A Netflix-style UI recreation built with .NET MAUI / XAML layouts and controls (course Assignment 10). The brief was to approximate the look and navigation of a favourite mobile app using only the base MAUI controls.",
    tech: [".NET MAUI", "XAML", "C#"],
    note: "Source lives in the private GitHub repository MauiControlAssignment, so it is listed here without a public link.",
    icon: "N",
    iconClass: "i-flix"
  },
  {
    id: "smart-devices",
    name: "Smart Devices",
    featured: false,
    short: "Object-oriented smart-home device library with energy reporting.",
    description:
      "Smart-home device library with an abstract Device / SwitchableDevice class hierarchy, polymorphic reports and a 24-hour kWh energy simulation.",
    tech: ["C#", "OOP"],
    note: "Coursework in a private GitHub repository, listed without a public link.",
    icon: "SD",
    iconClass: "i-dev"
  },
  {
    id: "hangman",
    name: "Hangman",
    featured: false,
    short: "Object-oriented Hangman console game in C#.",
    description: "Object-oriented console game in C#.",
    tech: ["C#", "OOP"],
    note: "Coursework in a private GitHub repository, listed without a public link.",
    icon: "H",
    iconClass: "i-game"
  },
  {
    id: "tic-tac-toe",
    name: "Tic-Tac-Toe",
    featured: false,
    short: "Tic-Tac-Toe game written in C#.",
    description: "Tic-Tac-Toe game written in C#.",
    tech: ["C#"],
    note: "Coursework in a private GitHub repository, listed without a public link.",
    icon: "X",
    iconClass: "i-ttt"
  }
];

window.TEAM_PROJECTS = [
  {
    name: "Google Design Sprint",
    description: "Mobile app prototype addressing youth unemployment in South Africa.",
    area: "Digital Social Innovation"
  },
  {
    name: "CampusConnect",
    description: "Scrum project simulation for a campus lab-booking app.",
    area: "Digital Social Innovation"
  },
  {
    name: "Design Thinking startup concept",
    description: "Startup concept developed through a Design Thinking process.",
    area: "Digital Social Innovation"
  }
];
