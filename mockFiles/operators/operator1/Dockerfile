FROM python:3.9

WORKDIR /app

COPY operator.py .

CMD ["python", "operator.py", "*input*", "*output*"]

# List all Python files, and then run the first one found
# CMD ["sh", "-c", "echo 'Listing all Python files 1:' && ls && cd shared && echo 'Listing all Python files 2:' && ls &&  echo 'Running first Python file:' && python $(ls *.py | head -n 1)"]
