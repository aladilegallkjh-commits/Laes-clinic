import sys
from PIL import Image

def process_image(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    data = img.getdata()
    
    new_data = []
    width, height = img.size
    
    # We want to isolate the circle. Usually the circle is in the top 60% of the image.
    # Text is usually in the bottom 40%.
    # Let's find the bounding box of the non-black pixels in the top 65% of the image.
    
    min_x, min_y = width, height
    max_x, max_y = 0, 0
    
    for y in range(height):
        for x in range(width):
            r, g, b, a = data[y * width + x]
            # If it's black or very dark, make it transparent
            if r < 15 and g < 15 and b < 15:
                new_data.append((0, 0, 0, 0))
            else:
                # Keep it, but if it's in the top 65%, consider it part of the logo
                # Actually, the text might be around 70%. Let's crop it.
                if y < height * 0.65:
                    new_data.append((r, g, b, a))
                    if x < min_x: min_x = x
                    if x > max_x: max_x = x
                    if y < min_y: min_y = y
                    if y > max_y: max_y = y
                else:
                    # Ignore anything below 65% (make it transparent) to remove text
                    new_data.append((0, 0, 0, 0))
                    
    img.putdata(new_data)
    
    # Add a small padding
    padding = 10
    min_x = max(0, min_x - padding)
    min_y = max(0, min_y - padding)
    max_x = min(width, max_x + padding)
    max_y = min(height, max_y + padding)
    
    # Crop to the logo
    cropped = img.crop((min_x, min_y, max_x, max_y))
    cropped.save(output_path, "PNG")
    print(f"Saved cropped image to {output_path}")

if __name__ == "__main__":
    process_image(sys.argv[1], sys.argv[2])
