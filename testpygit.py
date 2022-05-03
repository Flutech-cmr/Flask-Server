import pygit2
import os

cwd=os.getcwd()
repo = pygit2.Repository(cwd)

print(repo.head.name)
print(repo.head.target)

# perform git pull
repo.remotes['origin'].fetch()