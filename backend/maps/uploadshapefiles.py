# export PGPASSWORD = mydatabasepassword

# shp2pgsql -D -I -s 4326 -W "utf-8" plots2.shp plot | psql -d Ardhi -U postgres -h localhost -p 5432

# The D flag tells the program to generate “dump format” which is much faster to load than the default “insert format”.

# The I flag tells the program to create a spatial index on the table after loading is complete.

# The s flag tells the program what the “spatial reference identifier (SRID)” of the data is.

# name = request.POST['firstname']


postgis_helper = "https://github.com/tilery/python-postgis"
postgres_helper = "pip install postgres-helper"
import subprocess


def process_file(self, raster_file_path, should_slice):
    """"""
    source_files = []
    # ph = postgis_helper.postgis_helper()
    if should_slice and self.need_slice(raster_file_path):
        """"""
        source_files = self.slice(raster_file_path)
    else:
        """"""
        source_files.append(raster_file_path)

    for sf in source_files:
        """"""
        p = subprocess.Popen(
            [self.gdal_segment, sf, "-out", self.shp_output, "-algo", "LSC"]
        )
        p.communicate()
        psql_env = dict(PGPASSWORD="oHk785V8jG5_")
        p = subprocess.Popen(
            [
                self.shp2pgsql,
                "-a",
                "-S",
                "-t",
                "2D",
                "-g",
                "geo",
                self.shp_output,
                "geobia.superpixel_rgb",
            ],
            stdout=subprocess.PIPE,
        )
        p2 = subprocess.Popen(
            ["/usr/bin/psql", "-p", "5432", "-d", "v4", "-U", "v4", "-h", "127.0.0.1"],
            stdin=p.stdout,
            stdout=subprocess.PIPE,
            env=psql_env,
        )
        p.stdout.close()  # Allow p1 to receive a SIGPIPE if p2 exits.
        output, err = p2.communicate()
        # ph.execute("UPDATE geobia.superpixel_rgb set source_file_id = %s WHERE source_file_id is NULL",
        #            [self.db_file_id])
