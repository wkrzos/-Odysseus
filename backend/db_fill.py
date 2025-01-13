import psycopg2
from datetime import datetime

# Połączenie z bazą danych PostgreSQL
def insert_data():
    try:
        connection = psycopg2.connect(
            dbname="odysseus",  # Zmień na nazwę swojej bazy danych
            user="postgres",         # Zmień na nazwę użytkownika
            password="admin",     # Zmień na hasło użytkownika
            host="localhost",             # Host bazy danych (np. localhost)
            port="5432"                   # Port PostgreSQL (domyślnie 5432)
        )
        cursor = connection.cursor()

        # Rozpoczęcie transakcji
        connection.autocommit = False

        # Dodanie adresów
        addresses = [
            ("Main Street", "12A", "5", "Warsaw"),
            ("Second Avenue", "45B", None, "Berlin"),
            ("Park Lane", "7", None, "London"),
        ]

        address_ids = []
        for address in addresses:
            cursor.execute(
                """
                INSERT INTO common_address ("created_at", "updated_at", "street", "building_number", "apartment_number", "locality")
                VALUES (%s, %s, %s, %s, %s, %s)
                RETURNING id;
                """,
                (datetime.now(), datetime.now(), *address)
            )
            address_ids.append(cursor.fetchone()[0])  # Pobierz id wstawionego rekordu

        # Dodanie krajów
        countries = [
            ("PL", "Poland"),
            ("DE", "Germany"),
            ("GB", "United Kingdom"),
        ]

        country_ids = []
        for country in countries:
            cursor.execute(
                """
                INSERT INTO common_country ("created_at", "updated_at", "code", "name")
                VALUES (%s, %s, %s, %s)
                RETURNING id;
                """,
                (datetime.now(), datetime.now(), *country)
            )
            country_ids.append(cursor.fetchone()[0])

        # Dodanie odbiorców
        recipients = [
            ("active", "+48123456789"),
            ("inactive", "+49123456789"),
            ("active", "+44123456789"),
        ]

        recipient_ids = []
        for recipient in recipients:
            cursor.execute(
                """
                INSERT INTO communication_recipient ("created_at", "updated_at", "status", "phone_number")
                VALUES (%s, %s, %s, %s)
                RETURNING id;
                """,
                (datetime.now(), datetime.now(), *recipient)
            )
            recipient_ids.append(cursor.fetchone()[0])

        # Dodanie organizatorów pobytu
        stay_organizers = [
            ("Hotel Warsaw", "hotel"),
            ("Airbnb Berlin", "airbnb"),
            ("Hostel London", "hostel"),
        ]

        stay_organizer_ids = []
        for organizer in stay_organizers:
            cursor.execute(
                """
                INSERT INTO trip_stayorganizer ("created_at", "updated_at", "name", "type")
                VALUES (%s, %s, %s, %s)
                RETURNING id;
                """,
                (datetime.now(), datetime.now(), *organizer)
            )
            stay_organizer_ids.append(cursor.fetchone()[0])

        # Dodanie konsulatów
        consulates = [
            ("Polish Consulate in Berlin", address_ids[1]),  # Użycie odpowiedniego id adresu
            ("German Consulate in Warsaw", address_ids[0]), # Użycie odpowiedniego id adresu
        ]

        consulate_ids = []
        for consulate in consulates:
            cursor.execute(
                """
                INSERT INTO consulate_consulate ("created_at", "updated_at", "name", "address_id")
                VALUES (%s, %s, %s, %s)
                RETURNING id;
                """,
                (datetime.now(), datetime.now(), *consulate)
            )
            consulate_ids.append(cursor.fetchone()[0])

        # Dodanie pracowników konsulatów
        employees = [
            ("John", "Doe", consulate_ids[0]),
            ("Anna", "Kowalska", consulate_ids[1]),
        ]
        employees_ids = []
        for employee in employees:
            cursor.execute(
                """
                INSERT INTO consulate_consulateemployee ("created_at", "updated_at", "name", "surname", "employee_of_id")
                VALUES (%s, %s, %s, %s, %s)
                RETURNING id;
                """,
                (datetime.now(), datetime.now(), *employee)
            )
            employees_ids.append(cursor.fetchone()[0])

        # Dodanie klientów
        clients = [
            ("Adam", "Nowak", "12345678901", "+48123456789", "adam.nowak@example.com", address_ids[0]),
            ("Maria", "Schmidt", "98765432109", "+49123456789", "maria.schmidt@example.com", address_ids[1]),
        ]

        client_ids = []
        for client in clients:
            cursor.execute(
                """
                INSERT INTO registration_clientdata ("created_at", "updated_at", "name", "surname", "pesel", "phone_number", "email_address", "address_id")
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING id;
                """,
                (datetime.now(), datetime.now(), *client)
            )
            client_ids.append(cursor.fetchone()[0])

        # Powiązanie klientów z krajami
        client_countries = [
            (client_ids[0], country_ids[0]),
            (client_ids[1], country_ids[1]),
        ]
        for client_country in client_countries:
            cursor.execute(
                """
                INSERT INTO registration_clientdata_resides_in ("clientdata_id", "country_id")
                VALUES (%s, %s);
                """,
                client_country
            )

        # Dodanie wiadomości
        messages = [
            ("Important consulate update.", "2025-01-10", employees_ids[0]),
            ("Travel warning for Germany.", "2025-01-12", employees_ids[1]),
        ]
        for message in messages:
            cursor.execute(
                """
                INSERT INTO communication_message ("created_at", "updated_at", "content", "date", "author_id")
                VALUES (%s, %s, %s, %s, %s);
                """,
                (datetime.now(), datetime.now(), *message)
            )

        # Dodanie parametrów
        cursor.execute(
            """
            INSERT INTO parameters_parameters ("created_at", "updated_at", "deleteTripAfterDays")
            VALUES (%s, %s, %s);
            """,
            (datetime.now(), datetime.now(), 30)
        )

        # Zatwierdzenie transakcji
        connection.commit()
        print("Dane zostały wprowadzone pomyślnie.")

    except (Exception, psycopg2.Error) as error:
        if connection:
            connection.rollback()
        print("Wystąpił błąd:", error)

    finally:
        if connection:
            cursor.close()
            connection.close()
            print("Połączenie z bazą danych zostało zamknięte.")

if __name__ == "__main__":
    insert_data()
