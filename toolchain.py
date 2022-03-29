import os
import sys
import time
import requests

try:
    commit_message = sys.argv[1]
except:
    print("\n[INFO] This script requires a commit message as an argument. No commit message was provided.\n")
    sys.exit(1)

def iterateversion():
    print("[INFO] Iterating Version")
    f=open("version","r")
    lines=f.readlines()
    lines=float(lines[0])
    lines+=0.1
    f.close()
    f=open("version","r+")
    f.write(str(lines))
    f.close()

payload = {"to_terminal": "git pull"}
server_url="https://comfytronics.in/"
print("\n[INFO] generating requirements\n")
os.system("pipreqs  --force")
iterateversion()
print("\n[INFO] performing git push\n")
os.system(f'git add --all')
os.system(f'git commit -m "{commit_message}"')
os.system(f'git push')
print("\n[INFO] sleeping for 10 seconds\n")
time.sleep(10)
print("\n[INFO] Checking If Server is running\n")
r=requests.get(server_url+"/up")
if r.status_code == 200:
    print("\n[INFO] performing git pull on server\n")
    r = requests.post(server_url+'/git', json=payload)
    if r.status_code == 200:
        print("\n[INFO] git pull successful\n")
else:
    print("\n[INFO] Server is not running. Exiting\n")
