"use client";

import React, { useState, useRef } from "react";
import styles from "./ImportModal.module.css";
import { Icon } from "@iconify/react";

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess?: (fileName: string) => void;
}

export default function ImportModal({ isOpen, onClose, onUploadSuccess }: ImportModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleSubmit = () => {
    if (selectedFile && onUploadSuccess) {
      onUploadSuccess(selectedFile.name);
    }
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Upload File</h2>
          <button className={styles.btnClose} onClick={onClose} aria-label="Close modal">
            <Icon icon="lucide:x" width={18} />
          </button>
        </div>

        {/* Body */}
        <div className={styles.modalBody}>
          <div
            className={`${styles.dropzone} ${isDragOver ? styles.dropzoneActive : ""}`}
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <div className={styles.iconBadge}>
              <Icon icon="lucide:file-up" width={24} />
            </div>

            <div className={styles.textGroup}>
              <span className={styles.primaryText}>Select a file to upload</span>
              <span className={styles.subText}>or drag and drop it here</span>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              className={styles.fileInput}
              accept=".csv,.xlsx,.xls,.pdf"
              onChange={handleFileChange}
            />
          </div>

          {/* Selected File Feedback */}
          {selectedFile && (
            <div className={styles.selectedFileBox}>
              <div className={styles.fileInfo}>
                <Icon icon="lucide:file-text" width={18} style={{ color: "#E8692A" }} />
                <div>
                  <div className={styles.fileName}>{selectedFile.name}</div>
                  <div className={styles.fileSize}>{(selectedFile.size / 1024).toFixed(1)} KB</div>
                </div>
              </div>
              <button className={styles.btnRemoveFile} onClick={() => setSelectedFile(null)} title="Remove file">
                <Icon icon="lucide:trash-2" width={16} />
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={styles.modalFooter}>
          <span className={styles.footerLinkOrange} onClick={() => alert("Redirecting to Uploaded History...")}>
            Uploaded History
          </span>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span className={styles.footerLinkBlue} onClick={() => alert("Downloading Excel Template...")}>
              Download Template
            </span>

            {selectedFile && (
              <button className={styles.btnUploadSubmit} onClick={handleSubmit}>
                Upload
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
