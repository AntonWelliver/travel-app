# Västtrafik project

I det här skolprojektet har jag skapat en reseplanerare som låter användare söka resor via Västtrafiks API. Man kan i min applikation söka på resor och, via ett gränssnitt, visa upp resultatet.

https://github.com/AntonWelliver/travel-app

# Vad behövs för att köra projektet?
1. npm install
2. En .env fil där man lägger api nycklarna man får från Västtrafik

# Krav
- Ni skall använda er av Västtrafiks auth 2 autentisering.
- Uppdatering av access_token skall göras automatiskt då giltighetstiden för en token gått ut (tips, använd er av en egen-skapad middleware).
- Autentiseringen skall gå genom ett eget api i Node (för G-nivå räcker det att ha ett API/NodeJS server som levererar en access_token).
- Samtliga hållplatser skall hämtas och sparas i en JSON-fil. Denna hämtning skall alltså inte ske varje gång man skall söka fram en resa.
- Användaren skall med hjälp av två input-fält kunna ange ”från och till” för en resa (hållplatser).
- Användaren skall kunna mata in datum och tid samt kunna välja om tiden är för avgående tid eller ankommande tid (när man vill anlända till destinationen eller när ex. Bussen lämnar hållplatsen).
- Samtliga hållplatser den hittade rutten kommer stanna på skall visas upp vid hittad resa.
