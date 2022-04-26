import os

print(os.path.exists(os.path.join(os.getcwd(),"static","generated")))
os.mkdir(os.path.join(os.getcwd(),"static","generated"))