# Dokumentacja Techniczna: Projekt VisitIt

## 1. Wstęp
Projekt VisitIt to aplikacja internetowa typu Fullstack, zaprojektowana w celu zarządzania podróżami jej użytkowników. System składa się z niezależnego backendu API oraz responsywnego frontendu typu SPA.

## 2. Architektura Systemu
System składa się z dwóch niezależnych części, które komunikują się za pomocą protokołu HTTP.

### Stos technologiczny
* Backend: ASP.NET Core 8.0, Entity Framework Core, SQL Server 
* Frontend: React 19, TypeScript, Vite.
* Komunikacja: REST API z obsługą autoryzacji JWT, Swagger (OpenAPI)

## Backend (.NET)

* Autoryzacja: zaimplementowano standard JWT, zapewniający bezpieczną weryfikację użytkownika za pomocą klucza SymmetricSecurityKey oraz walidację Issuer/Audience
* Swagger/OpenAPI: Swagger generuje dokumentację API, co umożliwia interaktywne testowanie endpointów 
* Zarządzanie bazą:`AppDbContext` korzysta z Entity Framework Core, przez `EnsureCreatedAsync()`, struktura bazy danych jest automatycznie synchronizowana przy każdym starcie aplikacji
* CORS: skonfigurowano politykę CORS, która ogranicza dostęp do API wyłącznie do zaufanej domeny frontendu
* Dane: `AppDbContext` zarządza relacjami między modelami 

## Frontend (React/TypeScript)

* Biblioteki: do wizualizacji danych zostały wykorzystane biblioteki takie jak `react-leaflet`, `react-globe.gl` oraz `recharts`
* Routing: mechanizm `ProtectedRoute` automatycznie sprawdza uprawnienia i przekierowuje użytkowników do odpowiednich widoków
* Podział ze względu na role: 
    * `/dashboard` – dostępne dla zalogowanych użytkowników, przekierowujące do dashboardu z mapą, postami oraz kalendarzem
    * `/admin` – zabezpieczone, z podstronami do zarządzanie kontami oraz wizualizacji danych
* Komunikacja z API: `axios` obsługuje automatyczne dołączanie tokena JWT oraz mechanizm automatycznego wylogowania 

## 3. Baza Danych (Model Relacyjny)

| Tabela | Opis tabeli |
| :--- | :--- |
| **user** | Dane logowania użytkownika z relacją 1:1 do `avatar`. |
| **visited** | Status, data i rating podróży, tabela łącząca (wiele-do-wielu) |
| **entry** | Wpisy użytkownika powiązane z wizytami i zdjęciami (`photo`). |
| **country** | Słownik geograficzny wszystkich krajów |

## 4. Funkcjonalności

Moduł Autoryzacji i Bezpieczeństwa:
* Logowanie: proces autoryzacji oparty na tokenach JWT
* Zarządzanie kontami: mechanizm weryfikacji tożsamości użytkownika 
* Moderacja: możliwość blokowania użytkowników przez administratora 

Interaktywna Mapa (Map Module):
* Wykorzystuje biblioteki `react-globe.pl` do wizualizacji geograficznej odwiedzonych miejsc
* Integracja z danymi w bazie pozwala na prezentację odkrywanie przez użytkownika mapę świata

Kalendarz Podróży (Calendar Module):
* Interaktywny moduł `react-calendar`, który pozwala użytkownikom przeglądać historię swoich wypraw w ujęciu czasowym

Panel Administracyjny (Admin Dashboard):
* Statystyki: moduł `recharts` wizualizuje dane o aktywności użytkowników, liczbie odwiedzonych krajów oraz popularności destynacji
* Kontrola: administracyjne narzędzie do zarządzania listą użytkowników, z funkcją nakładania banów


## 5. Setup
1. SQL Server musi być aktywny, najpierw należy się upewnić, że tak rzeczywiście jest.
2. Zainstalowane muszę być wszystkie zależności (`npm install`), projekt uruchomia się komendą `npm run dev`.
3. API jest dostępne pod adresem `https://localhost:7201/api`.
