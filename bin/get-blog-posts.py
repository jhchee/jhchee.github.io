from notion_py.notion.client import NotionClient
import os
from exporter import PageExporter
import json
from utils import clean_directory
import json

NOTION_TOKEN = os.getenv("NOTION_TOKEN")
BLOG_DATABASE_URL = "https://www.notion.so/vincentchee/472c5d14117e43bf807ec69e69bab9f8?v=f7b25e0d41154f0baca2db26ce9b6ffb"
ABOUT_PAGE_URL = (
    "https://www.notion.so/vincentchee/About-2c88052ceff04a4ab9f1e02b4c920bd1"
)

client = NotionClient(token_v2=NOTION_TOKEN)
cv = client.get_collection_view(BLOG_DATABASE_URL)

# store markdown files and images in different directories
post_directory = os.path.normpath(
    os.path.join(os.path.dirname(__file__), "..", "content", "post")
)
file_directory = os.path.normpath(
    os.path.join(os.path.dirname(__file__), "..", "public", "files")
)
clean_directory(post_directory)
clean_directory(file_directory)


# Single source of truth json
ssot_json = []

# perform query
# The query params can be obtained from inspecting network tab
post_filter = {
    "operator": "and",
    "filters": [
        {
            "property": "_P;{",
            "filter": {
                "operator": "checkbox_is",
                "value": {"type": "exact", "value": True},
            },
        }
    ],
}


blog_r = cv.build_query(filter=post_filter).execute()

for page in blog_r:
    print(f"-> Fetching (post) page id {page.id}...")
    exporter = PageExporter(
        url=page.id,
        client=client,
        markdown_directory=post_directory,
        file_directory=file_directory,
    )
    exporter.page2md()
    ssot_json.append(exporter.get_metadata())
    exporter.write_file()


# about page
about_directory = os.path.normpath(
    os.path.join(os.path.dirname(__file__), "..", "content", "about")
)
about_page = client.get_block(ABOUT_PAGE_URL)
print(f"-> Fetching (about) page id {about_page.id}...")
exporter = PageExporter(
    url=about_page.id,
    client=client,
    markdown_directory=about_directory,
    file_directory=file_directory,
)
exporter.page2md()
exporter.write_file()

# search ssot
ssot_directory = os.path.normpath(
    os.path.join(os.path.dirname(__file__), "..", "data")
)
ssot_file = os.path.join(ssot_directory, "search.json")
with open(ssot_file, "w") as fp:
    json.dump(ssot_json, fp)