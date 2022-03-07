import os
import sys
import time
import requests

commit_message=sys.argv[1]
payload={"to_terminal":"git pull"}
os.system(f'git add --all')
os.system(f'git commit -m "{commit_message}"')
os.system(f'git push')
time.sleep(10)

r=requests.post('http://164.52.221.158:5050/git',json=payload)