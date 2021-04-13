import os
import requests
from datetime import datetime
from slugify import slugify
from utils import (
    link_format,
    table_to_markdown,
    join_with_vertical,
    get_inline_math,
    get_text,
    frontmatter_list,
)

class PageExporter:
    def __init__(
        self, url, client, markdown_directory, file_directory
    ):  # class variables
        self.client = client  # pass client
        self.page = self.client.get_block(url)  # get page
        self.title = self.page.title  # get page title
        self.markdown_directory = markdown_directory
        self.file_name = self.__set_filename(self.title)  # custom set file name function
        self.__create_file(self.file_name)
        self.file_directory = file_directory

        self.md = self.__page_header()  # markdown content, prepend with frontmatter
        self.file_count = 0

    def __create_file(self, file_name):
        file_path = os.path.join(self.markdown_directory, file_name + ".md")
        self.file = open(file_path, "w")  # replace current content if exists
        return file_path

    def write_file(self):
        self.file.write(self.md)
        self.file.close()

    def __set_filename(self, page_title):
        file_name = slugify(page_title)
        return file_name

    def __download_file(self, file_url):
        r = requests.get(file_url, stream=True)

        ext = r.headers["content-type"].split("/")[-1]

        tmp_file_name = f"tmp.{ext}"
        tmp_file_path = os.path.join(self.file_directory, tmp_file_name)

        # open the file to write as binary - replace 'wb' with 'w' for text files
        with open(tmp_file_path, "wb") as f:
            # iterate on stream using 1KB packets
            for chunk in r.iter_content(1024):
                f.write(chunk)  # write the file

        final_file_name = f"{self.file_name}_{self.file_count}.{ext}"
        self.file_count += 1
        final_file_path = os.path.join(self.file_directory, final_file_name)

        os.rename(tmp_file_path, final_file_path)

        return final_file_name

    def __page_header(self):  # frontmatter
        header = "---\n"
        header += f'title: "{self.title}"\n'
        header += f'date: "{self.__get_published_date()}"\n'
        header += f'description: "{self.__get_description()}"\n'

        tags = self.__get_tags()
        header += frontmatter_list("tags", tags)

        header += "---\n"
        return header

    def __get_tags(self):
        # get the tags (from a relational database)
        try:
            tags = [f'"{tag.title}"' for tag in self.page.tags if tag is not None]
        except:
            tags = []
        return tags
    
    def __get_description(self):
        # get the tags (from a relational database)
        try:
            description = self.page.get_property("description")
        except:
            description = ""
        return description

    def __get_published_date(self):
        try:
            date = self.page.get_property("published time")
            print(date)
            formatted_date = date.strftime("%Y-%m-%d")
            return formatted_date
        except:
            return datetime.today().strftime('%Y-%m-%d')
        

    def __block2md(self, block, params, text_prefix=""):
        result = ""
        if params["tap_count"] != 0:
            result += "\n"
            for i in range(params["tap_count"]):
                result += "\t"
        try:
            btype = block.type
        except:
            pass
        if btype != "numbered_list":
            params["num_index"] = 0  # reinitialize
        try:
            bt = block.title
        except:
            pass
        if btype == "header":
            result += "# " + get_text(block)
        if btype == "sub_header":
            result += "## " + get_text(block)
        if btype == "sub_sub_header":
            result += "### " + get_text(block)
        if btype == "text":
            result += text_prefix + get_text(block)
        if btype == "bookmark":
            result += link_format(bt, block.link)
        if (
            btype == "video"
            or btype == "file"
            or btype == "audio"
            or btype == "pdf"
            or btype == "gist"
        ):
            result += link_format(block.source, block.source)
        if btype == "bulleted_list" or btype == "toggle":
            try:
                result += "- " + get_inline_math(block)
            except:
                result += "- " + bt
        if btype == "numbered_list":
            params["num_index"] += 1
            try:
                result += str(params["num_index"]) + ". " + get_inline_math(block)
            except:
                result += str(params["num_index"]) + ". " + bt
        if btype == "image":
            img_path = self.__download_file(block.source)
            result += "!" + link_format(img_path, img_path)
        if btype == "code":
            result += "``` " + block.language.lower() + "\n" + block.title + "\n```"
        if btype == "equation":
            result += "$$" + block.latex + "$$"
        if btype == "divider":
            result += "---"
        if btype == "to_do":
            if block.checked:
                result += "- [x] " + bt
            else:
                result += "- [ ] " + bt

        if btype == "quote":
            result += "> " + bt
        if btype == "column" or btype == "column_list":
            result += ""
        if btype == "collection_view":
            collection = block.collection
            result += self.__make_table(collection)
        if block.children and btype != "page":
            params["tap_count"] += 1
            for child in block.children:
                result += self.__block2md(child, params=params, prefix=" ")
        return result

    def page2md(self, page=None):
        params = {"tap_count": 0, "img_count": 0, "num_index": 0}
        if page is None:
            page = self.page
        for block in page.children:
            if block != page.children[0]:
                self.md += "\n\n"
            try:
                self.md += self.__block2md(block, params=params)
            except Exception as e:
                print(e)
                self.md += ""

    def __make_table(self, collection):
        columns = []
        row_blocks = collection.get_rows()
        schema = row_blocks[0].schema
        schema.insert(0, schema[-1])
        schema.pop() # move last column to first (weird behavior of the api) 
        for proptitle in schema:
            prop = proptitle["name"]
            if prop == "Name":
                columns.insert(0, prop)
            else:
                columns.append(prop)
        table = []
        table.append(columns)
        for row in row_blocks:
            row_content = []
            for column in columns:
                if column == "Name" and row.get("content") is not None:
                    content = self.__block2md(row)
                else:
                    content = row.get_property(column)
                if str(type(content)) == "<class 'list'>":
                    content = ", ".join(content)
                if str(type(content)) == "<class 'datetime.datetime'>":
                    content = content.strftime("%b %d, %Y")
                if column == "Name":
                    row_content.insert(0, content)
                else:
                    row_content.append(content)
            table.append(row_content)
        return table_to_markdown(table)