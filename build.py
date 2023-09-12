import os
import shutil
import tempfile
import sys

items_to_zip = ['assets', 'css', 'icons', 'js', 'background.js', 'index.html', 'popup.html']

manifest = 'manifest.json'
manifest_firefox = 'manifest-firefox.json'
manifest_chrome = 'manifest-chrome.json'
manifest_source = ''
if '-f' in sys.argv and os.path.isfile(manifest_firefox):
    manifest_source = manifest_firefox
elif os.path.isfile(manifest_chrome):
    manifest_source = manifest_chrome
else:
    manifest_source = manifest

output_zip_filename = '../' + os.path.basename(os.getcwd()) + '.zip'

with tempfile.TemporaryDirectory() as temp_dir:
    for item in items_to_zip:
        source_path = os.path.join('.', item)
        dest_path = os.path.join(temp_dir, item)
        
        if os.path.isfile(source_path):
            shutil.copy(source_path, dest_path)
        elif os.path.isdir(source_path):
            shutil.copytree(source_path, dest_path)

    shutil.copy(manifest_source, os.path.join(temp_dir, manifest))

    shutil.make_archive(output_zip_filename[:-4], 'zip', temp_dir)


print(*items_to_zip, sep=', ')
if manifest_source==manifest_firefox:
    print(f'{output_zip_filename} for Firefox created successfully')
else:
    print(f'{output_zip_filename} for Chrome created successfully.')
