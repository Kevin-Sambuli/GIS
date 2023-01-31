import time

from django.core.management import BaseCommand
from django.db import connections
from django.db.utils import OperationalError
import psycopg2


class Command(BaseCommand):
    """Django command to pause execution until db is available"""

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS("Waiting for database..."))
        db_conn = None
        while not db_conn:
            try:
                db_conn = connections["default"]

                # establishing the connection
                # conn = psycopg2.connect(database="postgres", user='postgres', password='password', host='127.0.0.1',
                #                         port='5432')
                # conn.autocommit = True
                #
                # # Creating a cursor object using the cursor() method
                # cursor = conn.cursor()
                #
                # # Preparing query to create a database
                # sql = '''CREATE database osm''';
                #
                # # Creating a database
                # cursor.execute(sql)
                # print("Database created successfully........")
                #
                # # Closing the connection
                # conn.close()


            except OperationalError:
                self.stderr.write("Database unavailable, waiting 1 second...")
                time.sleep(1)

        self.stdout.write(self.style.SUCCESS("Database available!"))
