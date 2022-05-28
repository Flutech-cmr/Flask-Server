class test:
    def __init__(self) -> None:
        print("init")
    def one(self):
        self.varone=1
        self.two()
    def two(self):
        self.vartwo=2
        newdict={"a":"a","b":"b"}
        print(list(newdict.keys()))
        print(self.varone)
        print(self.vartwo)

tester=test()
tester.one()
