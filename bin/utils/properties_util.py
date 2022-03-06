def get_tags(properties):
    tag_objects = properties["tags"]["multi_select"]
    tags = []
    try:
        tags = [
            tag_object["name"] for tag_object in tag_objects if tag_object["name"] != ""
        ]
    except:
        tags = []
    return tags


def get_title(properties):
    return properties["title"]["title"][0]["plain_text"]


def get_section(properties):
    return properties["section"]["select"]["name"]


def get_published_date(properties):
    return properties["published date"]["date"]["start"]
