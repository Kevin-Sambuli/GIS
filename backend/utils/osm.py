import psycopg2
from .dbhelper import Pg

conn = None
try:
    # connect to the PostgreSQL server
    print('Connecting to the PostgreSQL database...')
    conn = psycopg2.connect(
        host='localhost',
        dbname='For_Practice',
        user='postgres',
        password='321654',
        port=5432
    )

    # Creating a cursor with name cur.
    cur = conn.cursor()
    print('Connected to the PostgreSQL database')

    # Execute a query:
    # To display the PostgreSQL
    # database server version
    cur.execute('SELECT version()')
    print(cur.fetchone())

    # Close the connection
    cur.close()

except(Exception, psycopg2.DatabaseError) as error:
    print(error)
finally:
    if conn is not None:
        conn.close()
        print('Database connection closed.')
