import sys
import os

def process_file(input_file, output_file):
    if not os.path.exists(input_file):
        print(f"Error: The input file '{input_file}' does not exist.")
        sys.exit(1)
    
    # Read from input file
    with open(input_file, 'r') as f:
        data = f.read()
    
    # Example processing: convert all text to uppercase
    processed_data = data.upper()
    
    # Write to output file
    with open(output_file, 'w') as f:
        f.write(processed_data)
    
    print(f"Processed data written to {output_file}")

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python process_file.py <input_file> <output_file>")
        sys.exit(1)

    input_file = sys.argv[1]
    output_file = sys.argv[2]
    
    process_file(input_file, output_file)
