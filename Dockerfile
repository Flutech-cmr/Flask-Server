FROM ubuntu:focal

# installing software packages

RUN apt-get update
RUN apt-get install python3-pip -y
RUN apt-get install -y git
RUN apt-get install -y wget 
RUN apt-get install -y curl
RUN apt-get install vim nano -y
RUN apt install -y libprotobuf-dev protobuf-compiler
RUN DEBIAN_FRONTEND=noninteractive apt-get -y install cmake 
RUN apt-get install -y libopenblas-dev 
RUN apt-get install -y liblapack-dev 
RUN apt-get install -y libjpeg-dev

# installing python packages

RUN pip3 install --upgrade pip
RUN pip3 install flask-restful
RUN pip3 install numpy
RUN pip3 install dnspython==2.2.1
RUN pip3 install itsdangerous==2.0.1

# Handing opencv dependencies

RUN apt-get update
RUN apt-get install ffmpeg -y

# remove unwanted packages

RUN apt-get autoremove -y
RUN apt-get clean -y


WORKDIR /home/Flutech_ERP
RUN git clone https://github.com/Flutech-cmr/Flask-Server.git
WORKDIR /home/Flutech_ERP/Flask-Server
RUN git pull
COPY parameters.json .
RUN pip3 install -r requirements.txt

EXPOSE 5050
CMD ["python3", "app.py"]
