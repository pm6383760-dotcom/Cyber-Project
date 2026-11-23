import os
import random
import pandas as pd
from feature_extraction import extract_features, FEATURE_NAMES

def generate_synthetic_dataset(output_path="data/phishing_dataset.csv", n_samples=2500):
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    legitimate_roots = [
        "google.com", "youtube.com", "facebook.com", "amazon.com", "wikipedia.org",
        "twitter.com", "instagram.com", "linkedin.com", "apple.com", "microsoft.com",
        "netflix.com", "github.com", "stackoverflow.com", "reddit.com", "cloudflare.com",
        "medium.com", "cnn.com", "nytimes.com", "bbc.co.uk", "espn.com", "walmart.com",
        "target.com", "salesforce.com", "adobe.com", "dropbox.com", "spotify.com",
        "quora.com", "nih.gov", "who.int", "mozilla.org", "w3schools.com"
    ]

    legit_paths = [
        "/search?q=machine+learning", "/docs/getting-started", "/profile/settings",
        "/feed", "/en/article/cybersecurity", "/explore/popular", "/help/faq",
        "/about-us", "/privacy-policy", "/terms-of-service", "/contact-support",
        "/products/electronics", "/dashboard/overview", "/watch?v=dQw4w9WgXcQ"
    ]

    phishing_brands = [
        "paypal", "chase", "wellsfargo", "bankofamerica", "apple-id", "microsoft-login",
        "netflix-verify", "binance-security", "coinbase-wallet", "metamask-auth",
        "steam-gift", "facebook-security", "instagram-badge", "google-docs-share",
        "dhl-tracking-express", "fedex-delivery-confirm", "usps-package-redelivery"
    ]

    phishing_tlds = [
        "xyz", "top", "buzz", "work", "click", "tk", "ml", "ga", "cf", "gq",
        "monster", "club", "surf", "cam", "loan", "rest", "stream", "kim"
    ]

    phishing_keywords = [
        "verify", "login", "account-update", "secure-portal", "credential-check",
        "auth-confirm", "recover-wallet", "claim-bonus", "suspended-notice"
    ]

    rows = []

    # 1. Generate Legitimate URLs (label = 0)
    for _ in range(n_samples // 2):
        root = random.choice(legitimate_roots)
        path = random.choice(legit_paths) if random.random() > 0.3 else ""
        has_sub = random.random() > 0.7
        sub = "www." if not has_sub else f"{random.choice(['docs', 'api', 'help', 'blog', 'app'])}."
        protocol = "https://" if random.random() > 0.05 else "http://"
        url = f"{protocol}{sub}{root}{path}"

        extracted = extract_features(url)
        row = extracted['features'].copy()
        row['url'] = url
        row['label'] = 0  # Legitimate
        rows.append(row)

    # 2. Generate Phishing URLs (label = 1)
    for _ in range(n_samples // 2):
        type_choice = random.random()
        protocol = "http://" if random.random() > 0.4 else "https://"

        if type_choice < 0.25:
            # IP address based phishing
            ip = f"{random.randint(11, 210)}.{random.randint(0, 255)}.{random.randint(0, 255)}.{random.randint(1, 254)}"
            port = f":{random.choice([8080, 8000, 8888, 3000])}" if random.random() > 0.6 else ""
            kw = random.choice(phishing_keywords)
            brand = random.choice(phishing_brands)
            url = f"{protocol}{ip}{port}/{brand}/{kw}.php?token={random.randint(10000, 99999)}"

        elif type_choice < 0.55:
            # Brand spoof with high-risk TLD
            brand = random.choice(phishing_brands)
            tld = random.choice(phishing_tlds)
            kw = random.choice(phishing_keywords)
            sub = f"{random.choice(['secure', 'verify', 'update', 'login'])}." if random.random() > 0.4 else ""
            url = f"{protocol}{sub}{brand}-{kw}.{tld}/index.html?ref={random.randint(1000, 9999)}"

        elif type_choice < 0.80:
            # Deep subdomains brand imitation
            brand = random.choice(phishing_brands)
            legit_imitate = random.choice(["service-auth", "customer-portal", "account-alert"])
            tld = random.choice(["com", "net", "org", "xyz"])
            url = f"{protocol}{brand}.{legit_imitate}.system-update.{tld}/signin?redirect=auth"

        else:
            # Obfuscated long URL with '@' or excessive symbols
            brand = random.choice(phishing_brands)
            tld = random.choice(phishing_tlds)
            noise = "".join(random.choices("abcdef0123456789", k=24))
            at_sym = f"{random.choice(['user', 'client'])}@{brand}." if random.random() > 0.5 else ""
            url = f"{protocol}{at_sym}gateway-{brand}.{tld}/confirm?hash={noise}&session={random.randint(100000, 999999)}"

        extracted = extract_features(url)
        row = extracted['features'].copy()
        row['url'] = url
        row['label'] = 1  # Phishing
        rows.append(row)

    random.shuffle(rows)
    df = pd.DataFrame(rows)
    df.to_csv(output_path, index=False)
    print(f"[Dataset] Generated {len(df)} samples saved to: {output_path}")
    return df

if __name__ == "__main__":
    generate_synthetic_dataset()
