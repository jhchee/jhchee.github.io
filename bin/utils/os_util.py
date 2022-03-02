import os
import shutil


def clean_directory(directory):
    if os.path.exists(directory):
        print(f'-> Cleaning "{directory}" directory')
        shutil.rmtree(directory)
    os.mkdir(directory)


def make_directory(directory):
    if not (os.path.exists(directory)):
        os.mkdir(directory)


def prepend_file(file_directory, prepend_content):
    with open(file_directory, "r+", encoding="utf-8") as f:
        content = f.read()
        f.seek(0, 0)
        f.write(prepend_content + "\n" + content)


def move_image_file(src_folder, dest_folder):
    src_files = os.listdir(src_folder)
    for file in src_files:
        if file.endswith(".png") or file.endswith(".jpeg") or file.endswith(".jpg"):
            shutil.move(
                os.path.join(src_folder, file),
                os.path.join(dest_folder, file),
            )
