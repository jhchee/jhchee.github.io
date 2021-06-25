import shutil
import os


def clean_directory(directory):
    print(f'-> Cleaning "{directory}" directory')
    try:
        shutil.rmtree(directory)
    except:
        pass
    os.mkdir(directory)


def link_format(name, url):
    return "[" + name + "]" + "(" + "/files/" + url + ")"


def table_to_markdown(table):
    md = ""
    md += join_with_vertical(table[0])
    md += generate_column_separator(table)
    for row in table[1:]:
        if row != table[1]:
            md += "\n"
        md += join_with_vertical(row)
    return md

def generate_column_separator(table):
    column_separator = "\n"
    for i, column in enumerate(table[0]):
        if i == 0:
            column_separator += "| " + "-"*len(column) + " |"
        else:
            column_separator += " " + "-"*len(column) + " |"
    column_separator += "\n"
    return column_separator

def join_with_vertical(list):
    return "| " + " | ".join(list) + " |"


def get_inline_math(block):
    text = ""
    lists = block.get("properties")["title"]
    for list in lists:
        if list[0] == "⁍":
            text += "$$" + list[1][0][1] + "$$"
        else:
            text += list[0]
    return text


def get_text(block):
    return block.title


def frontmatter_list(title, infos):
    matter = ""
    matter += f"{title}:\n"
    for info in infos:
        matter += "- " + info + "\n"
    return matter