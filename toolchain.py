import os
import sys
import time
import requests

try:
    commit_message = sys.argv[1]
except:
    print("\n[INFO] This script requires a commit message as an argument. No commit message was provided.\n")
    sys.exit(1)
payload = {"to_terminal": "git pull"}

print("\n[INFO] generating requirements\n")
os.system("pipreqs  --force")
print("\n[INFO] performing git push\n")
os.system(f'git add --all')
os.system(f'git commit -m "{commit_message}"')
os.system(f'git push')
print("\n[INFO] sleeping for 10 seconds\n")
time.sleep(10)
print("\n[INFO] Checking If Server is running\n")
r=requests.get("http://localhost:5000/up")
if r.status_code == 200:
    print("\n[INFO] performing git pull on server\n")
    r = requests.post('http://localhost:5050/git', json=payload)
else:
    print("\n[INFO] Server is not running. Exiting\n")

time.sleep(10)