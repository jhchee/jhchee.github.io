import os
from notion2md.exporter import markdown_exporter
from notion_client import Client

from utils.properties_util import get_tags, get_title, get_published_date
from utils.os_util import clean_directory, make_directory, move_image_file
from utils.markdown_util import inject_front_matter, get_front_matter
import time
from slugify import slugify
import json


start_time = time.time()

notion = Client(auth=os.environ["NOTION_TOKEN"])
blog_database = notion.databases.query(
    database_id="472c5d14-117e-43bf-807e-c69e69bab9f8",
    **{
        "filter": {"and": [{"property": "public", "checkbox": {"equals": True}}]},
    },
)

blogs = blog_database["results"]

content_directory = os.path.normpath(
    os.path.join(os.path.dirname(__file__), "..", "content", "post")
)
image_directory = os.path.normpath(
    os.path.join(os.path.dirname(__file__), "..", "public", "files")
)

clean_directory(directory=content_directory)
clean_directory(directory=image_directory)


search_metadata_list = []


for blog in blogs:
    blog_id = blog["id"]
    blog_properties = blog["properties"]

    blog_title = get_title(properties=blog_properties)
    blog_tags = get_tags(properties=blog_properties)
    blog_published_date = get_published_date(properties=blog_properties)

    metadata = {}
    metadata["title"] = blog_title
    metadata["slug"] = slugify(blog_title)
    metadata["date"] = blog_published_date
    metadata["tags"] = blog_tags
    metadata["section"] = "blog"
    search_metadata_list.append(metadata)

    print(f"-> Exporting blog id: {blog_id}")

    blog_file_name = slugify(blog_title)
    markdown_exporter(
        block_id=blog_id,
        output_filename=blog_file_name,
        output_path=content_directory,
        download=True,
        unzipped=True,
    )
    blog_front_matter = get_front_matter(
        title=blog_title, published_date=blog_published_date, tags=blog_tags
    )
    blog_file_directory = f"{content_directory}/{blog_file_name}.md"
    inject_front_matter(blog_file_directory, front_matter=blog_front_matter)


move_image_file(content_directory, image_directory)

# search metadata
data_directory = os.path.normpath(os.path.join(os.path.dirname(__file__), "..", "data"))
search_metadata_file = os.path.join(data_directory, "search.json")
with open(search_metadata_file, "w") as file:
    json.dump(search_metadata_list, file)
executing_time = round(time.time() - start_time, 2)
print(f"-> Done exporting blogs in {executing_time}s")
