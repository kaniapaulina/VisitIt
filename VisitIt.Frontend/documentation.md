# Dokumentacja Techniczna: Projekt VisitIt

## 1. Wstęp
Projekt VisitIt to aplikacja internetowa typu Fullstack, zaprojektowana w celu zarządzania podróżami jej użytkowników. System składa się z niezależnego backendu API oraz responsywnego frontendu typu SPA.

## 2. Architektura Systemu
System składa się z dwóch niezależnych części, które komunikują się za pomocą protokołu HTTP.

### Tech stack
* Backend: ASP.NET Core 8.0 WebAPI (C#), Entity Framework Core 8, SQL Server LocalDB
* Frontend: React 19, TypeScript, Vite, Axios, react-globe.gl
* Komunikacja: REST API z obsługą autoryzacji JWT (JSON Web Token), dokumentacja Swagger (OpenAPI)
* Bezpieczeństwo: Autoryzacja JWT Bearer, haszowanie haseł przy użyciu algorytmu BCrypt

## Backend (.NET)

* Autoryzacja: zaimplementowano standard JWT, zapewniający bezpieczną weryfikację użytkownika za pomocą klucza SymmetricSecurityKey oraz walidację Issuer/Audience
* Swagger/OpenAPI: Swagger generuje dokumentację API, co umożliwia interaktywne testowanie endpointów 
* Zarządzanie bazą:`AppDbContext` korzysta z Entity Framework Core, przez `EnsureCreatedAsync()`, struktura bazy danych jest automatycznie synchronizowana przy każdym starcie aplikacji
* CORS: skonfigurowano politykę CORS, która ogranicza dostęp do API wyłącznie do zaufanej domeny frontendu
* Dane: `AppDbContext` zarządza relacjami między modelami 

### Kontrolery

| Kontroler | Zakres odpowiedzialności |
| **AuthController** | Logowanie, rejestracja, obsługa wyjątków bezpieczeństwa |
| **JourneysController** | CRUD podróży, upload zdjęć, filtrowanie, analityka dla admina |
| **UsersController** | Panel administracyjny, zarządzanie listą użytkowników, blokowanie kont |

### Opis klas

* Journey: przechowuje szczegóły indywidualnych wpisów podróży użytkownika, agregując informacje takie jak lokalizacja, czas trwania, dystans oraz własne notatki, przy jednoczesnym zachowaniu relacji z właścicielem (użytkownikiem); klasa ta udostępnia również specjalną, niemapowaną właściwość, która za pomocą wyrażeń regularnych dynamicznie wyodrębnia ocenę kraju bezpośrednio z pola opisu

* User: reprezentuje zarejestrowane konto w systemie, przechowujące dane uwierzytelniające, takie jak nazwa użytkownika, adres e-mail oraz skrót hasła, a także zarządzające uprawnieniami za pomocą właściwości Role, śledzące czas utworzenia konta, utrzymujące powiązanie z osobistą kolekcją wpisów Journey oraz udostępniające flagę IsBanned służącą do moderacji treści przez administratora 

* Users: stanowi klasę pomocniczą, która umożliwia przechowywanie w pamięci operacyjnej oraz dodawanie nowych instancji użytkowników do systemu

## Frontend (React/TypeScript)

* Biblioteki: do wizualizacji danych zostały wykorzystane biblioteki takie jak `react-globe.gl` oraz `recharts`.
* Routing: mechanizm `ProtectedRoute` automatycznie sprawdza uprawnienia i przekierowuje użytkowników do odpowiednich widoków
* Podział ze względu na role: 
    * `/dashboard` – dostępne dla zalogowanych użytkowników, przekierowujące do dashboardu z mapą, postami oraz kalendarzem
    * `/admin` – zabezpieczone, z podstronami do zarządzanie kontami oraz wizualizacji danych
* Komunikacja z API: `axios` obsługuje automatyczne dołączanie tokena JWT oraz mechanizm automatycznego wylogowania 
* Interceptors: każda instancja `axios` wykorzystuje interceptory do centralnego zarządzania tokenami oraz logowania diagnostycznego w konsoli przeglądarki

### Struktura Frontendu

* `components`: zawiera reużywalne elementy interfejsu (np. `Map`, `Calendar`, `ImageUpload`, `Blog`), co pozwala na separację logiki widoku
* `pages`: przechowuje główne widoki aplikacji, podzielone na moduły: `admin/` (panel administratora), `loginPage` (obsługa autoryzacji) oraz `user` (widoki dla użytkowników końcowych).
* `services`: miejsce dedykowane logice komunikacji z API, w tym konfiguracji instancji `axios` 
* `context` i `hooks`: katalogi na globalny stan aplikacji oraz niestandardowe hooki React
* `types`: przechowuje definicje typów TypeScript, zapewniając spójność danych w całym projekcie
* `ProtectedRoute.tsx`: kluczowy komponent sterujący dostępem do poszczególnych ścieżek aplikacji w oparciu o autoryzację

## Baza Danych (Model Relacyjny)

| Tabela | Opis tabeli |
| :--- | :--- |
| **user** | Przechowuje dane uwierzytelniające, role użytkowników, flagi blokad (banów) oraz metadane konta |
| **journey** | Przechowuje szczegółowe informacje o każdej podróży (lokalizacja, czas, dystans) oraz obliczany dynamicznie rating |

Relacja: Users 1 : N Journeys
Klucz obcy: UserId w tabeli Journeys wskazuje na unikalne Id w tabeli Users


## Funkcjonalności

### Moduł Autoryzacji i Bezpieczeństwa
* Logowanie i Rejestracja: proces autoryzacji oparty na bezpiecznych tokenach JWT
* Zarządzanie kontami: mechanizm weryfikacji tożsamości oraz utrzymywania sesji użytkownika
* Moderacja: administracyjna możliwość blokowania użytkowników w przypadku naruszeń

### Interaktywna Mapa (Map Module)
* Wizualizacja: wykorzystanie biblioteki `react-globe.gl` do prezentacji odwiedzonych miejsc na globie 3D
* Interakcja: klikanie w kraje umożliwia bezpośrednie dodawanie nowych wpisów o podróżach

### Kalendarz Podróży (Calendar Module)
* Narzędzie: moduł `react-calendar` pozwalający na wizualizację historii wypraw w ujęciu czasowym
* Funkcjonalność: szybkie przeglądanie aktywności i zaznaczonych dni w kalendarzu

### Edytor i Lista Podróży (Journey Management)
* Blog-style Editor: interfejs pozwalający na dodawanie opisów, ocen (1-5 gwiazdek) oraz zdjęć do każdej podróży
* Zarządzanie wpisami: lista podróży z opcją rozwijania/zwijania detali oraz usuwaniem wpisów z potwierdzeniem

### Panel Administracyjny (Admin Dashboard)
* Statystyki: moduł `recharts` wizualizuje dane o aktywności użytkowników, liczbie odwiedzonych krajów oraz popularności destynacji
* Kontrola: narzędzia do zarządzania listą użytkowników, banowania kont oraz usuwania nieodpowiednich wpisów podróży



