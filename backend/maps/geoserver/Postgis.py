# Library import
# from geo.Postgres import Db
from pg.pg import Pg

# ogr2ogr -f PostgreSQL PG:"dbname='databasename' host='addr' port='5432' user='x' password='y'" path_name\geopackage_name.gpkg

import psycopg2

#establishing the connection
conn = psycopg2.connect(database="postgres", user='postgres', password='password', host='127.0.0.1', port= '5432')
conn.autocommit = True

#Creating a cursor object using the cursor() method
cursor = conn.cursor()

#Preparing query to create a database
sql = '''CREATE database mydb''';

#Creating a database
cursor.execute(sql)
print("Database created successfully........")

#Closing the connection
conn.close()



# Initialization of library
pg = Pg(dbname="postgres", user="postgres", password="admin", host="localhost", port="5432")

# Get the column names of the specific table
pg.get_columns_name(table="pg_table")

# Get values from specific column of table
pg.get_values_from_column(column="pg_table_col", table="pg_table", schema="public")

# Create schema
pg.create_schema(name="schema_name")

# Create column
pg.create_column(
    column="col_name", table="pg_table", col_datatype="varchar", schema="public"
)

# Update column
pg.update_column(
    column="col_name",
    value="updated_value",
    table="pg_table",
    where_column="where_col",
    where_value="where_val",
    schema="public",
)

# Delete table
pg.delete_table(name="pg_table", schema="public")

# Delete values
pg.delete_values(table_name="pg_table", condition="name=value", schema="public")
