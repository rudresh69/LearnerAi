import requests
from bs4 import BeautifulSoup
from typing import List, Dict

SEARCH_URL = "https://www.google.com/search?q={}&tbm=isch"
HEADERS = {'User-Agent': 'Mozilla/5.0'}
image_cache = {}

def scrape_images(query: str, max_images: int = 5, size: str = "large") -> List[Dict[str, str]]:
    search_query = f"{query} high resolution" if size == "large" else query
    cache_key = f"{search_query}_{max_images}_{size}"

    # Check in-memory cache
    if cache_key in image_cache:
        return image_cache[cache_key]

    size_param = "&tbs=isz:l" if size == "large" else "&tbs=isz:m"
    response = requests.get(SEARCH_URL.format(search_query) + size_param, headers=HEADERS)
    soup = BeautifulSoup(response.content, "html.parser")

    images = []
    for img in soup.find_all("img", limit=max_images + 1):
        src = img.get("src")
        if src and src.startswith("http"):
            images.append({"url": src, "alt": img.get("alt", f"{query} image")})

    final_images = images[1:] if len(images) > 1 else images
    image_cache[cache_key] = final_images
    return final_images
