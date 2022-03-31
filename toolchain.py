import os
import sys
import time
import requests

try:
    commit_message = sys.argv[1]
except:
    print("[INFO] This script requires a commit message as an argument. No commit message was provided.\n")
    sys.exit(1)

def iterateversion():
    print("[INFO] Iterating Version")
    f=open("version","r")
    lines=f.readlines()
    lines=float(lines[0])
    lines+=0.1
    lines=round(lines,3)
    f.close()
    f=open("version","r+")
    f.write(str(lines))
    f.close()

payload = {"to_terminal": "git pull"}
server_url="https://comfytronics.in/"
print("[INFO] generating requirements\n")
os.system("pipreqs  --force")
iterateversion()
print("[INFO] performing git push\n")
os.system(f'git add --all')
os.system(f'git commit -m "{commit_message}"')
os.system(f'git push')
print("[INFO] sleeping for 10 seconds\n")
time.sleep(10)
print("[INFO] Checking If Server is running\n")
r=requests.get(server_url+"/up")
if r.status_code == 200:
    print("[INFO] performing git pull on server\n")
    r = requests.post(server_url+'/git', json=payload)
    if r.status_code == 200:
        print("[INFO] git pull successful\n")
else:
    print("[INFO] Server is not running. Exiting\n")
