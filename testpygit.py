import pygit2
import os

cwd=os.getcwd()
repo = pygit2.Repository(cwd)

# add all changes
repo.stage(['testpygit.py'])

# commit changes
repo.create_commit('HEAD', pygit2.Signature('Test Pygit'