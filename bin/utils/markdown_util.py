from .os_util import prepend_file


def get_front_matter(title, section, generated_id, published_date, tags):  # frontmatter
    header = "---\n"
    header += f'title: "{title}"\n'
    header += f'section: "{section}"\n'
    header += f'id: "{generated_id}"\n'
    header += f'date: "{published_date}"\n'
    header += format_frontmatter_list("tags", tags)
    header += "---\n"
    return header


def format_frontmatter_list(title, infos):
    matter = ""
    matter += f"{title}:\n"
    for info in infos:
        matter += "- " + info + "\n"
    return matter


def inject_front_matter(file_directory, front_matter):
    prepend_file(file_directory, front_matter)
