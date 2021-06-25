from notion_py.notion.client import NotionClient
import os
import time
import os
from exporter import PageExporter
import json
from utils import clean_directory


NOTION_TOKEN = "ae7b0231e9722fff0c251bda3f5a9d32bac26f79948ac00c3d69ac7e08d3eda383890e1a5b4d2fc2925cf4d1addce05ca4d3f104debe85b1fdb089ea9b20119e7c1dba1e66c65f3bec839094c0c7"
NOTION_DB_URL = "https://www.notion.so/vincentchee/472c5d14117e43bf807ec69e69bab9f8?v=f7b25e0d41154f0baca2db26ce9b6ffb"

client = NotionClient(token_v2=NOTION_TOKEN)
cv = client.get_collection_view(NOTION_DB_URL)

# store markdown files and images in different directories
markdown_directory = os.path.normpath(os.path.join(os.path.dirname(__file__), "..", "content", "blog"))
image_directory = os.path.normpath(os.path.join(os.path.dirname(__file__), "..", "public", "blog", "images"))
clean_directory(markdown_directory)
clean_directory(image_directory)


markdown_pages = {}

# perform query
# The query params can be obtained from inspecting network tab
filter_params = {
    "filters": [
      {
         "property":"_P;{",
         "filter":{
            "operator":"checkbox_is",
            "value":{
               "type":"exact",
               "value": True
            }
         }
      }
   ],
    "operator": "and"
}

result = cv.build_query(filter=filter_params).execute()

for page in result:
    print(f"-> Fetching page id {page.id}...")
    exporter = PageExporter(url=page.id, client=client, markdown_directory=markdown_directory, file_directory=image_directory)
    exporter.page2md()
    exporter.write_file()