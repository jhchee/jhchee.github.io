import os
from notion2md.exporter import markdown_exporter
from notion_client import Client

from utils.properties_util import get_tags, get_title, get_published_date, get_section
from utils.os_util import clean_directory, make_directory, move_image_file
from utils.markdown_util import inject_front_matter, get_front_matter
import time
from slugify import slugify
import json


start_time = time.time()

notion = Client(auth=os.environ["NOTION_TOKEN"])
post_database = notion.databases.query(
    database_id="472c5d14-117e-43bf-807e-c69e69bab9f8",
    **{
        "filter": {"and": [{"property": "public", "checkbox": {"equals": True}}]},
    },
)

posts = post_database["results"]

content_directory = os.path.normpath(
    os.path.join(os.path.dirname(__file__), "..", "content")
)
image_directory = os.path.normpath(
    os.path.join(os.path.dirname(__file__), "..", "public", "files")
)

clean_directory(directory=content_directory)
clean_directory(directory=image_directory)


search_metadata_list = []


for post in posts:
    post_id = post["id"]
    post_properties = post["properties"]

    post_title = get_title(properties=post_properties)
    post_tags = get_tags(properties=post_properties)
    post_published_date = get_published_date(properties=post_properties)
    post_section = get_section(properties=post_properties)

    metadata = {}
    metadata["title"] = post_title
    metadata["slug"] = slugify(post_title)
    metadata["date"] = post_published_date
    metadata["tags"] = post_tags
    metadata["section"] = post_section
    search_metadata_list.append(metadata)

    print(f"-> Exporting post id: {post_id}")

    file_name = slugify(post_title)
    markdown_exporter(
        block_id=post_id,
        output_filename=file_name,
        output_path=content_directory,
        download=True,
        unzipped=True,
    )
    front_matter = get_front_matter(
        title=post_title,
        section=post_section,
        published_date=post_published_date,
        tags=post_tags,
    )
    file_directory = f"{content_directory}/{file_name}.md"
    inject_front_matter(file_directory, front_matter=front_matter)


move_image_file(content_directory, image_directory)

# search metadata
data_directory = os.path.normpath(os.path.join(os.path.dirname(__file__), "..", "data"))
search_metadata_file = os.path.join(data_directory, "search.json")
with open(search_metadata_file, "w") as file:
    json.dump(search_metadata_list, file)
executing_time = round(time.time() - start_time, 2)
print(f"-> Done exporting posts in {executing_time}s")
