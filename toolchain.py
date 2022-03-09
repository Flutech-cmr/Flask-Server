import os
import sys
import time
import requests

try:
    commit_message = sys.argv[1]
except:
    print("This script requires a commit message as an argument. No commit message was provided.")
    sys.exit(1)
payload = {"to_terminal": "git pull"}

print("[INFO} generating requirements")
os.system("pipreqs  --force")
print("[INFO} performing git push")
os.system(f'git add --all')
os.system(f'git commit -m "{commit_message}"')
os.system(f'git push')
print("[INFO] sleeping for 10 seconds")
time.sleep(10)
print("[INFO] performing git pull on server")
r = requests.post('http://localhost:5050/git', json=payload)
