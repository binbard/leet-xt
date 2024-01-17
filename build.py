import os
import shutil
import tempfile
import sys
import json

items_to_zip = ['assets', 'css', 'p', 'js', 'index.html']

manifest_firefox = 'manifest-firefox.json'
manifest_chrome = 'manifest-chrome.json'
manifest = 'manifest.json'
created = False


output_zip_dir = '../versions'
if not os.path.isdir(output_zip_dir):
    os.mkdir(output_zip_dir)

with tempfile.TemporaryDirectory() as temp_dir:
    for item in items_to_zip:
        source_path = os.path.join('.', item)
        dest_path = os.path.join(temp_dir, item)
        
        if os.path.isfile(source_path):
            shutil.copy(source_path, dest_path)
        elif os.path.isdir(source_path):
            shutil.copytree(source_path, dest_path)
            
    if os.path.isfile(manifest_chrome) or os.path.isfile(manifest):
        manifest_source = maniefest_chrome if os.path.isfile(manifest_chrome) else manifest
        shutil.copy(manifest_source, os.path.join(temp_dir, manifest))
        version = json.load(open(manifest))['version']
        output_zip_filename = f'{output_zip_dir}/{os.path.basename(os.getcwd())}-chrome-{version}'
        shutil.make_archive(output_zip_filename, 'zip', temp_dir)
        print(f'{output_zip_filename} for Chrome created successfully (using {manifest}).')
        created = 1
        
    if os.path.isfile(manifest_firefox):
        shutil.copy(manifest_firefox, os.path.join(temp_dir, manifest))
        version = json.load(open(manifest_firefox))['version']
        output_zip_filename = f'{output_zip_dir}/{os.path.basename(os.getcwd())}-firefox-{version}'
        shutil.make_archive(output_zip_filename, 'zip', temp_dir)
        print(f'{output_zip_filename} for Firefox created successfully (using {manifest_firefox}).')
        created = 1

if not created:
    print(f'Can\'t create a new version: No {manifest_chrome} or {manifest_firefox} Found')