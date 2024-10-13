#!/bin/bash

if ! dpkg -l | grep -qw "python3-pip" || ! dpkg -l | grep -qw "python3-venv"
then
	echo "apt update"
	sudo apt update
	echo "apt install python3-pip python3-venv"
	sudo apt-get install -y python3-pip python3-venv
fi

python3 -m venv .venv
. $(pwd)/.venv/bin/activate
pip install -r requirement.txt
export FLASK_APP=flaskr/index.py
export FLASK_ENV=development