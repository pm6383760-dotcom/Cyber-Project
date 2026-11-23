import os
import json
import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix
from feature_extraction import FEATURE_NAMES
from generate_dataset import generate_synthetic_dataset

def train_and_evaluate(dataset_path="data/phishing_dataset.csv", model_dir="model"):
    os.makedirs(model_dir, exist_ok=True)

    if not os.path.exists(dataset_path):
        print("[Training] Dataset not found. Generating synthetic cybersecurity dataset...")
        df = generate_synthetic_dataset(dataset_path)
    else:
        df = pd.read_csv(dataset_path)

    X = df[FEATURE_NAMES]
    y = df['label']

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    print(f"[Training] Training Random Forest Classifier on {len(X_train)} samples...")
    clf = RandomForestClassifier(
        n_estimators=100,
        max_depth=15,
        min_samples_split=4,
        random_state=42,
        n_jobs=-1
    )
    clf.fit(X_train, y_train)

    y_pred = clf.predict(X_test)
    y_prob = clf.predict_proba(X_test)[:, 1]

    acc = float(accuracy_score(y_test, y_pred))
    prec = float(precision_score(y_test, y_pred))
    rec = float(recall_score(y_test, y_pred))
    f1 = float(f1_score(y_test, y_pred))
    cm = confusion_matrix(y_test, y_pred).tolist()

    # Calculate feature importances
    importances = clf.feature_importances_
    feature_ranking = sorted(
        [{"feature": name, "importance": round(float(imp), 4)} for name, imp in zip(FEATURE_NAMES, importances)],
        key=lambda x: x["importance"],
        reverse=True
    )

    metadata = {
        "model_name": "PhishGuard Random Forest URL Classifier",
        "algorithm": "Random Forest (n_estimators=100, max_depth=15)",
        "accuracy": round(acc, 4),
        "precision": round(prec, 4),
        "recall": round(rec, 4),
        "f1_score": round(f1, 4),
        "confusion_matrix": {
            "true_negative": cm[0][0],
            "false_positive": cm[0][1],
            "false_negative": cm[1][0],
            "true_positive": cm[1][1]
        },
        "features": FEATURE_NAMES,
        "feature_ranking": feature_ranking,
        "total_training_samples": len(X_train),
        "total_test_samples": len(X_test)
    }

    model_file = os.path.join(model_dir, "phishguard_rf.joblib")
    meta_file = os.path.join(model_dir, "model_metadata.json")

    joblib.dump(clf, model_file)
    with open(meta_file, "w") as f:
        json.dump(metadata, f, indent=2)

    print(f"[Training] Model successfully saved to: {model_file}")
    print(f"[Training] Accuracy: {acc * 100:.2f}% | Precision: {prec * 100:.2f}% | F1: {f1 * 100:.2f}%")
    return metadata

if __name__ == "__main__":
    train_and_evaluate()
