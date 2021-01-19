from genanki import Model

def cloze_overlapper(id, name, css):
    file_path = open("./template/cloze_overlapper_format.html")
    with open(file_path, "r", encoding="utf-8") as file:
        tmpl = file.read()
        return Model(id, name,
        fields=[
                {"name": "Index"},
                {"name": "Title"},
                {"name": "Content"},
                {"name": "All"},
            ],
            templates=[
                {
                    "name": "n2a-cloze-overlapper",
                    "qfmt": tmpl,
                    "afmt": tmpl
                }
            ],
            css=css,
        )