import sys

def extract():
    try:
        import pypdf
        reader = pypdf.PdfReader("app/uploads/resume/a8c3ae19-6f94-40f5-82a0-5cd3c73ab7c2.pdf")
        for i, page in enumerate(reader.pages):
            print(f"--- Page {i+1} ---")
            print(page.extract_text())
        return
    except ImportError:
        pass

    try:
        import PyPDF2
        reader = PyPDF2.PdfReader("app/uploads/resume/a8c3ae19-6f94-40f5-82a0-5cd3c73ab7c2.pdf")
        for i, page in enumerate(reader.pages):
            print(f"--- Page {i+1} ---")
            print(page.extract_text())
        return
    except ImportError:
        pass

    try:
        import fitz # PyMuPDF
        doc = fitz.open("app/uploads/resume/a8c3ae19-6f94-40f5-82a0-5cd3c73ab7c2.pdf")
        for i, page in enumerate(doc):
            print(f"--- Page {i+1} ---")
            print(page.get_text())
        return
    except ImportError:
        pass

    print("No PDF extraction library found")

if __name__ == "__main__":
    extract()
