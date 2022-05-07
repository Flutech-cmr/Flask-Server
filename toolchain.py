import os
import sys
import time
import requests

commit_message = None
payload = {"to_terminal": "git pull"}
server_url = ["https://comfytronics.in/", "http://143.244.131.26"]

try:
    commit_message = sys.argv[1]
except:
    print("[INFO] This script requires a commit message as an argument. No commit message was provided.\n")
    sys.exit(1)


def iterateversion():
    print("[INFO] Iterating Version")
    f = open("version", "r")
    lines = f.readlines()
    lines = float(lines[0])
    lines += 0.1
    lines = round(lines, 3)
    f.close()
    f = open("version", "r+")
    f.write(str(lines))
    f.close()


# generate requirements.txt
print("[INFO] generating requirements\n")
os.system("pipreqs  --force")

# iterate the version in the version file by 0.1
iterateversion()

# add all files commit them with the message recieved from the system arguements and push
print("[INFO] performing git push\n")
os.system(f'git add --all')
os.system(f'git commit -m "{commit_message}"')
os.system(f'git push')

# sleep for 10 seconds to allow github to refresh
print("[INFO] sleeping for 10 seconds\n")
time.sleep(10)

# check if the server is running
for server in server_url:
    print("[INFO] Checking If Server is running\n")
    r = requests.get(server+"/up")
    if r.status_code == 200:

        # instruct server to perform a git pull if running
        print("[INFO] performing git pull on server\n")
        r = requests.post(server+'/git', json=payload)
        if r.status_code == 200:
            print("[INFO] git pull successful\n")
    else:
        print("[INFO] Server is not running. Exiting\n")

    if(not sys.argv[2]):
        break
    else:
        print("[INFO] Pushing to all servers in the List\n")
