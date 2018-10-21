# PZ2018
Projekt zespołowy 2018 - UG Informatyka II 1 rok
Autorzy: Martyna Pyszyńska & Mateusz Drywa

Temat projektu: MikroFacebook - mały serwis społecznościowy.

Założenia projektu:
Replikacja w ramach innej technologii już istniejącego portalu społecznościowego.
Zakres projektu obejmuje podstawowe funkcjonalności dotępne w portalu "Facebook" takie jak;

- Wyszukiwarka znajomych
- Krąg znajomych (zaproszenia do kręgu znajomych, lista znajomych) i statusy (Dostępny, Niedostępny),
- Tablica (możliwość przeglądania tablic znajomych oraz swojej), 
- "Like`i" - polubienia postów
- Udostępnianie postów znajomych na własnej tablicy
- Powiadomienia (Znajomy udostępnił nowy post na swojej tablicy, dostaliśmy nową wiadomość itd...),
- Wiadomości prywatne i grupowe,
- Grupy (zapraszanie do grup, posty na grupach)

Stos technologiczny projektu: MSSQL, C#/.NET, Angular6, Socket.io

Podział & zakres obowiązków w projekcie:

Backend : Mateusz Drywa
- Zaprojektowanie i wdrożenie relacyjnej bazy danych MSSQL
- Zaprojektowanie i wdrożenie RESTful API pozwalającego na kontakt z bazą danych z poziomu aplikacji webowej
    - Autoryzacja użytkowników oparta o tokeny. 
    - Zapis/odczyt danych oraz ich transfer z/do bazy danych w formacie JSON.
- Zapewnienie spójności danych w całym systemie.
- Pomoc przy rozwijaniu middleware dla aplikacji webowej.

Frontend : Martyna Pyszyńska
- Rozwój aplikacji webowej tzw. middleware odpowiadającego za kontakt aplikacji z RESTful API oraz przekazywaniem danych do klienta
- Kontrola wprowadzanych danych (walidacja)
- Zaprojektowanie i wdrożenie wyglądu aplikacji webowej


