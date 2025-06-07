import tempfile
import subprocess
import os

def convert_mermaid_to_svg(mermaid_code: str) -> str:
    # Write Mermaid code to a temporary .mmd file
    with tempfile.NamedTemporaryFile(suffix=".mmd", delete=False) as mmd_file:
        mmd_file.write(mermaid_code.encode())
        mmd_path = mmd_file.name

    svg_path = mmd_path.replace(".mmd", ".svg")

    try:
        # Use mmdc CLI with puppeteer config for Render compatibility
        command = [
            "mmdc",
            "-i", mmd_path,
            "-o", svg_path,
            "-w", "1200",
            "-H", "800",
            "--puppeteerConfigFile", "puppeteer-config.json"
        ]

        subprocess.run(command, check=True)
        
        # Read and return SVG content
        with open(svg_path, "r", encoding="utf-8") as f:
            svg = f.read()

    except subprocess.CalledProcessError as e:
        # You can log or raise a custom error here if you want
        raise RuntimeError(f"Mermaid CLI failed: {e}")

    finally:
        # Clean up temp files safely
        if os.path.exists(mmd_path):
            os.remove(mmd_path)
        if os.path.exists(svg_path):
            os.remove(svg_path)

    return svg
