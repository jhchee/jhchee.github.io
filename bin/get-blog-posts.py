from notion_py.notion.client import NotionClient
import os
import time
import os
from exporter import PageExporter
import json
from utils import clean_directory


NOTION_TOKEN = os.getenv('NOTION_TOKEN')
NOTION_DB_URL = os.getenv('NOTION_DB_URL')

client = NotionClient(token_v2=NOTION_TOKEN)
cv = client.get_collection_view(NOTION_DB_URL)

# store markdown files and images in different directories
markdown_directory = os.path.normpath(os.path.join(os.path.dirname(__file__), "..", "content", "blog"))
image_directory = os.path.normpath(os.path.join(os.path.dirname(__file__), "..", "public", "blog", "images"))
clean_directory(markdown_directory)
clean_directory(image_directory)


markdown_pages = {}

# perform query
# aggragations function
aggregations = [
        {"property": "test", "aggregator": "sum", "id": "total_value"}
    ]
# result = cv.build_query(aggregations=aggregations).execute()

for page in cv.collection.get_rows():
    print(f"-> Fetching page id {page.id}...")
    exporter = PageExporter(url=page.id, client=client, markdown_directory=markdown_directory, file_directory=image_directory)
    exporter.page2md()
    exporter.write_file()