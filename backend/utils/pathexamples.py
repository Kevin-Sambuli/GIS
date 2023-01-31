# import pathlib
#
# p = pathlib.Path(__file__)
# print(p) # C:\Users\DELL\Desktop\webGIS\backend\webgis\pathexamples.py
#
# print("pathexamples=======>", pathlib.PurePath(p).stem)  # prints the name of the last file in the file path
# print("pathexamples.py=======>", pathlib.PurePath(p).name)  # prints the name of the last file in the file path
# print(".py=====>", pathlib.PurePath(p).suffix)  # prints the extension of the last file in the file path
#
#
# p = pathlib.PurePath('/src/goo/scripts/main.py')
# p.is_absolute()
# # True
#
# o = pathlib.PurePath('scripts/main.py')
# o.is_absolute()
# # False
#
# p = pathlib.PurePath('/src/goo/scripts/main.py')
# p.is_relative_to('/src')
# # True
#
# p.is_relative_to('/data')
# # False
#
# In [*]: p = pathlib.PurePath('/src/goo')
#         p.joinpath('scripts', 'main.py')
#
# Out[*]: PurePosixPath('/src/goo/scripts/main.py')
#
#
# In [*]: pathlib.PurePath('/src/goo/scripts/main.py').match('*.py')
# Out[*]: True
#
# In [*]: pathlib.PurePath('/src/goo/scripts/main.py').match('goo/*.py')
# Out[*]: True
#
# In [*]: pathlib.PurePath('src/goo/scripts/main.py').match('/*.py')
# Out[*]: False
#
#
#
# In [*]: p = pathlib.Path('/src/goo/scripts/main.py')
#         p.is_relative_to('/src')
#
# Out[*]: True
#
#
#
# data
# 	population.json
# 	density.json
# 	temperature.yml
# 	stats.md
# 	details.txt
# data folder
# To return the content of /data directory, you can use .iterdir() method here:
#
# In [*]: p = pathlib.Path('/data')
#
#         for child in p.iterdir():
#         	print(child)
#
# Out[*]: PosixPath('/data/population.json')
#          PosixPath('/data/density.json')
#          PosixPath('/data/temprature.yml')
#          PosixPath('/data/stats.md')
#          PosixPath('/data/details.txt')
#
#
#  p = pathlib.Path('density.json').exists()
#         p
# Out[*]: True
# The .exists() method returns True because the given file exists in the data directory. The method returns False if the file doesn't exist.
#
# In [*]: p = pathlib.Path('aliens.py').exists()
#         p
# Out[*]: Falsez


from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve(strict=True)
# C:\Users\DELL\Desktop\webGIS\backend\webgis\pathexamples.py

BASE_DIR1 = Path(__file__).resolve(strict=True).parent
# C:\Users\DELL\Desktop\webGIS\backend\webgis

BASE_DIR2 = Path(__file__).resolve(strict=True).parent.parent
# C:\Users\DELL\Desktop\webGIS\backend

BASE_DIR3 = Path(__file__).resolve(strict=True).parent.parent.parent  #
# C:\Users\DELL\Desktop\webGIS

# print(BASE_DIR)
# print(BASE_DIR1)
# print(BASE_DIR2)
# print(BASE_DIR3)

ROOT_DIR = Path(__file__).resolve(strict=True).parent.parent.parent
# print(ROOT_DIR)


import os

cmd = "date"
# cmd = "notepad"
# cmd = "code"
# os.system(cmd)

print(os.listdir("."))


def create_file(file):
    with open(file, "w") as fobj:
        file = fobj.write("this is the file you created")
        path = os.open(os.path.abspath(file))

    return file


def main():
    file_name = input("enter the file you want to open: ")
    find = read_file(file_name)


main()
