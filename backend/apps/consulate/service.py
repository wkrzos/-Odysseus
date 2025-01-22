from datetime import datetime,timedelta
from calendar import monthrange
from django.db.models import F
from .models import TripStagesStatistic

class TripStatisticService:
    @staticmethod
    def update_trip_statistics(trip_stages):
        """
        Aktualizuje statystyki podróży na podstawie etapów podróży.
        """
        stats_to_update = {}

        for stage in trip_stages:
            # Wyciągnięcie dat przyjazdu i odjazdu
            arrival_date = datetime.strptime(stage["arrival_date"], "%Y-%m-%d")
            departure_date = datetime.strptime(stage["departure_date"], "%Y-%m-%d")

            # Obliczanie zakresu dat (miesiąc i rok)
            current_date = arrival_date
            while current_date <= departure_date:
                year, month = current_date.year, current_date.month

                # Dodanie do słownika liczników dla month/year
                stats_to_update[(year, month)] = stats_to_update.get((year, month), 0) + 1

                # Przechodzimy do następnego miesiąca
                _, last_day = monthrange(current_date.year, current_date.month)
                next_month = current_date.replace(day=last_day) + timedelta(days=1)
                current_date = next_month.replace(day=1)

        # Aktualizacja lub tworzenie statystyk w bazie
        for (year, month), count in stats_to_update.items():
            stat, created = TripStagesStatistic.objects.get_or_create(
                year=year, month=month,
                defaults={"trip_count": count}
            )
            if not created:
                # Inkrementacja statystyk
                stat.trip_count = F("trip_count") + count
                stat.save()
