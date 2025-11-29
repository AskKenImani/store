import { useRef, useState } from "react";
import styles from "./ProductForm.module.css";
import axios from "axios";

const API = process.env.REACT_APP_API_URL;
const CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

export default function ProductForm({ onSuccess, initial = null, token }) {
  const [form, setForm] = useState({
    name: initial?.name || "",
    description: initial?.description || "",
    price: initial?.price || "",
    category: initial?.category || "",
    imageUrl: initial?.imageUrl || "",
  });

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef(null);

  const onChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Handle image file selection + upload to Cloudinary
  const onFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const MAX_MB = 8;
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      setUploadError("Unsupported file type. Use JPG/PNG/WEBP/GIF.");
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      setUploadError(`File too large. Max ${MAX_MB} MB.`);
      return;
    }

    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      setUploadError("Cloudinary config missing (cloud name or upload preset).");
      console.error("CLOUD_NAME:", CLOUD_NAME, "UPLOAD_PRESET:", UPLOAD_PRESET);
      return;
    }

    setUploading(true);
    setUploadError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);

      const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

      const { data } = await axios.post(uploadUrl, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 60000,
      });

      setForm((prev) => ({ ...prev, imageUrl: data.secure_url }));
    } catch (err) {
      console.error("Cloudinary upload error:", err);
      if (err?.response?.data) {
        setUploadError(
          err.response.data.error?.message || "Upload failed: " + JSON.stringify(err.response.data)
        );
      } else {
        setUploadError(err.message || "Upload failed");
      }
    } finally {
      setUploading(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const payload = {
        ...form,
        uploadedBy: localStorage.getItem("user_name") || "Manager/Admin",
      };

      if (initial?._id) {
        await axios.put(`${API}/products/${initial._id}`, payload, { headers });
      } else {
        await axios.post(`${API}/products/add`, payload, { headers });
      }

      onSuccess && onSuccess();
      setForm({
        name: "",
        description: "",
        price: "",
        category: "",
        imageUrl: "",
      });
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={submit}>
      <div className={styles.row}>
        <label>Name</label>
        <input name="name" value={form.name} onChange={onChange} required />
      </div>

      <div className={styles.row}>
        <label>Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={onChange}
          required
        />
      </div>

      <div className={styles.grid2}>
        <div className={styles.row}>
          <label>Price (₦)</label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={onChange}
            required
          />
        </div>
        <div className={styles.row}>
          <label>Category</label>
          <input
            name="category"
            value={form.category}
            onChange={onChange}
            required
          />
        </div>
      </div>

      {/* Image upload section */}
      <div className={styles.row}>
        <label>Product Image</label>

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={onFileChange}
        />

        <button
          type="button"
          className={styles.uploadButton}
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Choose Image"}
        </button>

        {form.imageUrl && !uploading && (
          <div className={styles.imagePreview}>
            <small>Image selected:</small>
            <br />
            <a href={form.imageUrl} target="_blank" rel="noreferrer">
              {form.imageUrl}
            </a>
            <br />
            <img
              src={form.imageUrl}
              alt="Preview"
              style={{
                marginTop: "5px",
                maxWidth: "150px",
                maxHeight: "150px",
                borderRadius: "5px",
              }}
            />
          </div>
        )}

        {uploadError && <small className={styles.error}>{uploadError}</small>}
      </div>

      <button
        className={styles.submit}
        type="submit"
        disabled={loading || uploading}
      >
        {loading
          ? "Saving..."
          : initial?._id
          ? "Update Product"
          : "Create Product"}
      </button>
    </form>
  );
}
